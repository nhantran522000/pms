import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { HabitCompletionEntity } from '../../domain/entities/habit-completion.entity';
import { Prisma } from '@prisma/client';

export interface CreateCompletionInput {
  tenantId: string;
  habitId: string;
  date: Date;
  completed: boolean;
  notes?: string | null;
}

@Injectable()
export class HabitCompletionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateCompletionInput): Promise<HabitCompletionEntity> {
    const completion = await this.prisma.habitCompletion.create({
      data: {
        tenantId: input.tenantId,
        habitId: input.habitId,
        date: input.date,
        completed: input.completed,
        notes: input.notes ?? null,
      },
    });

    return HabitCompletionEntity.fromPrisma(completion);
  }

  async findByHabitAndDate(
    habitId: string,
    tenantId: string,
    date: Date,
  ): Promise<HabitCompletionEntity | null> {
    // Create date boundaries for the query (start and end of the day)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const completion = await this.prisma.habitCompletion.findFirst({
      where: {
        habitId,
        tenantId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    return completion ? HabitCompletionEntity.fromPrisma(completion) : null;
  }

  async findByHabit(
    habitId: string,
    tenantId: string,
    options?: { startDate?: Date; endDate?: Date },
  ): Promise<HabitCompletionEntity[]> {
    const where: Prisma.HabitCompletionWhereInput = {
      habitId,
      tenantId,
      ...(options?.startDate &&
        options?.endDate && {
          date: {
            gte: options.startDate,
            lte: options.endDate,
          },
        }),
      ...(options?.startDate &&
        !options?.endDate && {
          date: { gte: options.startDate },
        }),
      ...(!options?.startDate &&
        options?.endDate && {
          date: { lte: options.endDate },
        }),
    };

    const completions = await this.prisma.habitCompletion.findMany({
      where,
      orderBy: { date: 'desc' },
    });

    return completions.map((c) => HabitCompletionEntity.fromPrisma(c));
  }

  async update(
    id: string,
    tenantId: string,
    input: Partial<CreateCompletionInput>,
  ): Promise<HabitCompletionEntity> {
    const data: Prisma.HabitCompletionUpdateInput = {};

    if (input.completed !== undefined) data.completed = input.completed;
    if (input.notes !== undefined) data.notes = input.notes;

    const completion = await this.prisma.habitCompletion.update({
      where: { id },
      data,
    });

    return HabitCompletionEntity.fromPrisma(completion);
  }

  /**
   * Get all completion dates for a habit within a date range
   */
  async getCompletionDates(
    habitId: string,
    tenantId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<Date[]> {
    const completions = await this.prisma.habitCompletion.findMany({
      where: {
        habitId,
        tenantId,
        completed: true,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: { date: true },
      orderBy: { date: 'asc' },
    });

    return completions.map((c) => c.date);
  }

  /**
   * Get all completions for a habit ordered by date descending
   */
  async getAllCompletionsOrdered(
    habitId: string,
    tenantId: string,
  ): Promise<HabitCompletionEntity[]> {
    const completions = await this.prisma.habitCompletion.findMany({
      where: {
        habitId,
        tenantId,
        completed: true,
      },
      orderBy: { date: 'desc' },
    });

    return completions.map((c) => HabitCompletionEntity.fromPrisma(c));
  }
}
