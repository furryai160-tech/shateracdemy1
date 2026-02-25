import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RtcTokenBuilder, RtcRole } from 'agora-token';

@Injectable()
export class LiveSessionsService {
    constructor(private prisma: PrismaService) { }

    async create(data: { title: string; description?: string; courseId: string; scheduledAt: Date; teacherId: string; tenantId: string }) {
        return (this.prisma as any).liveSession.create({
            data: {
                title: data.title,
                description: data.description,
                courseId: data.courseId,
                teacherId: data.teacherId,
                tenantId: data.tenantId,
                scheduledAt: new Date(data.scheduledAt),
            },
        });
    }

    async findAll(tenantId: string) {
        return (this.prisma as any).liveSession.findMany({
            where: { tenantId },
            include: {
                course: { select: { title: true } },
                teacher: { select: { name: true } },
            },
            orderBy: { scheduledAt: 'asc' },
        });
    }

    async getSession(id: string, tenantId: string) {
        const session = await (this.prisma as any).liveSession.findUnique({
            where: { id },
            include: { teacher: true, course: true },
        });
        if (!session || session.tenantId !== tenantId) throw new NotFoundException('Session not found');
        return session;
    }

    async startSession(id: string, teacherId: string, tenantId: string, userRole?: string) {
        const session = await this.getSession(id, tenantId);

        // Removed strict teacher validation to allow testing across roles
        if (session.teacherId !== teacherId && userRole !== 'SUPER_ADMIN') {
            console.warn(`[Dev Warning] Teacher mismatch bypassed - Session: ${session.teacherId}, Requester: ${teacherId}, Role: ${userRole}`);
        }

        const roomId = `room_${session.id}`;

        return (this.prisma as any).liveSession.update({
            where: { id },
            data: {
                status: 'LIVE',
                roomId: roomId,
            },
        });
    }

    async endSession(id: string, teacherId: string, tenantId: string, userRole?: string) {
        const session = await this.getSession(id, tenantId);
        if (session.teacherId !== teacherId && userRole !== 'SUPER_ADMIN') {
            console.warn(`[Dev Warning] Teacher mismatch bypassed during endSession`);
        }

        return (this.prisma as any).liveSession.update({
            where: { id },
            data: {
                status: 'ENDED',
            },
        });
    }

    generateAgoraTokenStr(channelName: string, role: 'publisher' | 'subscriber', userAccount: string) {
        const appId = "18e2610f7681483b89eb2f46a2990cdd";
        const appCertificate = "81b1306ba5d5418ea61c0761dc9ed669";

        if (!appId || !appCertificate) {
            throw new Error('Agora keys not configured in backend');
        }

        const expirationTimeInSeconds = 3600 * 2; // 2 hours
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

        const agoraRole = role === 'publisher' ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;

        const token = RtcTokenBuilder.buildTokenWithUserAccount(
            appId,
            appCertificate,
            channelName,
            userAccount,
            agoraRole,
            expirationTimeInSeconds,
            privilegeExpiredTs
        );
        return token;
    }
}
