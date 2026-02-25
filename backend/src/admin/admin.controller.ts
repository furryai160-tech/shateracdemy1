
import { Controller, Get, Post, Body, UseGuards, Query, Param, Req, Delete, ForbiddenException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('SUPER_ADMIN', 'TEACHER') // For now, let teachers see this too, or strict to SUPER_ADMIN
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    getStats(@Req() req: any) {
        return this.adminService.getStats(req.user);
    }

    @Get('users')
    getAllUsers(@Req() req: any) {
        return this.adminService.getAllUsers(req.user);
    }

    @Post('users')
    createUser(@Body() body: any, @Req() req: any) {
        return this.adminService.createUser(body, req.user);
    }

    @Get('courses')
    getAllCourses(@Req() req: any) {
        return this.adminService.getAllCourses(req.user);
    }

    @Post('enrollments')
    manageEnrollment(@Body() body: { userId: string; courseId: string; action: 'enroll' | 'unenroll' }) {
        return this.adminService.manageEnrollment(body.userId, body.courseId, body.action);
    }

    @Get('teacher-requests')
    getTeacherRequests() {
        return this.adminService.getTeacherRequests();
    }

    @Post('teacher-requests/:id/approve')
    approveTeacherRequest(@Param('id') id: string) {
        return this.adminService.approveTeacherRequest(id);
    }

    @Post('teacher-requests/:id/reject')
    rejectTeacherRequest(@Param('id') id: string, @Body('reason') reason: string) {
        return this.adminService.rejectTeacherRequest(id, reason);
    }

    @Post('tenants/:id/activate')
    activateTenant(@Param('id') id: string, @Body() body: { start: string; end: string }) {
        return this.adminService.activateTenant(id, new Date(body.start), new Date(body.end));
    }

    @Post('tenants/:id/deactivate')
    deactivateTenant(@Param('id') id: string) {
        return this.adminService.deactivateTenant(id);
    }

    @Get('tenants/:id/courses')
    getTenantCourses(@Param('id') id: string) {
        return this.adminService.getTenantCourses(id);
    }
    @Post('tenants/:id/delete')
    deleteTenant(@Param('id') id: string) {
        return this.adminService.deleteTenant(id);
    }

    @Get('tenants')
    getAllTenants() {
        return this.adminService.getAllTenants();
    }

    @Post('instructors')
    createInstructor(@Body() body: any) {
        return this.adminService.createInstructor(body);
    }

    @Delete('factory-reset')
    factoryReset(@Req() req: any) {
        if (req.user.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Only SUPER_ADMIN can perform a factory reset');
        }
        return this.adminService.factoryReset();
    }
}
