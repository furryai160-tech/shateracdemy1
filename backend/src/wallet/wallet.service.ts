
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService) { }

    async getBalance(userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const walletBalance = (user as any).walletBalance;
        // Convert Prisma Decimal to plain number for JSON serialization
        return {
            balance: walletBalance ? Number(walletBalance) : 0,
        };
    }

    async requestDeposit(userId: string, amount: number, proofUrl: string | null) {
        return (this.prisma as any).walletTransaction.create({
            data: {
                userId,
                amount,
                type: 'DEPOSIT',
                status: 'PENDING',
                proofUrl,
            },
            include: { user: false },
        });
    }

    async getTransactions(userId: string) {
        return (this.prisma as any).walletTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Admin: Get all requests (Pending & History)
    async getPendingRequests(user: any) {
        console.log('getPendingRequests called with user:', user);
        // Remove status: 'PENDING' to show history too
        const where: any = { type: 'DEPOSIT' };

        // If SUPER_ADMIN, show everything (no filter on tenant), or maybe keep it broad
        // If specific tenant (TEACHER), show their tenant OR unassigned (null)
        if (user.role !== 'SUPER_ADMIN' && user.tenantId) {
            /* 
            // TEMPORARY: Disable filter to debug missing requests
            where.user = {
                OR: [
                    { tenantId: user.tenantId },
                    { tenantId: null }
                ]
            };
            */
        } else if (user.role === 'SUPER_ADMIN') {
            // For Super Admin, we want to see EVERYTHING, perhaps?
            // Or maybe they still only want to see their tenant...
            // "Everything" is safer.
        } else if (!user.tenantId) {
            // Admin without tenant? Show all unassigned? Or everything?
            // Let's assume they want to see everything if no tenant restriction is applicable
        }

        console.log('Querying with where:', JSON.stringify(where, null, 2));

        const results = await (this.prisma as any).walletTransaction.findMany({
            where,
            include: {
                user: {
                    select: { id: true, name: true, email: true, phone: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('Found requests:', results.length);
        return results;
    }



    async approveRequest(requestId: string) {
        const transaction = await (this.prisma as any).walletTransaction.findUnique({ where: { id: requestId } });
        if (!transaction || transaction.status !== 'PENDING') {
            throw new BadRequestException('Invalid or already processed request');
        }

        // Update Transaction Schema status
        await (this.prisma as any).walletTransaction.update({
            where: { id: requestId },
            data: { status: 'APPROVED' },
        });

        // Update User Balance
        await this.prisma.user.update({
            where: { id: transaction.userId },
            data: { walletBalance: { increment: transaction.amount } } as any,
        });

        return { message: 'Wallet credited successfully' };
    }

    async rejectRequest(requestId: string, reason: string) {
        await (this.prisma as any).walletTransaction.update({
            where: { id: requestId },
            data: { status: 'REJECTED', adminNote: reason },
        });
        return { message: 'Request rejected' };
    }

    async payForCourse(userId: string, courseId: string) {
        console.log(`[Wallet.pay] userId=${userId}, courseId=${courseId}`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        const course = await this.prisma.course.findUnique({ where: { id: courseId } });

        if (!course) throw new BadRequestException('Course not found');
        if (!user) throw new BadRequestException('User not found');

        // Convert Prisma Decimal to Number for comparison (CRITICAL BUG FIX)
        const userBalance = Number((user as any).walletBalance ?? 0);
        const coursePrice = Number(course.price ?? 0);

        if (userBalance < coursePrice) {
            throw new BadRequestException(
                `رصيد غير كافٍ. رصيدك: ${userBalance} ج.م، سعر الكورس: ${coursePrice} ج.م`
            );
        }

        // Check if already enrolled
        const existing = await this.prisma.enrollment.findUnique({
            where: { userId_courseId: { userId, courseId } }
        });
        if (existing) throw new BadRequestException('أنت مسجّل بالفعل في هذا الكورس');

        // Deduct Balance
        await this.prisma.user.update({
            where: { id: userId },
            data: { walletBalance: { decrement: coursePrice } } as any,
        });

        // Create Purchase Transaction
        await (this.prisma as any).walletTransaction.create({
            data: {
                userId,
                amount: coursePrice,
                type: 'PURCHASE',
                status: 'APPROVED',
                courseId,
            },
        });

        // Enroll User
        await this.prisma.enrollment.create({
            data: {
                userId,
                courseId,
            },
        });

        return { message: 'تم الشراء بنجاح' };
    }

    /**
     * Admin: Directly credit a student wallet (no proof/transaction request needed)
     */
    async adminCredit(adminUser: any, targetUserId: string, amount: number) {
        if (adminUser.role !== 'SUPER_ADMIN' && adminUser.role !== 'ADMIN' && adminUser.role !== 'TEACHER') {
            throw new BadRequestException('ليس لديك صلاحية تنفيذ هذا الإجراء');
        }
        if (!targetUserId || !amount || amount <= 0) {
            throw new BadRequestException('بيانات غير صحيحة');
        }

        const target = await this.prisma.user.findUnique({ where: { id: targetUserId } });
        if (!target) throw new BadRequestException('الطالب غير موجود');

        // Add balance directly
        await this.prisma.user.update({
            where: { id: targetUserId },
            data: { walletBalance: { increment: amount } } as any,
        });

        // Create APPROVED transaction record
        await (this.prisma as any).walletTransaction.create({
            data: {
                userId: targetUserId,
                amount,
                type: 'DEPOSIT',
                status: 'APPROVED',
                adminNote: `شحن مباشر من الأدمن (${adminUser.username})`,
            },
        });

        return { message: `تم شحن ${amount} ج.م لحساب ${target.name || target.email} بنجاح` };
    }


    async setVodafoneCashNumber(userId: string, number: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');
        if (!user.tenantId) throw new BadRequestException('User is not a tenant admin');

        await this.prisma.tenant.update({
            where: { id: user.tenantId },
            data: { vodafoneCashNumber: number } as any
        });

        return { message: 'تم تحديث الرقم بنجاح' };
    }

    async getVodafoneCashNumber(tenantId?: string) {
        if (!tenantId) {
            const tenant = await this.prisma.tenant.findFirst();
            return { number: (tenant as any)?.vodafoneCashNumber || '' };
        }

        const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
        return { number: (tenant as any)?.vodafoneCashNumber || '' };
    }
}

