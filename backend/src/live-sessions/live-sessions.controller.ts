import { Controller, Get, Post, Body, Param, UseGuards, Request, Req, Patch, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LiveSessionsService } from './live-sessions.service';

@UseGuards(AuthGuard('jwt'))
@Controller('live-sessions')
export class LiveSessionsController {
    constructor(private readonly liveSessionsService: LiveSessionsService) { }

    @Post()
    create(@Body() body: { title: string; description?: string; courseId: string; scheduledAt: string }, @Req() req: any) {
        const teacherId = req.user.userId || req.user.id;
        const tenantId = req.user.tenantId;
        return this.liveSessionsService.create({ ...body, teacherId, tenantId, scheduledAt: body.scheduledAt as any });
    }

    @Get()
    findAll(@Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.liveSessionsService.findAll(tenantId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Req() req: any) {
        const tenantId = req.user.tenantId;
        return this.liveSessionsService.getSession(id, tenantId);
    }

    @Patch(':id/start')
    startSession(@Param('id') id: string, @Req() req: any) {
        const teacherId = req.user.userId || req.user.id;
        const tenantId = req.user.tenantId;
        const role = req.user.role;
        return this.liveSessionsService.startSession(id, teacherId, tenantId, role);
    }

    @Patch(':id/end')
    endSession(@Param('id') id: string, @Req() req: any) {
        const teacherId = req.user.userId || req.user.id;
        const tenantId = req.user.tenantId;
        const role = req.user.role;
        return this.liveSessionsService.endSession(id, teacherId, tenantId, role);
    }

    @Post(':id/token')
    async generateToken(@Param('id') id: string, @Req() req: any) {
        const tenantId = req.user.tenantId;
        const session = await this.liveSessionsService.getSession(id, tenantId);

        // Check role, if teacher => publisher, if student => subscriber
        const role = (req.user.role === 'TEACHER' || req.user.userId === session.teacherId) ? 'publisher' : 'subscriber';

        // Channel name is the roomId.
        const roomId = session.roomId || session.id;

        return {
            token: this.liveSessionsService.generateAgoraTokenStr(roomId, role, req.user.userId),
            roomId: roomId,
            uid: req.user.userId
        };
    }
}
