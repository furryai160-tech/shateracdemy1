
import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Helper for file upload
const storage = diskStorage({
    destination: './uploads/receipts',
    filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
    },
});

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Get('balance')
    @UseGuards(AuthGuard('jwt'))
    getBalance(@Request() req: any) {
        return this.walletService.getBalance(req.user.userId);
    }

    @Get('transactions')
    @UseGuards(AuthGuard('jwt'))
    getTransactions(@Request() req: any) {
        return this.walletService.getTransactions(req.user.userId);
    }

    // Admin/Teacher: Get all pending requests - filtered by tenant
    @Get('requests')
    @UseGuards(AuthGuard('jwt'))
    getPendingRequests(@Request() req: any) {
        return this.walletService.getPendingRequests(req.user);
    }

    @Post('deposit')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('proof', { storage }))
    requestDeposit(@Request() req: any, @Body('amount') amount: string, @UploadedFile() file: Express.Multer.File) {
        return this.walletService.requestDeposit(req.user.userId, parseFloat(amount), file ? `/uploads/receipts/${file.filename}` : null);
    }

    @Patch('approve/:id')
    @UseGuards(AuthGuard('jwt'))
    approveRequest(@Param('id') id: string) {
        return this.walletService.approveRequest(id);
    }

    @Patch('reject/:id')
    @UseGuards(AuthGuard('jwt'))
    rejectRequest(@Param('id') id: string, @Body('reason') reason: string) {
        return this.walletService.rejectRequest(id, reason);
    }

    @Post('pay')
    @UseGuards(AuthGuard('jwt'))
    payForCourse(@Request() req: any, @Body('courseId') courseId: string) {
        return this.walletService.payForCourse(req.user.userId, courseId);
    }

    /**
     * Admin only: Directly credit a student's wallet (no proof needed)
     * POST /wallet/admin-credit { userId, amount }
     */
    @Post('admin-credit')
    @UseGuards(AuthGuard('jwt'))
    adminCredit(@Request() req: any, @Body('userId') userId: string, @Body('amount') amount: number) {
        return this.walletService.adminCredit(req.user, userId, Number(amount));
    }

    @Post('settings/vodafone')
    @UseGuards(AuthGuard('jwt'))
    setVodafoneCashNumber(@Request() req: any, @Body('number') number: string) {
        return this.walletService.setVodafoneCashNumber(req.user.userId, number);
    }

    @Get('settings/vodafone')
    getVodafoneCashNumber(@Request() req: any) {
        // Public endpoint - fetch by tenantId query param or fall back to first tenant
        const tenantId = req.query?.tenantId;
        return this.walletService.getVodafoneCashNumber(tenantId);
    }
}
