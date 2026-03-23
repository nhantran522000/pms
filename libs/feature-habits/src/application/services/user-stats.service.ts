import { Injectable } from '@nestjs/common';
import { UserStatsRepository } from '../../infrastructure/repositories/user-stats.repository';
import { AchievementRepository } from '../../infrastructure/repositories/achievement.repository';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class UserStatsService {
  constructor(
    private readonly userStatsRepository: UserStatsRepository,
    private readonly achievementRepository: AchievementRepository,
  ) {}

  async getStats() {
    const tenantId = this.getTenantId();
    const stats = await this.userStatsRepository.findOrCreate(tenantId);
    return stats.toJSON();
  }

  async getAchievements(limit = 20) {
    const tenantId = this.getTenantId();
    const achievements = await this.achievementRepository.findByTenantId(tenantId, { limit });
    return achievements.map((a) => a.toJSON());
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
