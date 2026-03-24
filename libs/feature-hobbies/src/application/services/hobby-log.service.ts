import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { HobbyLogRepository } from '../../infrastructure/repositories/hobby-log.repository';
import { HobbyRepository } from '../../infrastructure/repositories/hobby.repository';
import { HobbyLogEntity } from '../../domain/entities/hobby-log.entity';
import { HobbyLogData } from '../../domain/value-objects/hobby-log-data.vo';
import type {
  CreateHobbyLogDto,
  HobbyLogResponse,
  HobbyTrackingType,
} from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HobbyLogService {
  private readonly logger = new Logger(HobbyLogService.name);

  constructor(
    private readonly hobbyLogRepository: HobbyLogRepository,
    private readonly hobbyRepository: HobbyRepository,
  ) {}

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new BadRequestException('Tenant context not found');
    }
    return tenantId;
  }

  /**
   * Create a new hobby log entry
   */
  async create(hobbyId: string, dto: CreateHobbyLogDto): Promise<HobbyLogResponse> {
    const tenantId = this.getTenantId();
    this.logger.log(`Creating log for hobby: ${hobbyId}`);

    // Fetch hobby to get tracking type
    const hobby = await this.hobbyRepository.findById(tenantId, hobbyId);
    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    // Validate logValue based on trackingType
    const validatedLogValue = this.validateLogValue(hobby.trackingType, dto.logValue);

    // Create log with validated value
    const log = await this.hobbyLogRepository.create(
      tenantId,
      hobbyId,
      hobby.trackingType,
      {
        ...dto,
        logValue: validatedLogValue,
      },
    );

    this.logger.log(`Hobby log created: ${log.id}`);
    return this.toResponse(log);
  }

  /**
   * Find all logs for a hobby
   */
  async findByHobby(hobbyId: string): Promise<HobbyLogResponse[]> {
    const tenantId = this.getTenantId();

    // Verify hobby exists
    const hobby = await this.hobbyRepository.findById(tenantId, hobbyId);
    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    const logs = await this.hobbyLogRepository.findByHobby(tenantId, hobbyId);
    return logs.map((l) => this.toResponse(l));
  }

  /**
   * Find logs for a hobby within a date range
   */
  async findByHobbyAndDateRange(
    hobbyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HobbyLogResponse[]> {
    const tenantId = this.getTenantId();

    // Verify hobby exists
    const hobby = await this.hobbyRepository.findById(tenantId, hobbyId);
    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    const logs = await this.hobbyLogRepository.findByHobbyAndDateRange(tenantId, hobbyId, startDate, endDate);
    return logs.map((l) => this.toResponse(l));
  }

  /**
   * Delete a hobby log entry
   */
  async delete(hobbyId: string, logId: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Deleting hobby log: ${logId}`);

    // Verify hobby exists
    const hobby = await this.hobbyRepository.findById(tenantId, hobbyId);
    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    await this.hobbyLogRepository.delete(tenantId, logId);
    this.logger.log(`Hobby log deleted: ${logId}`);
  }

  /**
   * Validate log value based on tracking type
   */
  private validateLogValue(trackingType: HobbyTrackingType, logValue: Record<string, unknown>): Record<string, unknown> {
    switch (trackingType) {
      case 'COUNTER': {
        const validated = HobbyLogData.validateCounterLogValue(logValue);
        // Default increment to 1 if not specified
        return {
          increment: validated.increment ?? 1,
        };
      }
      case 'PERCENTAGE': {
        const validated = HobbyLogData.validatePercentageLogValue(logValue);
        return {
          percentage: validated.percentage,
        };
      }
      case 'LIST': {
        const validated = HobbyLogData.validateListLogValue(logValue);
        return {
          label: validated.label,
        };
      }
      default:
        throw new BadRequestException(`Unknown tracking type: ${trackingType}`);
    }
  }

  private toResponse(log: HobbyLogEntity): HobbyLogResponse {
    return {
      id: log.id,
      tenantId: log.tenantId,
      hobbyId: log.hobbyId,
      trackingType: log.trackingType,
      logValue: log.logValue,
      loggedAt: log.loggedAt,
      notes: log.notes,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    };
  }
}
