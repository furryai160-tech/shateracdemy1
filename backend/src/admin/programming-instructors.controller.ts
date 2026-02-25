import {
    Controller, Get, Post, Put, Delete,
    Body, Param, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PrismaService } from '../prisma/prisma.service';

@Controller('programming-instructors')
export class ProgrammingInstructorsController {
    constructor(private prisma: PrismaService) { }

    // ── Public ──────────────────────────────────────────────────────────
    @Get('public')
    findPublic() {
        return this.prisma.programmingInstructor.findMany({
            where: { isActive: true },
            orderBy: { displayOrder: 'asc' },
        });
    }

    // ── Admin ────────────────────────────────────────────────────────────
    @Get()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SUPER_ADMIN')
    findAll() {
        return this.prisma.programmingInstructor.findMany({
            orderBy: { displayOrder: 'asc' },
        });
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SUPER_ADMIN')
    create(@Body() body: {
        name: string;
        title: string;
        specialization: string;
        bio?: string;
        photoUrl?: string;
        skills?: string[];
        githubUrl?: string;
        linkedinUrl?: string;
        displayOrder?: number;
        isActive?: boolean;
    }) {
        return this.prisma.programmingInstructor.create({ data: body });
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SUPER_ADMIN')
    update(@Param('id') id: string, @Body() body: any) {
        return this.prisma.programmingInstructor.update({
            where: { id },
            data: body,
        });
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('SUPER_ADMIN')
    remove(@Param('id') id: string) {
        return this.prisma.programmingInstructor.delete({ where: { id } });
    }
}
