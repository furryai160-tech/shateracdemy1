
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

@Injectable()
export class QuizzesService {
    constructor(private prisma: PrismaService) { }

    async create(createQuizDto: CreateQuizDto) {
        return this.prisma.quiz.create({
            data: createQuizDto,
        });
    }

    async findAll() {
        return this.prisma.quiz.findMany();
    }

    async findOne(id: string) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
        });
        if (!quiz) {
            throw new NotFoundException(`Quiz #${id} not found`);
        }
        return quiz;
    }

    async update(id: string, updateQuizDto: UpdateQuizDto) {
        return this.prisma.quiz.update({
            where: { id },
            data: updateQuizDto,
        });
    }

    async remove(id: string) {
        return this.prisma.quiz.delete({
            where: { id },
        });
    }
}
