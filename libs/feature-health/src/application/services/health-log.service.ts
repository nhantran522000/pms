import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { HealthLogRepository, CreateHealthLogInput, UpdateHealthLogInput } from '../../infrastructure/repositories/health-log.repository';
import { HealthLogEntity } from '../../domain/entities/health-log.entity';
import { HealthData } from '../../domain/value-objects/health-data.vo';
import {
  CreateHealthLogDto,
  UpdateHealthLogDto,
  HealthLogType,
  WeightDataSchema,
  BloodPressureDataSchema,
  HeartRateDataSchema,
  SleepDataSchema,
  WorkoutDataSchema,
} from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HealthLogService {
  private readonly logger = new Logger(HealthLogService.name);

  constructor(private readonly healthLogRepository: HealthLogRepository) {}

  /**
   * Create a new health log entry
   */
  async create(dto: CreateHealthLogDto): Promise<HealthLogEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Creating health log of type: ${dto.type}`);

    // Validate data against type-specific schema
    this.validateDataType(dto.type, dto.data);

    const loggedAt = typeof dto.loggedAt === 'string' ? new Date(dto.loggedAt) : dto.loggedAt;

    const input: CreateHealthLogInput = {
      tenantId,
      type: dto.type,
      loggedAt,
      data: dto.data,
      notes: dto.notes ?? null,
      source: dto.source,
    };

    const healthLog = await this.healthLogRepository.create(input);
    this.logger.log(`Health log created: ${healthLog.id}`);

    return healthLog;
  }

  /**
   * Find health log by ID
   */
  async findById(id: string): Promise<HealthLogEntity> {
    const tenantId = this.getTenantId();
    const healthLog = await this.healthLogRepository.findById(id, tenantId);

    if (!healthLog) {
      throw new NotFoundException('Health log not found');
    }

    return healthLog;
  }

  /**
   * Find health logs by type with optional date filtering
   */
  async findByType(
    type: HealthLogType,
    options?: { startDate?: Date; endDate?: Date },
  ): Promise<HealthLogEntity[]> {
    const tenantId = this.getTenantId();
    return this.healthLogRepository.findByType(tenantId, type, options);
  }

  /**
   * Find all health logs with optional filtering
   */
  async findAll(options?: {
    type?: HealthLogType;
    startDate?: Date;
    endDate?: Date;
  }): Promise<HealthLogEntity[]> {
    const tenantId = this.getTenantId();

    if (options?.type) {
      return this.healthLogRepository.findByType(tenantId, options.type, {
        startDate: options.startDate,
        endDate: options.endDate,
      });
    }

    // If no type specified, we need to fetch all - this would require a new repository method
    // For now, we'll fetch by type for each type
    const types: HealthLogType[] = ['WEIGHT', 'BLOOD_PRESSURE', 'HEART_RATE', 'SLEEP', 'WORKOUT'];
    const results = await Promise.all(
      types.map((type) =>
        this.healthLogRepository.findByType(tenantId, type, {
          startDate: options?.startDate,
          endDate: options?.endDate,
        }),
      ),
    );

    return results.flat().sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
  }

  /**
   * Update a health log entry
   */
  async update(id: string, dto: UpdateHealthLogDto): Promise<HealthLogEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Updating health log: ${id}`);

    // Verify the health log exists
    const existing = await this.healthLogRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Health log not found');
    }

    // If data is being updated, validate it against the existing type
    if (dto.data) {
      this.validateDataType(existing.type, dto.data);
    }

    const input: UpdateHealthLogInput = {
      loggedAt: dto.loggedAt ? (typeof dto.loggedAt === 'string' ? new Date(dto.loggedAt) : dto.loggedAt) : undefined,
      data: dto.data,
      notes: dto.notes ?? null,
    };

    const healthLog = await this.healthLogRepository.update(id, tenantId, input);
    this.logger.log(`Health log updated: ${id}`);

    return healthLog;
  }

  /**
   * Soft delete a health log entry
   */
  async softDelete(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Soft deleting health log: ${id}`);

    const existing = await this.healthLogRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Health log not found');
    }

    await this.healthLogRepository.softDelete(id, tenantId);
    this.logger.log(`Health log soft deleted: ${id}`);
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

  /**
   * Validate data against type-specific schema
   */
  private validateDataType(type: HealthLogType, data: Record<string, unknown>): void {
    try {
      switch (type) {
        case 'WEIGHT':
          WeightDataSchema.parse(data);
          break;
        case 'BLOOD_PRESSURE':
          BloodPressureDataSchema.parse(data);
          break;
        case 'HEART_RATE':
          HeartRateDataSchema.parse(data);
          break;
        case 'SLEEP':
          SleepDataSchema.parse(data);
          break;
        case 'WORKOUT':
          WorkoutDataSchema.parse(data);
          break;
        default:
          throw new BadRequestException(`Unknown health log type: ${type}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new BadRequestException(`Invalid data for type ${type}: ${error.message}`);
      }
      throw error;
    }
  }
}
