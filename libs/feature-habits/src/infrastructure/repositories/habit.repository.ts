import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { HabitEntity } from '../../domain/entities/habit.entity';
import { HabitFrequency } from '@pms/shared-types';
import { Prisma } from '@prisma/client';

export interface CreateHabitInput {
  tenantId: string;
  name: string;
  description?: string | null;
  frequency: HabitFrequency;
  cronExpression?: string | null;
  color?: string | null;
  icon?: string | null;
}

@Injectable()
export class HabitRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateHabitInput): Promise<HabitEntity> {
    const habit = await this.prisma.habit.create({
      data: {
        tenantId: input.tenantId,
        name: input.name,
        description: input.description ?? null,
        frequency: input.frequency,
        cronExpression: input.cronExpression ?? null,
        color: input.color ?? null,
        icon: input.icon ?? null,
        isActive: true,
        currentStreak: 0,
        longestStreak: 0,
      },
    });

    return HabitEntity.fromPrisma(habit);
  }

  async findById(id: string, tenantId: string): Promise<HabitEntity | null> {
    const habit = await this.prisma.habit.findFirst({
      where: { id, tenantId },
    });
    return habit ? HabitEntity.fromPrisma(habit) : null;
  }

  async findAll(
    tenantId: string,
    options?: { isActive?: boolean },
  ): Promise<HabitEntity[]> {
    const where: Prisma.HabitWhereInput = {
      tenantId,
      ...(options?.isActive !== undefined && { isActive: options.isActive }),
    };

    const habits = await this.prisma.habit.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return habits.map((h) => HabitEntity.fromPrisma(h));
  }

  async update(
    id: string,
    tenantId: string,
    input: Partial<CreateHabitInput>,
  ): Promise<HabitEntity> {
    const data: Prisma.HabitUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.description !== undefined) data.description = input.description;
    if (input.frequency !== undefined) data.frequency = input.frequency;
    if (input.cronExpression !== undefined)
      data.cronExpression = input.cronExpression;
    if (input.color !== undefined) data.color = input.color;
    if (input.icon !== undefined) data.icon = input.icon;
    if (input.isActive !== undefined) data.isActive = input.isActive;

    const habit = await this.prisma.habit.update({
      where: { id },
      data,
    });

    return HabitEntity.fromPrisma(habit);
  }

  async updateStreaks(
    id: string,
    tenantId: string,
    currentStreak: number,
    longestStreak: number,
  ): Promise<HabitEntity> {
    const habit = await this.prisma.habit.update({
      where: { id },
      data: {
        currentStreak,
        longestStreak,
      },
    });

    return HabitEntity.fromPrisma(habit);
  }

  async softDelete(id: string, tenantId: string): Promise<HabitEntity> {
    const habit = await this.prisma.habit.update({
      where: { id },
      data: { isActive: false },
    });

    return HabitEntity.fromPrisma(habit);
  }
}
