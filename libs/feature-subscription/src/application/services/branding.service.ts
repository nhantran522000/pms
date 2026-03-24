import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { BRANDING_DEFAULTS, BrandingResponseDto, UpdateBrandingDto } from '../dto/branding.dto';

@Injectable()
export class BrandingService {
  constructor(private readonly prisma: PrismaClient) {}

  async getBranding(tenantId: string): Promise<BrandingResponseDto> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { branding: true },
    });

    if (!tenant) {
      throw new Error('Tenant not found');
    }

    return this.mergeWithDefaults(tenant.branding as Record<string, any> | null);
  }

  async updateBranding(tenantId: string, dto: UpdateBrandingDto): Promise<BrandingResponseDto> {
    // Get current branding
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { branding: true },
    });

    const currentBranding = (tenant?.branding as Record<string, any>) || {};
    const updatedBranding = { ...currentBranding, ...dto };

    // Remove null values to keep JSONB clean
    const cleanedBranding = Object.fromEntries(
      Object.entries(updatedBranding).filter(([_, v]) => v !== undefined)
    );

    await this.prisma.tenant.update({
      where: { id: tenantId },
      data: { branding: cleanedBranding },
    });

    return this.mergeWithDefaults(cleanedBranding);
  }

  private mergeWithDefaults(branding: Record<string, any> | null): BrandingResponseDto {
    return {
      primaryColor: branding?.primaryColor || BRANDING_DEFAULTS.primaryColor,
      appName: branding?.appName || BRANDING_DEFAULTS.appName,
      logoUrl: branding?.logoUrl ?? BRANDING_DEFAULTS.logoUrl,
    };
  }
}
