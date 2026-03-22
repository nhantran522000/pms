import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { HabitRepository } from '../../infrastructure/repositories/habit.repository';
import { HabitEntity } from '../../domain/entities/habit.entity';
import { CreateHabitDto, UpdateHabitDto } from '@pms/shared-types';
import { getTenantId } from '@pms/data-access';

@Injectable()
export class HabitService {
  private readonly logger = new Logger(HabitService.name);

  constructor(private readonly habitRepository: HabitRepository) {}

  async create(dto: CreateHabitDto): Promise<HabitEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Creating habit: ${dto.name}`);

    const habit = await this.habitRepository.create({
      tenantId,
      name: dto.name,
      description: dto.description ?? null,
      frequency: dto.frequency,
      cronExpression: dto.cronExpression ?? null,
      color: dto.color ?? null,
      icon: dto.icon ?? null,
    });

    this.logger.log(`Habit created: ${habit.id}`);
    return habit;
  }

  async findById(id: string): Promise<HabitEntity> {
    const tenantId = this.getTenantId();
    const habit = await this.habitRepository.findById(id, tenantId);

    if (!habit) {
      throw new NotFoundException('Habit not found');
    }

    return habit;
  }

  async findAll(options?: { isActive?: boolean }): Promise<HabitEntity[]> {
    const tenantId = this.getTenantId();
    return this.habitRepository.findAll(tenantId, options);
  }

  async update(id: string, dto: UpdateHabitDto): Promise<HabitEntity> {
    const tenantId = this.getTenantId();
    this.logger.log(`Updating habit: ${id}`);

    // Verify habit exists
    const existing = await this.habitRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Habit not found');
    }

    const habit = await this.habitRepository.update(id, tenantId, {
      name: dto.name,
      description: dto.description,
      frequency: dto.frequency,
      cronExpression: dto.cronExpression,
      color: dto.color,
      icon: dto.icon,
      isActive: dto.isActive,
    });

    this.logger.log(`Habit updated: ${id}`);
    return habit;
  }

  async delete(id: string): Promise<void> {
    const tenantId = this.getTenantId();
    this.logger.log(`Deleting habit: ${id}`);

    // Verify habit exists
    const existing = await this.habitRepository.findById(id, tenantId);
    if (!existing) {
      throw new NotFoundException('Habit not found');
    }

    await this.habitRepository.softDelete(id, tenantId);
    this.logger.log(`Habit soft deleted: ${id}`);
  }

  private getTenantId(): string {
    const tenantId = getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found');
    }
    return tenantId;
  }
}
