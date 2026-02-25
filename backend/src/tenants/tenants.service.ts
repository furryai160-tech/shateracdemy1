
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Tenant } from '@prisma/client';

@Injectable()
export class TenantsService {
    constructor(private prisma: PrismaService) { }

    async create(data: Prisma.TenantCreateInput): Promise<Tenant> {
        return this.prisma.tenant.create({ data });
    }

    async findAll(): Promise<Tenant[]> {
        return this.prisma.tenant.findMany();
    }

    async findOne(id: string): Promise<Tenant> {
        const tenant = await this.prisma.tenant.findUnique({ where: { id } });
        if (!tenant) throw new NotFoundException(`Tenant with ID ${id} not found`);
        return tenant;
    }

    async update(id: string, data: Prisma.TenantUpdateInput): Promise<Tenant> {
        return this.prisma.tenant.update({
            where: { id },
            data,
        });
    }

    async findBySubdomain(subdomain: string): Promise<Tenant & { courses: any[] }> {
        const tenant = await this.prisma.tenant.findUnique({
            where: { subdomain },
            include: { courses: true }
        });
        if (!tenant) throw new NotFoundException(`Tenant with subdomain ${subdomain} not found`);
        return tenant as any;
    }

    async findPublicTeachers() {
        return this.prisma.tenant.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                subdomain: true,
                logoUrl: true,
                subject: true,
                grades: true,
                primaryColor: true,
            },
            orderBy: { name: 'asc' },
        });
    }
}
