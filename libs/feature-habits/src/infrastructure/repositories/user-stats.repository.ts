import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { UserStatsEntity } from '../../domain/entities/user-stats.entity';

@Injectable()
export class UserStatsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(tenantId: string): Promise<UserStatsEntity | null> {
    const stats = await this.prisma.userStats.findUnique({
      where: { tenantId },
    });
    return stats ? UserStatsEntity.fromPrisma(stats) : null;
  }

  async create(tenantId: string): Promise<UserStatsEntity> {
    const stats = await this.prisma.userStats.create({
      data: { tenantId },
    });
    return UserStatsEntity.fromPrisma(stats);
  }

  async findOrCreate(tenantId: string): Promise<UserStatsEntity> {
    const existing = await this.findByTenantId(tenantId);
    if (existing) return existing;
    return this.create(tenantId);
  }

  async addXP(tenantId: string, xpAmount: number): Promise<UserStatsEntity> {
    const stats = await this.prisma.userStats.update({
      where: { tenantId },
      data: {
        totalXP: { increment: xpAmount },
      },
    });
    return UserStatsEntity.fromPrisma(stats);
  }

  async incrementHabitsCompleted(tenantId: string): Promise<UserStatsEntity> {
    const stats = await this.prisma.userStats.update({
      where: { tenantId },
      data: { habitsCompleted: { increment: 1 } },
    });
    return UserStatsEntity.fromPrisma(stats);
  }

  async updateLongestStreak(tenantId: string, streak: number): Promise<UserStatsEntity> {
    const stats = await this.prisma.userStats.update({
      where: { tenantId },
      data: { longestStreak: streak },
    });
    return UserStatsEntity.fromPrisma(stats);
  }

  async updateLevel(tenantId: string, level: number): Promise<UserStatsEntity> {
    const stats = await this.prisma.userStats.update({
      where: { tenantId },
      data: { currentLevel: level },
    });
    return UserStatsEntity.fromPrisma(stats);
  }
}
