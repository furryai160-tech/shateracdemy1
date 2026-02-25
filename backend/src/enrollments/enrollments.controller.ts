
import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('enrollments')
@UseGuards(AuthGuard('jwt'))
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    /** Student enrolls themselves (free courses) */
    @Post()
    create(@Request() req: any, @Body('courseId') courseId: string) {
        return this.enrollmentsService.create(req.user.userId, courseId);
    }

    /**
     * Admin/Teacher: Enroll any student in any course (no payment)
     * POST /enrollments/admin-enroll { userId, courseId }
     */
    @Post('admin-enroll')
    adminEnroll(
        @Request() req: any,
        @Body('userId') userId: string,
        @Body('courseId') courseId: string,
    ) {
        const role = req.user.role;
        if (role !== 'SUPER_ADMIN' && role !== 'ADMIN' && role !== 'TEACHER') {
            return { error: 'Unauthorized' };
        }
        return this.enrollmentsService.create(userId, courseId);
    }

    @Get('my')
    findMyEnrollments(@Request() req: any) {
        return this.enrollmentsService.findMyEnrollments(req.user.userId);
    }

    @Get('check/:courseId')
    check(@Request() req: any, @Param('courseId') courseId: string) {
        return this.enrollmentsService.checkEnrollment(req.user.userId, courseId);
    }
}
