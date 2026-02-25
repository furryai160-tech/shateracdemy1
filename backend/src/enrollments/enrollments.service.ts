
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, courseId: string) {
        // Check if already enrolled
        const existing = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });

        if (existing) {
            throw new BadRequestException('User already enrolled in this course');
        }

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });

        if (user && !user.tenantId && course && course.tenantId) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { tenantId: course.tenantId }
            });
        }

        return this.prisma.enrollment.create({
            data: {
                userId,
                courseId,
            },
            include: {
                course: true,
            },
        });
    }

    async findMyEnrollments(userId: string) {
        return this.prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: true,
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async checkEnrollment(userId: string, courseId: string) {
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId }
            }
        });
        // Returns the enrollment object if found, or null if not enrolled
        // Frontend should treat null as "not enrolled" (not an error)
        return enrollment;
    }
}
