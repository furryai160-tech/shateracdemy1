import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlansService {
    constructor(private prisma: PrismaService) { }

    async findAllPublic() {
        return this.prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
        });
    }

    async findAllAdmin() {
        return this.prisma.plan.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string) {
        const plan = await this.prisma.plan.findUnique({ where: { id } });
        if (!plan) throw new NotFoundException('Plan not found');
        return plan;
    }

    async create(data: {
        name: string;
        description?: string;
        price: number;
        duration: number;
        features: string[];
        isActive?: boolean;
        isPopular?: boolean;
    }) {
        return this.prisma.plan.create({
            data: {
                ...data,
            },
        });
    }

    async update(id: string, data: Partial<{
        name: string;
        description: string;
        price: number;
        duration: number;
        features: string[];
        isActive: boolean;
        isPopular: boolean;
    }>) {
        return this.prisma.plan.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.plan.delete({
            where: { id },
        });
    }
}
