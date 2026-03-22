// Data access layer - Prisma client, tenant context, repositories

// Re-export Prisma from the prisma subdirectory
export { PrismaService, PrismaModule } from '../prisma/src';
export * from './generated';

// Re-export tenant context
export * from '../tenant-context/src';

export const DATA_ACCESS_VERSION = '1.0.0';
