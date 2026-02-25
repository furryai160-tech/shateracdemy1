
import { Controller, Post, Body, UseGuards, Request, Get, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('checkout')
    createCheckoutSession(@Request() req: any, @Body() createCheckoutSessionDto: CreateCheckoutSessionDto) {
        return this.paymentsService.createCheckoutSession(req.user.id, createCheckoutSessionDto.courseId);
    }

    @Get('verify')
    verifySession(@Query('session_id') sessionId: string) {
        return this.paymentsService.verifySession(sessionId);
    }
}
