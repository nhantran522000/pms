import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HealthLogRepository } from '../../infrastructure/repositories/health-log.repository';
import { HealthLogEntity } from '../../domain/entities/health-log.entity';
import {
  BloodPressureDataSchema,
  HeartRateDataSchema,
  BloodPressureData,
  HeartRateData,
} from '@pms/shared-types';
import {
  getBloodPressureCategory,
  getHeartRateCategory,
  BloodPressureCategory,
  HeartRateCategory,
} from '../../domain/constants/reference-ranges';
import { getTenantId } from '@pms/data-access';
import { z } from 'zod';

// DTOs for vitals logging
export const LogBloodPressureSchema = z.object({
  systolic: z.number().int().min(60).max(250),
  diastolic: z.number().int().min(40).max(150),
  loggedAt: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(1000).optional(),
});
export type LogBloodPressureDto = z.infer<typeof LogBloodPressureSchema>;

export const LogHeartRateSchema = z.object({
  bpm: z.number().int().min(30).max(220),
  loggedAt: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(1000).optional(),
});
export type LogHeartRateDto = z.infer<typeof LogHeartRateSchema>;

// Response types
export interface BloodPressureLog {
  id: string;
  loggedAt: Date;
  systolic: number;
  diastolic: number;
  category: BloodPressureCategory;
  notes: string | null;
}

export interface HeartRateLog {
  id: string;
  loggedAt: Date;
  bpm: number;
  category: HeartRateCategory;
  notes: string | null;
}

export interface VitalsHistoryResponse {
  data: BloodPressureLog[] | HeartRateLog[];
  total: number;
}

export interface LatestVitalsResponse {
  bloodPressure?: BloodPressureLog;
  heartRate?: HeartRateLog;
}

@Injectable()
export class VitalsService {
  private readonly logger = new Logger(VitalsService.name);

  constructor(private readonly healthLogRepository: HealthLogRepository) {}

  /**
   * Log a blood pressure reading
   */
  async logBloodPressure(dto: LogBloodPressureDto): Promise<HealthLogEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Logging blood pressure: ${dto.systolic}/${dto.diastolic}`);

    // Validate input
    const validatedData = BloodPressureDataSchema.parse({
      systolic: dto.systolic,
      diastolic: dto.diastolic,
    });

    const loggedAt = dto.loggedAt
      ? typeof dto.loggedAt === 'string'
        ? new Date(dto.loggedAt)
        : dto.loggedAt
      : new Date();

    const healthLog = await this.healthLogRepository.create({
      tenantId,
      type: 'BLOOD_PRESSURE',
      loggedAt,
      data: validatedData,
      notes: dto.notes ?? null,
      source: 'manual',
    });

    this.logger.log(`Blood pressure logged: ${healthLog.id}`);
    return healthLog;
  }

  /**
   * Log a heart rate reading
   */
  async logHeartRate(dto: LogHeartRateDto): Promise<HealthLogEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Logging heart rate: ${dto.bpm} bpm`);

    // Validate input
    const validatedData = HeartRateDataSchema.parse({
      bpm: dto.bpm,
    });

    const loggedAt = dto.loggedAt
      ? typeof dto.loggedAt === 'string'
        ? new Date(dto.loggedAt)
        : dto.loggedAt
      : new Date();

    const healthLog = await this.healthLogRepository.create({
      tenantId,
      type: 'HEART_RATE',
      loggedAt,
      data: validatedData,
      notes: dto.notes ?? null,
      source: 'manual',
    });

    this.logger.log(`Heart rate logged: ${healthLog.id}`);
    return healthLog;
  }

  /**
   * Get blood pressure history
   */
  async getBloodPressureHistory(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<VitalsHistoryResponse> {
    const tenantId = this.getTenantId();

    const logs = await this.healthLogRepository.findByType(
      tenantId,
      'BLOOD_PRESSURE',
      options,
    );

    const data: BloodPressureLog[] = logs.map((log) => {
      const bpData = log.data as BloodPressureData;
      return {
        id: log.id,
        loggedAt: log.loggedAt,
        systolic: bpData.systolic,
        diastolic: bpData.diastolic,
        category: getBloodPressureCategory(bpData.systolic, bpData.diastolic),
        notes: log.notes,
      };
    });

    return {
      data,
      total: data.length,
    };
  }

  /**
   * Get heart rate history
   */
  async getHeartRateHistory(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<VitalsHistoryResponse> {
    const tenantId = this.getTenantId();

    const logs = await this.healthLogRepository.findByType(
      tenantId,
      'HEART_RATE',
      options,
    );

    const data: HeartRateLog[] = logs.map((log) => {
      const hrData = log.data as HeartRateData;
      return {
        id: log.id,
        loggedAt: log.loggedAt,
        bpm: hrData.bpm,
        category: getHeartRateCategory(hrData.bpm),
        notes: log.notes,
      };
    });

    return {
      data,
      total: data.length,
    };
  }

  /**
   * Get latest vitals summary (most recent BP and HR)
   */
  async getLatestVitals(): Promise<LatestVitalsResponse> {
    const tenantId = this.getTenantId();

    // Fetch latest blood pressure
    const bpLogs = await this.healthLogRepository.findByType(
      tenantId,
      'BLOOD_PRESSURE',
      { limit: 1 },
    );

    // Fetch latest heart rate
    const hrLogs = await this.healthLogRepository.findByType(
      tenantId,
      'HEART_RATE',
      { limit: 1 },
    );

    const result: LatestVitalsResponse = {};

    if (bpLogs.length > 0) {
      const bpData = bpLogs[0].data as BloodPressureData;
      result.bloodPressure = {
        id: bpLogs[0].id,
        loggedAt: bpLogs[0].loggedAt,
        systolic: bpData.systolic,
        diastolic: bpData.diastolic,
        category: getBloodPressureCategory(bpData.systolic, bpData.diastolic),
        notes: bpLogs[0].notes,
      };
    }

    if (hrLogs.length > 0) {
      const hrData = hrLogs[0].data as HeartRateData;
      result.heartRate = {
        id: hrLogs[0].id,
        loggedAt: hrLogs[0].loggedAt,
        bpm: hrData.bpm,
        category: getHeartRateCategory(hrData.bpm),
        notes: hrLogs[0].notes,
      };
    }

    return result;
  }

  /**
   * Get tenant ID from context with validation
   */
  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
