
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { ProgrammingInstructorsController } from './programming-instructors.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminController, ProgrammingInstructorsController],
    providers: [AdminService],
})
export class AdminModule { }
