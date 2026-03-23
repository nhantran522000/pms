import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import { VitalsService, LogBloodPressureDto, LogHeartRateDto } from '../../application/services/vitals.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  LogBloodPressureSchema,
  LogHeartRateSchema,
} from '../../application/services/vitals.service';
import { z } from 'zod';

// Query schema for history endpoints
const HistoryQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});
type HistoryQuery = z.infer<typeof HistoryQuerySchema>;

@Controller('health/vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  /**
   * POST /health/vitals/blood-pressure
   * Log a blood pressure reading
   */
  @Post('blood-pressure')
  async logBloodPressure(
    @Body(new ZodValidationPipe(LogBloodPressureSchema)) dto: LogBloodPressureDto,
  ) {
    const healthLog = await this.vitalsService.logBloodPressure(dto);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  /**
   * POST /health/vitals/heart-rate
   * Log a heart rate reading
   */
  @Post('heart-rate')
  async logHeartRate(
    @Body(new ZodValidationPipe(LogHeartRateSchema)) dto: LogHeartRateDto,
  ) {
    const healthLog = await this.vitalsService.logHeartRate(dto);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  /**
   * GET /health/vitals/blood-pressure
   * Get blood pressure history
   */
  @Get('blood-pressure')
  async getBloodPressureHistory(@Query() query: HistoryQuery) {
    const result = await this.vitalsService.getBloodPressureHistory({
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    // Transform dates for JSON serialization
    const serializedData = result.data.map((bp) => ({
      id: bp.id,
      loggedAt: bp.loggedAt.toISOString(),
      systolic: bp.systolic,
      diastolic: bp.diastolic,
      category: bp.category,
      notes: bp.notes,
    }));

    return {
      success: true,
      data: serializedData,
      meta: {
        total: result.total,
      },
    };
  }

  /**
   * GET /health/vitals/heart-rate
   * Get heart rate history
   */
  @Get('heart-rate')
  async getHeartRateHistory(@Query() query: HistoryQuery) {
    const result = await this.vitalsService.getHeartRateHistory({
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    // Transform dates for JSON serialization
    const serializedData = result.data.map((hr) => ({
      id: hr.id,
      loggedAt: hr.loggedAt.toISOString(),
      bpm: hr.bpm,
      category: hr.category,
      notes: hr.notes,
    }));

    return {
      success: true,
      data: serializedData,
      meta: {
        total: result.total,
      },
    };
  }

  /**
   * GET /health/vitals/latest
   * Get latest vitals summary (most recent BP and HR)
   */
  @Get('latest')
  async getLatestVitals() {
    const result = await this.vitalsService.getLatestVitals();

    // Transform dates for JSON serialization
    const serialized: {
      bloodPressure?: {
        id: string;
        loggedAt: string;
        systolic: number;
        diastolic: number;
        category: string;
        notes: string | null;
      };
      heartRate?: {
        id: string;
        loggedAt: string;
        bpm: number;
        category: string;
        notes: string | null;
      };
    } = {};

    if (result.bloodPressure) {
      serialized.bloodPressure = {
        id: result.bloodPressure.id,
        loggedAt: result.bloodPressure.loggedAt.toISOString(),
        systolic: result.bloodPressure.systolic,
        diastolic: result.bloodPressure.diastolic,
        category: result.bloodPressure.category,
        notes: result.bloodPressure.notes,
      };
    }

    if (result.heartRate) {
      serialized.heartRate = {
        id: result.heartRate.id,
        loggedAt: result.heartRate.loggedAt.toISOString(),
        bpm: result.heartRate.bpm,
        category: result.heartRate.category,
        notes: result.heartRate.notes,
      };
    }

    return {
      success: true,
      data: serialized,
    };
  }
}
