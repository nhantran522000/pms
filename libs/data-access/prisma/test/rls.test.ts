import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { runWithTenantContext } from '../../tenant-context/src/async-local-storage';
import { PrismaService } from '../src/prisma.service';

describe('Row Level Security', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should allow access to own tenant data', async () => {
    const tenantId = 'test-tenant-1';

    await runWithTenantContext({ tenantId }, async () => {
      // Set session variable for this test
      await prisma.$executeRawUnsafe(
        `SET LOCAL app.current_tenant_id = '${tenantId}'`
      );

      // Should be able to query own tenant
      const users = await prisma.user.findMany();
      expect(Array.isArray(users)).toBe(true);
    });
  });

  it('should prevent cross-tenant access', async () => {
    const tenantId = 'test-tenant-1';

    await runWithTenantContext({ tenantId }, async () => {
      await prisma.$executeRawUnsafe(
        `SET LOCAL app.current_tenant_id = '${tenantId}'`
      );

      // Even if we try to query with a different tenantId filter,
      // RLS should prevent seeing other tenants' data
      const users = await prisma.user.findMany({
        where: { tenantId: 'different-tenant' }
      });

      // Should return empty because RLS filters out cross-tenant data
      expect(users).toHaveLength(0);
    });
  });

  it('should enforce tenantId on insert', async () => {
    const tenantId = 'test-tenant-1';

    await runWithTenantContext({ tenantId }, async () => {
      await prisma.$executeRawUnsafe(
        `SET LOCAL app.current_tenant_id = '${tenantId}'`
      );

      // Try to insert with different tenantId
      // Should fail due to RLS policy
      await expect(
        prisma.user.create({
          data: {
            email: 'test@example.com',
            passwordHash: 'hash',
            tenantId: 'different-tenant'
          }
        })
      ).rejects.toThrow();
    });
  });
});
