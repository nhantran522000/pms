// Data access layer - Prisma client, tenant context, repositories

// Re-export Prisma from the prisma subdirectory
export { PrismaService, PrismaModule } from '../prisma/src';
export * from './generated';

export const DATA_ACCESS_VERSION = '1.0.0';
