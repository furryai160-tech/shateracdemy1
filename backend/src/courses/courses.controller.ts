import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(@Request() req: any, @Body() createCourseDto: CreateCourseDto) {
        // Let SUPER_ADMIN pass whatever tenantId they want.
        // For other roles, lock them to their own tenantId.
        if (req.user.role !== 'SUPER_ADMIN') {
            if (req.user.tenantId) {
                createCourseDto.tenantId = req.user.tenantId;
            }
            return this.coursesService.create(createCourseDto, req.user.userId);
        }

        return this.coursesService.create(createCourseDto);
    }

    @Get()
    findAll(@Query('tenantId') tenantId: string) {
        return this.coursesService.findAll(tenantId);
    }

    @Get('teacher')
    @UseGuards(AuthGuard('jwt'))
    findTeacherCourses(@Request() req: any) {
        if (req.user.role === 'SUPER_ADMIN') {
            return this.coursesService.findAll();
        }
        return this.coursesService.findAll(req.user.tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(@Param('id') id: string) {
        return this.coursesService.remove(id);
    }

    @Get(':id/progress')
    @UseGuards(AuthGuard('jwt'))
    getProgress(@Param('id') id: string, @Request() req: any) {
        return this.coursesService.getProgress(id, req.user.userId);
    }

    /**
     * Secured player endpoint — requires login + enrollment.
     * Returns full lesson data including videoId & videoProvider.
     */
    @Get(':id/player')
    @UseGuards(AuthGuard('jwt'))
    getPlayerData(@Param('id') id: string, @Request() req: any) {
        return this.coursesService.findOneForPlayer(id, req.user.userId);
    }
}
