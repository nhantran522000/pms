import { Controller, Get } from '@nestjs/common';
import { HobbyDashboardService } from '../../application/services/hobby-dashboard.service';
import type { HobbyWithCompletion } from '@pms/shared-types';

@Controller('hobbies')
export class HobbyDashboardController {
  constructor(private readonly dashboardService: HobbyDashboardService) {}

  @Get('dashboard')
  async getDashboard(): Promise<{
    success: boolean;
    data: { hobbies: HobbyWithCompletion[] };
  }> {
    const dashboard = await this.dashboardService.getDashboard();
    return { success: true, data: dashboard };
  }
}
