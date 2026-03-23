import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { WorkoutService } from '../../application/services/workout.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  LogWorkoutSchema,
  LogWorkoutDto,
  WorkoutHistoryQuerySchema,
  WorkoutHistoryQuery,
  WorkoutTrendQuerySchema,
  WorkoutTrendQuery,
  WorkoutStatsQuerySchema,
  WorkoutStatsQuery,
} from '@pms/shared-types';

@Controller('health/workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  /**
   * Log a workout entry
   * POST /health/workouts
   */
  @Post()
  async logWorkout(
    @Body(new ZodValidationPipe(LogWorkoutSchema)) dto: LogWorkoutDto,
  ) {
    const healthLog = await this.workoutService.logWorkout(dto);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  /**
   * Get workout history
   * GET /health/workouts
   */
  @Get()
  async getHistory(
    @Query(new ZodValidationPipe(WorkoutHistoryQuerySchema)) query: WorkoutHistoryQuery,
  ) {
    const healthLogs = await this.workoutService.getWorkoutHistory(query);
    return {
      success: true,
      data: healthLogs.map((log) => log.toJSON()),
    };
  }

  /**
   * Get workout statistics
   * GET /health/workouts/stats
   */
  @Get('stats')
  async getStats(
    @Query(new ZodValidationPipe(WorkoutStatsQuerySchema)) query: WorkoutStatsQuery,
  ) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    const stats = await this.workoutService.getWorkoutStats(startDate, endDate);
    return {
      success: true,
      data: stats,
    };
  }

  /**
   * Get workout trend for charts
   * GET /health/workouts/trend
   */
  @Get('trend')
  async getTrend(
    @Query(new ZodValidationPipe(WorkoutTrendQuerySchema)) query: WorkoutTrendQuery,
  ) {
    const trendData = await this.workoutService.getWorkoutTrend(query.range);

    // Transform dates for JSON serialization
    const serializedData = trendData.map((point) => ({
      date: point.date.toISOString(),
      type: point.type,
      durationMinutes: point.durationMinutes,
      intensity: point.intensity,
      caloriesBurned: point.caloriesBurned,
    }));

    return {
      success: true,
      data: serializedData,
    };
  }
}
