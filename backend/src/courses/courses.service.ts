
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) { }

    async create(createCourseDto: CreateCourseDto, userId?: string) {
        if (!createCourseDto.tenantId && userId) {
            const user = await this.prisma.user.findUnique({ where: { id: userId } });
            if (user?.tenantId) {
                createCourseDto.tenantId = user.tenantId;
            }
        }

        return this.prisma.course.create({
            data: renderData(createCourseDto),
        });
    }

    async findAll(tenantId?: string) {
        const where = tenantId ? { tenantId } : {};
        return this.prisma.course.findMany({
            where,
            include: {
                lessons: true
            }
        });
    }

    async findOne(id: string) {
        const course = await this.prisma.course.findUnique({
            where: { id },
            include: {
                lessons: {
                    select: {
                        id: true,
                        title: true,
                        description: true,
                        order: true,
                        dripDelay: true,
                        isFree: true,
                        // ⚠️ videoId & videoProvider are EXCLUDED for public view
                    }
                }
            }
        });
        if (!course) {
            throw new NotFoundException(`Course #${id} not found`);
        }
        return course;
    }

    /**
     * Returns full course data WITH videoIds — only for enrolled students.
     * Called by GET /courses/:id/player (JWT protected + enrollment check)
     */
    async findOneForPlayer(courseId: string, userId: string) {
        console.log(`[Player] userId=${userId}, courseId=${courseId}`);

        // 1. Verify course exists
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { lessons: true }
        });
        if (!course) {
            throw new NotFoundException(`Course #${courseId} not found`);
        }

        // 2. Check enrollment — use Number() to safely convert Prisma Decimal
        const coursePrice = Number(course.price ?? 0);
        console.log(`[Player] coursePrice=${coursePrice}`);

        if (coursePrice > 0) {
            // Find enrollment for THIS exact user
            const enrollment = await this.prisma.enrollment.findUnique({
                where: {
                    userId_courseId: { userId, courseId }
                }
            });
            console.log(`[Player] enrollment found:`, enrollment ? 'YES' : 'NO');

            if (!enrollment) {
                // DEBUG: Show all enrollments for this course to detect userId mismatch
                const allEnrollments = await this.prisma.enrollment.findMany({
                    where: { courseId },
                    select: { userId: true, createdAt: true }
                });
                console.log(`[Player] All enrollments for this course:`, JSON.stringify(allEnrollments));

                throw new ForbiddenException('You must be enrolled in this course to access its content.');
            }
        }

        return course;
    }

    async update(id: string, updateCourseDto: UpdateCourseDto) {
        return this.prisma.course.update({
            where: { id },
            data: renderData(updateCourseDto),
        });
    }

    async remove(id: string) {
        return this.prisma.course.delete({
            where: { id },
        });
    }
    async getProgress(courseId: string, userId: string) {
        // Fetch all lesson progress for this user in this course
        // First get all lesson IDs in the course
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: { lessons: { select: { id: true } } }
        });

        if (!course) return [];

        const lessonIds = course.lessons.map((l: { id: string }) => l.id);

        const progress = await this.prisma.lessonProgress.findMany({
            where: {
                userId,
                lessonId: { in: lessonIds },
                isCompleted: true
            }
        });

        return progress;
    }
}


function renderData(dto: any): any {
    // Helper to format decimal or other specific types if needed
    return dto;
}
