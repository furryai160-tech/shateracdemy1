
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
    constructor(private prisma: PrismaService) { }

    async generate(userId: string, courseId: string) {
        // 1. Check if user is enrolled
        const enrollment = await this.prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                course: true,
                user: true,
            },
        });

        if (!enrollment) {
            throw new BadRequestException('User is not enrolled in this course');
        }

        // 2. Check if course is completed (e.g. 100% progress)
        // For MVP, we'll assume if they request it, we check a flag or just calculate it.
        // Let's rely on the progress field.
        if (enrollment.progress < 100) {
            throw new BadRequestException('Course is not 100% completed yet.');
        }

        // 3. Generate Certificate Record
        // Ideally we have a Certificate model. Let's create one in schema first or just return a mock PDF URL for now.
        // Let's add a simple Certificate model to schema.prisma soon.

        // For now, return a success message and a mock URL
        return {
            message: 'Certificate generated successfully',
            url: `/certificates/${userId}-${courseId}.pdf`, // We would generate a real PDF here
            date: new Date()
        };
    }

    async findAll(userId: string) {
        // Find all completed enrollments or certificates
        const enrollments = await this.prisma.enrollment.findMany({
            where: { userId, progress: 100 },
            include: { course: true }
        });

        return enrollments.map((e: any) => ({
            id: `${e.userId}-${e.courseId}`,
            courseName: e.course.title,
            date: e.updatedAt,
            url: `/certificates/${e.userId}-${e.courseId}.pdf`
        }));
    }
}
