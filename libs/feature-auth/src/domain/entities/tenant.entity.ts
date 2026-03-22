import { Tenant } from '@prisma/client';

export class TenantEntity {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(tenant: Tenant): TenantEntity {
    return new TenantEntity(
      tenant.id,
      tenant.name,
      tenant.createdAt,
      tenant.updatedAt,
    );
  }
}
