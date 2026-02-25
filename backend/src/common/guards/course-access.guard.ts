
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { EnrollmentsService } from '../../enrollments/enrollments.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CourseAccessGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private enrollmentsService: EnrollmentsService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const courseId = request.params.courseId || request.body.courseId;

        if (!user || !courseId) {
            throw new UnauthorizedException('Missing user or course information');
        }

        // 1. Check if user is the teacher/owner of the course (via Tenant)
        // For MVP, we can fetch the course and check tenantId match
        // const course = await this.prisma.course.findUnique({ where: { id: courseId } });
        // if (course && course.tenantId === user.tenantId && user.role === 'TEACHER') return true;

        // 2. Check if student is enrolled
        const enrollment = await this.enrollmentsService.checkEnrollment(user.id, courseId);
        if (enrollment) return true;

        throw new UnauthorizedException('You are not enrolled in this course');
    }
}
