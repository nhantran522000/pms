import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { HobbyRepository } from '../../infrastructure/repositories/hobby.repository';
import { HobbyLogRepository } from '../../infrastructure/repositories/hobby-log.repository';
import { HobbyEntity } from '../../domain/entities/hobby.entity';
import { HobbyLogData } from '../../domain/value-objects/hobby-log-data.vo';
import type {
  CreateHobbyDto,
  UpdateHobbyDto,
  HobbyResponse,
  HobbyTrackingType,
} from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HobbyService {
  private readonly logger = new Logger(HobbyService.name);

  constructor(
    private readonly hobbyRepository: HobbyRepository,
    private readonly hobbyLogRepository: HobbyLogRepository,
  ) {}

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new BadRequestException('Tenant context not found');
    }
    return tenantId;
  }

  /**
   * Create a new hobby
   */
  async create(dto: CreateHobbyDto): Promise<HobbyResponse> {
    const tenantId = this.getTenantId();
    this.logger.log(`Creating hobby: ${dto.name} with type: ${dto.trackingType}`);

    // Validate: LIST hobbies cannot have goalTarget
    if (dto.trackingType === 'LIST' && dto.goalTarget !== undefined) {
      throw new BadRequestException('LIST hobbies cannot have a goal target');
    }

    const hobby = await this.hobbyRepository.create(tenantId, dto);
    this.logger.log(`Hobby created: ${hobby.id}`);

    return this.toResponse(hobby);
  }

  /**
   * Find hobby by ID
   */
  async findById(id: string): Promise<HobbyResponse> {
    const tenantId = this.getTenantId();
    const hobby = await this.hobbyRepository.findById(tenantId, id);

    if (!hobby) {
      throw new NotFoundException('Hobby not found');
    }

    return this.toResponse(hobby);
  }

  /**
   * Find all hobbies
   */
  async findAll(includeInactive?: boolean): Promise<HobbyResponse[]> {
    const tenantId = this.getTenantId();
    const hobbies = await this.hobbyRepository.findAll(tenantId, includeInactive);
    return hobbies.map((h) => this.toResponse(h));
  }

  /**
   * Update a hobby
   */
  async update(id: string, dto: UpdateHobbyDto): Promise<HobbyResponse> {
    const tenantId = this.getTenantId();
    this.logger.log(`Updating hobby: ${id}`);

    // Verify hobby exists
    const existing = await this.hobbyRepository.findById(tenantId, id);
    if (!existing) {
      throw new NotFoundException('Hobby not found');
    }

    // Validate: cannot set goalTarget on LIST hobby
    if (dto.goalTarget !== undefined && dto.goalTarget !== null && existing.trackingType === 'LIST') {
      throw new BadRequestException('LIST hobbies cannot have a goal target');
    }

    const hobby = await this.hobbyRepository.update(tenantId, id, dto);
    this.logger.log(`Hobby updated: ${id}`);

    return this.toResponse(hobby);
  }

  /**
   * Delete a hobby
   */
  async delete(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Deleting hobby: ${id}`);

    await this.hobbyRepository.delete(tenantId, id);
    this.logger.log(`Hobby deleted: ${id}`);
  }

  /**
   * Calculate completion percentage for a hobby
   */
  async calculateCompletionPercentage(hobby: HobbyEntity): Promise<number> {
    // If no goal target, return 0
    if (hobby.goalTarget === null) {
      return 0;
    }

    const trackingType = hobby.trackingType;
    let currentTotal = 0;

    switch (trackingType) {
      case 'COUNTER': {
        // Sum all log increments
        currentTotal = await this.hobbyLogRepository.sumCounterByHobby(hobby.tenantId, hobby.id);
        break;
      }
      case 'PERCENTAGE': {
        // Get latest percentage value
        const latest = await this.hobbyLogRepository.getLatestPercentageByHobby(hobby.tenantId, hobby.id);
        currentTotal = latest ?? 0;
        break;
      }
      case 'LIST': {
        // LIST hobbies don't support goals
        return 0;
      }
      default:
        return 0;
    }

    // Calculate percentage capped at 100
    const completion = (currentTotal / hobby.goalTarget) * 100;
    return Math.min(completion, 100);
  }

  private toResponse(hobby: HobbyEntity): HobbyResponse {
    return {
      id: hobby.id,
      tenantId: hobby.tenantId,
      name: hobby.name,
      description: hobby.description,
      trackingType: hobby.trackingType,
      goalTarget: hobby.goalTarget,
      goalDeadline: hobby.goalDeadline,
      isActive: hobby.isActive,
      createdAt: hobby.createdAt,
      updatedAt: hobby.updatedAt,
    };
  }
}
