
import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Prisma } from '@prisma/client';

@Controller('tenants')
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Post()
    create(@Body() createTenantDto: Prisma.TenantCreateInput) {
        return this.tenantsService.create(createTenantDto);
    }

    @Get('public/teachers')
    getPublicTeachers() {
        return this.tenantsService.findPublicTeachers();
    }

    @Get()
    findAll() {
        return this.tenantsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tenantsService.findOne(id);
    }

    @Get('subdomain/:subdomain')
    findBySubdomain(@Param('subdomain') subdomain: string) {
        return this.tenantsService.findBySubdomain(subdomain);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTenantDto: Prisma.TenantUpdateInput) {
        return this.tenantsService.update(id, updateTenantDto);
    }
}
