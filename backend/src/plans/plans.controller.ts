import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('plans')
export class PlansController {
    constructor(private readonly plansService: PlansService) { }

    @Get('public')
    findAllPublic() {
        return this.plansService.findAllPublic();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Get('admin')
    findAllAdmin() {
        return this.plansService.findAllAdmin();
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Post()
    create(@Body() createPlanDto: any) {
        return this.plansService.create(createPlanDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.plansService.findOne(id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateData: any) {
        return this.plansService.update(id, updateData);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.SUPER_ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.plansService.remove(id);
    }
}
