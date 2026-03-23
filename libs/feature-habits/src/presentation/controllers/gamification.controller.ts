import { Controller, Get, Query } from '@nestjs/common';
import { GamificationService } from '../../application/services/gamification.service';
import { UserStatsService } from '../../application/services/user-stats.service';
import { Public } from '@pms/feature-auth';

@Controller('gamification')
export class GamificationController {
  constructor(
    private readonly gamificationService: GamificationService,
    private readonly userStatsService: UserStatsService,
  ) {}

  @Get('dashboard')
  async getDashboard() {
    return this.gamificationService.getDashboard();
  }

  @Get('stats')
  async getStats() {
    return this.userStatsService.getStats();
  }

  @Get('achievements')
  async getAchievements(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 20;
    return this.userStatsService.getAchievements(parsedLimit);
  }
}
