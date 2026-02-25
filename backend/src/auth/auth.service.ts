
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        if (!email || typeof email !== 'string' || !pass || typeof pass !== 'string') {
            return null;
        }

        const user = await this.usersService.findOne(email);
        if (user && user.password && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user.id, role: user.role, tenantId: user.tenantId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                parentPhone: user.parentPhone, // Added
                governorate: user.governorate, // Added
                role: user.role,
                tenantId: user.tenantId,
                gradeLevel: user.gradeLevel,
            },
        };
    }

    async register(registerDto: any) {
        // Check if user exists
        const user = await this.usersService.findOne(registerDto.email);
        if (user) {
            throw new UnauthorizedException('User already exists');
        }

        const { subdomain, ...userData } = registerDto;
        if (subdomain) {
            const tenant = await this.prisma.tenant.findUnique({
                where: { subdomain: subdomain.toLowerCase() }
            });
            if (tenant) {
                userData.tenantId = tenant.id;
            }
        }

        return this.usersService.create(userData);
    }

    async createTeacherRequest(dto: any) {
        console.log('Received Teacher Request:', dto);
        // Check if user already exists
        const existingUser = await this.usersService.findOne(dto.email);
        if (existingUser) {
            console.log('User already exists');
            throw new BadRequestException('User with this email already exists');
        }

        // Check if pending request exists
        const existingRequest = await this.prisma.teacherRequest.findUnique({
            where: { email: dto.email }
        });

        if (existingRequest) {
            console.log('Request already exists');
            throw new BadRequestException('A request with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        try {
            return await this.prisma.teacherRequest.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    password: hashedPassword,
                    subject: dto.subject,
                    grades: dto.grades,
                    domain: dto.domain,
                    idCardUrl: dto.idCardUrl,
                    serviceType: dto.serviceType
                }
            });
        } catch (error) {
            console.error('Error creating teacher request:', error);
            throw new BadRequestException('Validation failed: ' + error.message);
        }
    }
}
