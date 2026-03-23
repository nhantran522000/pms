import { Controller, Get } from '@nestjs/common';
import { HealthDashboardService } from '../../application/services/health-dashboard.service';

@Controller('health/dashboard')
export class HealthDashboardController {
  constructor(private readonly dashboardService: HealthDashboardService) {}

  /**
   * Get full dashboard data
   * GET /health/dashboard
   */
  @Get()
  async getDashboard() {
    const dashboard = await this.dashboardService.getDashboard();

    // Transform dates for JSON serialization
    return {
      success: true,
      data: {
        ...dashboard,
        weight: {
          ...dashboard.weight,
          loggedAt: dashboard.weight.loggedAt?.toISOString() ?? null,
        },
        vitals: {
          bloodPressure: {
            ...dashboard.vitals.bloodPressure,
            loggedAt: dashboard.vitals.bloodPressure.loggedAt?.toISOString() ?? null,
          },
          heartRate: {
            ...dashboard.vitals.heartRate,
            loggedAt: dashboard.vitals.heartRate.loggedAt?.toISOString() ?? null,
          },
        },
        generatedAt: dashboard.generatedAt.toISOString(),
      },
    };
  }

  /**
   * Get weight summary only
   * GET /health/dashboard/weight
   */
  @Get('weight')
  async getWeightSummary() {
    const weight = await this.dashboardService.getWeightSummaryOnly();

    return {
      success: true,
      data: {
        ...weight,
        loggedAt: weight.loggedAt?.toISOString() ?? null,
      },
    };
  }

  /**
   * Get vitals summary only
   * GET /health/dashboard/vitals
   */
  @Get('vitals')
  async getVitalsSummary() {
    const vitals = await this.dashboardService.getVitalsSummaryOnly();

    return {
      success: true,
      data: {
        bloodPressure: {
          ...vitals.bloodPressure,
          loggedAt: vitals.bloodPressure.loggedAt?.toISOString() ?? null,
        },
        heartRate: {
          ...vitals.heartRate,
          loggedAt: vitals.heartRate.loggedAt?.toISOString() ?? null,
        },
      },
    };
  }

  /**
   * Get sleep summary only
   * GET /health/dashboard/sleep
   */
  @Get('sleep')
  async getSleepSummary() {
    const sleep = await this.dashboardService.getSleepSummaryOnly();

    return {
      success: true,
      data: sleep,
    };
  }

  /**
   * Get workout summary only
   * GET /health/dashboard/workouts
   */
  @Get('workouts')
  async getWorkoutSummary() {
    const workouts = await this.dashboardService.getWorkoutSummaryOnly();

    return {
      success: true,
      data: workouts,
    };
  }
}
