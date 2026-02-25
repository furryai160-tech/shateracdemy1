
import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { GenerateCertificateDto } from './dto/generate-certificate.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('certificates')
@UseGuards(AuthGuard('jwt'))
export class CertificatesController {
    constructor(private readonly certificatesService: CertificatesService) { }

    @Post('generate')
    generate(@Request() req: any, @Body() generateCertificateDto: GenerateCertificateDto) {
        return this.certificatesService.generate(req.user.id, generateCertificateDto.courseId);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.certificatesService.findAll(req.user.id);
    }
}
