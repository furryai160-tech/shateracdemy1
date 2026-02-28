import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService) { }

    async getStats(currentUser?: any) {
        const whereUser: any = {};
        const whereCourse: any = {};
        const whereEnrollment: any = {};

        if (currentUser && currentUser.role === 'TEACHER') {
            whereUser.tenantId = currentUser.tenantId;
            whereUser.role = 'STUDENT';

            whereCourse.tenantId = currentUser.tenantId;

            whereEnrollment.course = {
                tenantId: currentUser.tenantId
            };
        }

        const totalUsers = await this.prisma.user.count({ where: whereUser });
        const totalCourses = await this.prisma.course.count({ where: whereCourse });
        const totalEnrollments = await this.prisma.enrollment.count({ where: whereEnrollment });

        // Revenue would be tracked via Stripe or an Order model which we don't have yet.
        // We can estimate based on Enrollments x Course Price
        const enrollments = await this.prisma.enrollment.findMany({
            where: whereEnrollment,
            include: { course: true }
        });

        // This is a naive revenue calc assuming all enrollments paid full price
        const estimatedRevenue = enrollments.reduce((sum: number, e: any) => sum + Number(e.course.price), 0);

        return {
            totalUsers,
            totalCourses,
            totalEnrollments,
            revenue: estimatedRevenue
        };
    }

    async getAllUsers(currentUser?: any) {
        const where: any = {};

        if (currentUser && currentUser.role === 'TEACHER') {
            where.tenantId = currentUser.tenantId;
            where.role = 'STUDENT';
            // Optional: Filter by grade level if needed, but tenant isolation is the primary requirement.
        }

        const users = await this.prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                gradeLevel: true,
                phone: true,
                parentPhone: true,
                createdAt: true,
                tenant: {
                    select: { name: true }
                },
                enrollments: {
                    select: {
                        course: {
                            select: {
                                tenant: {
                                    select: { name: true }
                                }
                            }
                        }
                    },
                    take: 1
                },
                _count: {
                    select: { enrollments: true }
                }
            }
        });

        return users.map(user => {
            let userTenant = user.tenant;
            if (!userTenant && user.enrollments?.length > 0) {
                userTenant = user.enrollments[0].course?.tenant as any;
            }
            const { enrollments, ...rest } = user;
            return {
                ...rest,
                tenant: userTenant
            };
        });
    }

    async createUser(data: any, currentUser?: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role || 'STUDENT',
                gradeLevel: data.gradeLevel,
                password: hashedPassword,
                tenantId: currentUser?.role === 'TEACHER' ? currentUser.tenantId : undefined
            }
        });
    }

    async getAllCourses(currentUser?: any) {
        const where: any = {};

        if (currentUser && currentUser.role === 'TEACHER') {
            where.tenantId = currentUser.tenantId;
        }

        return this.prisma.course.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { enrollments: true, lessons: true }
                }
            }
        });
    }

    async getTenantCourses(tenantId: string) {
        return this.prisma.course.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { enrollments: true, lessons: true }
                }
            }
        });
    }

    async manageEnrollment(userId: string, courseId: string, action: 'enroll' | 'unenroll') {
        if (action === 'enroll') {
            return this.prisma.enrollment.create({
                data: {
                    userId,
                    courseId
                }
            });
        } else {
            return this.prisma.enrollment.deleteMany({
                where: {
                    userId,
                    courseId
                }
            });
        }
    }

    // Teacher Requests Management

    async getTeacherRequests() {
        return this.prisma.teacherRequest.findMany({
            orderBy: { createdAt: 'desc' }
        });
    }

    async approveTeacherRequest(requestId: string) {
        const request = await this.prisma.teacherRequest.findUnique({
            where: { id: requestId }
        });

        if (!request) {
            throw new Error('Request not found');
        }

        if (request.status !== 'PENDING') {
            throw new Error('Request already processed');
        }

        // 1. Create Tenant (School)
        // Ensure subdomain is unique. For now, we assume frontend validated or we catch error
        // Simplified: use domain as subdomain. 
        // In real app, we should probably sanitize 'domain' to be a valid subdomain (no spaces, lowercase)
        const subdomain = request.domain.toLowerCase().replace(/[^a-z0-9-]/g, '');

        const tenant = await this.prisma.tenant.create({
            data: {
                name: request.name,
                subdomain: subdomain,
                mobileNumber: request.phone,
                subject: request.subject,
                grades: request.grades as any, // Cast Json to string[]
                isActive: false // Admin must explicitely activate
            }
        });

        // 2. Create User
        const user = await this.prisma.user.create({
            data: {
                name: request.name,
                email: request.email,
                phone: request.phone,
                password: request.password, // Already hashed
                role: 'TEACHER',
                tenantId: tenant.id
            }
        });

        // 3. Mark request as approved
        await this.prisma.teacherRequest.update({
            where: { id: requestId },
            data: { status: 'APPROVED' }
        });

        return { user, tenant };
    }

    async rejectTeacherRequest(requestId: string, reason?: string) {
        return this.prisma.teacherRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                adminNotes: reason
            }
        });
    }

    async activateTenant(tenantId: string, startDate: Date, endDate: Date) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                isActive: true,
                subscriptionStart: startDate,
                subscriptionEnd: endDate
            }
        });
    }

    async deactivateTenant(tenantId: string) {
        return this.prisma.tenant.update({
            where: { id: tenantId },
            data: {
                isActive: false
            }
        });
    }

    async getAllTenants() {
        return this.prisma.tenant.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { users: true, courses: true }
                }
            }
        });
    }

    async createInstructor(data: any) {
        try {
            console.log('Admin creating instructor:', data);

            // 1. Create Tenant (School)
            // Ensure subdomain is unique.
            const subdomain = data.domain?.toLowerCase().replace(/[^a-z0-9-]/g, '') || '';
            if (!subdomain) {
                throw new Error('Invalid subdomain provided');
            }

            // Check if subdomain exists
            const existingTenant = await this.prisma.tenant.findUnique({ where: { subdomain } });
            if (existingTenant) {
                throw new Error('Subdomain already taken');
            }

            // Check if email exists
            const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
            if (existingUser) {
                throw new Error('Email already registered');
            }

            const tenant = await this.prisma.tenant.create({
                data: {
                    name: data.name,
                    subdomain: subdomain,
                    mobileNumber: data.phone,
                    subject: data.subject,
                    grades: (data.grades || []) as any,
                    isActive: true
                }
            });

            // 2. Create User
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const user = await this.prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: hashedPassword,
                    role: 'TEACHER',
                    tenantId: tenant.id
                }
            });

            return { user, tenant };
        } catch (error) {
            console.error('Error in createInstructor:', error);
            throw error;
        }
    }

    async deleteTenant(tenantId: string) {
        // Warning: This physically deletes everything for the tenant.
        await this.prisma.enrollment.deleteMany({ where: { user: { tenantId } } });
        await this.prisma.quizResult.deleteMany({ where: { user: { tenantId } } });
        await this.prisma.quiz.deleteMany({ where: { lesson: { course: { tenantId } } } });
        await this.prisma.lessonProgress.deleteMany({ where: { user: { tenantId } } });
        await this.prisma.walletTransaction.deleteMany({ where: { user: { tenantId } } });
        await this.prisma.lesson.deleteMany({ where: { course: { tenantId } } });
        await this.prisma.course.deleteMany({ where: { tenantId } });
        await this.prisma.user.deleteMany({ where: { tenantId } });
        return this.prisma.tenant.delete({ where: { id: tenantId } });
    }

    async factoryReset() {
        // Warning: This physically deletes everything in the platform EXCEPT SUPER_ADMIN.
        await this.prisma.enrollment.deleteMany({});
        await this.prisma.quizResult.deleteMany({});
        await this.prisma.quiz.deleteMany({});
        await this.prisma.lessonProgress.deleteMany({});
        await this.prisma.walletTransaction.deleteMany({});
        await this.prisma.lesson.deleteMany({});
        await this.prisma.course.deleteMany({});
        await this.prisma.teacherRequest.deleteMany({});

        // Delete all users except SUPER_ADMIN
        await this.prisma.user.deleteMany({
            where: {
                role: { not: 'SUPER_ADMIN' }
            }
        });

        // Delete all tenants
        await this.prisma.tenant.deleteMany({});

        return { message: 'Platform data has been completely wiped, except for Super Admin.' };
    }
}

