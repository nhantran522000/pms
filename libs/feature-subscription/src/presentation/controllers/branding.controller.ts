import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '@pms/feature-auth';
import { BrandingService } from '../../application/services/branding.service';
import { UpdateBrandingSchema, BrandingResponseDto } from '../../application/dto/branding.dto';

@Controller('subscription/branding')
@UseGuards(JwtAuthGuard)
export class BrandingController {
  constructor(private readonly brandingService: BrandingService) {}

  @Get()
  async getBranding(@Request() req: any): Promise<BrandingResponseDto> {
    const tenantId = req.user.tenantId;
    return this.brandingService.getBranding(tenantId);
  }

  @Patch()
  async updateBranding(
    @Request() req: any,
    @Body() body: unknown,
  ): Promise<BrandingResponseDto> {
    const tenantId = req.user.tenantId;
    const dto = UpdateBrandingSchema.parse(body);
    return this.brandingService.updateBranding(tenantId, dto);
  }
}
