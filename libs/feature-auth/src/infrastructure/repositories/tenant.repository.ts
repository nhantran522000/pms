import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { TenantEntity } from '../../domain/entities/tenant.entity';

@Injectable()
export class TenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<TenantEntity | null> {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id },
    });
    return tenant ? TenantEntity.fromPrisma(tenant) : null;
  }

  async create(id: string, name: string): Promise<TenantEntity> {
    const tenant = await this.prisma.tenant.create({
      data: { id, name },
    });
    return TenantEntity.fromPrisma(tenant);
  }
}
