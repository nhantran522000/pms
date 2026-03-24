import { Injectable, Logger } from '@nestjs/common';
import { HobbyRepository } from '../../infrastructure/repositories/hobby.repository';
import { HobbyLogRepository } from '../../infrastructure/repositories/hobby-log.repository';
import { HobbyEntity } from '../../domain/entities/hobby.entity';
import type { HobbyWithCompletion } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HobbyDashboardService {
  private readonly logger = new Logger(HobbyDashboardService.name);

  constructor(
    private readonly hobbyRepository: HobbyRepository,
    private readonly hobbyLogRepository: HobbyLogRepository,
  ) {}

  async getDashboard(): Promise<{ hobbies: HobbyWithCompletion[] }> {
    const tenantId = this.getTenantId();
    this.logger.log('Getting hobby dashboard');

    // Fetch all active hobbies
    const hobbies = await this.hobbyRepository.findAll(tenantId, false);

    // Calculate completion for each hobby
    const hobbiesWithCompletion: HobbyWithCompletion[] = await Promise.all(
      hobbies.map(async (hobby) => {
        const { currentTotal, completionPercentage } = await this.calculateProgress(hobby);

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
          currentTotal,
          completionPercentage,
        };
      }),
    );

    // Sort by completion percentage descending (most progress first)
    hobbiesWithCompletion.sort((a, b) => b.completionPercentage - a.completionPercentage);

    return { hobbies: hobbiesWithCompletion };
  }

  private async calculateProgress(hobby: HobbyEntity): Promise<{
    currentTotal: number;
    completionPercentage: number;
  }> {
    const logs = await this.hobbyLogRepository.findByHobby(hobby.tenantId, hobby.id);

    let currentTotal = 0;

    switch (hobby.trackingType) {
      case 'COUNTER':
        currentTotal = logs.reduce((sum, log) => sum + (log.getCounterIncrement() ?? 1), 0);
        break;
      case 'PERCENTAGE':
        // Use latest percentage value
        if (logs.length > 0) {
          currentTotal = logs[logs.length - 1].getPercentage() ?? 0;
        }
        break;
      case 'LIST':
        currentTotal = logs.length;
        break;
    }

    // Calculate completion percentage (capped at 100%)
    let completionPercentage = 0;
    if (hobby.goalTarget && hobby.goalTarget > 0) {
      const rawPercentage = (currentTotal / hobby.goalTarget) * 100;
      completionPercentage = Math.min(rawPercentage, 100);
    }

    return { currentTotal, completionPercentage };
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
