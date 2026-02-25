
import { Controller, Post, Body, UseGuards, Request, Get, UnauthorizedException, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: any) {
        try {
            const user = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            return this.authService.login(user);
        } catch (error: any) {
            console.error('Login error:', error);
            throw new HttpException(error.message + ' \n ' + error.stack, 500);
        }
    }

    @Post('register')
    async register(@Body() registerDto: any) {
        return this.authService.register(registerDto);
    }

    @Post('teacher-request')
    async teacherRequest(@Body() dto: any) {
        return this.authService.createTeacherRequest(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    getProfile(@Request() req: any) {
        return req.user;
    }
}
