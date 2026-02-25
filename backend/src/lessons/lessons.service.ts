
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
    constructor(private prisma: PrismaService) { }

    async create(createLessonDto: CreateLessonDto) {
        return this.prisma.lesson.create({
            data: createLessonDto,
        });
    }

    async findAll() {
        return this.prisma.lesson.findMany({
            include: {
                quizzes: true
            }
        });
    }

    async findOne(id: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id },
            include: {
                quizzes: true
            }
        });
        if (!lesson) {
            throw new NotFoundException(`Lesson #${id} not found`);
        }
        return lesson;
    }

    async update(id: string, updateLessonDto: UpdateLessonDto) {
        return this.prisma.lesson.update({
            where: { id },
            data: updateLessonDto,
        });
    }

    async remove(id: string) {
        return this.prisma.lesson.delete({
            where: { id },
        });
    }
    async complete(lessonId: string, userIdArg: string) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId }
        });

        if (!lesson) {
            throw new NotFoundException(`Lesson #${lessonId} not found`);
        }

        const progress = await this.prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: userIdArg,
                    lessonId
                }
            },
            update: { isCompleted: true },
            create: {
                userId: userIdArg,
                lessonId,
                isCompleted: true
            }
        });

        // Calculate and update Course progress for Enrollment table
        const totalCourseLessons = await this.prisma.lesson.count({
            where: { courseId: lesson.courseId }
        });

        if (totalCourseLessons > 0) {
            const completedLessons = await this.prisma.lessonProgress.count({
                where: {
                    userId: userIdArg,
                    isCompleted: true,
                    lesson: { courseId: lesson.courseId }
                }
            });

            const courseProgress = Math.round((completedLessons / totalCourseLessons) * 100);

            await this.prisma.enrollment.updateMany({
                where: {
                    userId: userIdArg,
                    courseId: lesson.courseId
                },
                data: {
                    progress: Math.min(courseProgress, 100)
                }
            });
        }

        return progress;
    }
}

