import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import {
  AchievementEntity,
  AchievementType,
  ACHIEVEMENT_DEFINITIONS,
} from '../../domain/entities/achievement.entity';

@Injectable()
export class AchievementRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTenantId(
    tenantId: string,
    options?: { limit?: number },
  ): Promise<AchievementEntity[]> {
    const achievements = await this.prisma.achievement.findMany({
      where: { tenantId },
      orderBy: { unlockedAt: 'desc' },
      take: options?.limit ?? 20,
    });
    return achievements.map(AchievementEntity.fromPrisma);
  }

  async findByType(
    tenantId: string,
    type: AchievementType,
    habitId?: string,
  ): Promise<AchievementEntity | null> {
    const achievement = await this.prisma.achievement.findFirst({
      where: {
        tenantId,
        type,
        habitId: habitId ?? null,
      },
    });
    return achievement ? AchievementEntity.fromPrisma(achievement) : null;
  }

  async create(input: {
    tenantId: string;
    userStatsId: string;
    type: AchievementType;
    habitId?: string;
  }): Promise<AchievementEntity> {
    const definition = ACHIEVEMENT_DEFINITIONS[input.type];
    const achievement = await this.prisma.achievement.create({
      data: {
        tenantId: input.tenantId,
        userStatsId: input.userStatsId,
        type: input.type,
        name: definition.name,
        description: definition.description,
        icon: definition.icon,
        habitId: input.habitId ?? null,
      },
    });
    return AchievementEntity.fromPrisma(achievement);
  }

  async exists(
    tenantId: string,
    type: AchievementType,
    habitId?: string,
  ): Promise<boolean> {
    const count = await this.prisma.achievement.count({
      where: {
        tenantId,
        type,
        habitId: habitId ?? null,
      },
    });
    return count > 0;
  }
}
