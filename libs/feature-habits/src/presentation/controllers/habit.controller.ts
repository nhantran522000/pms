import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { HabitService } from '../../application/services/habit.service';
import { HabitCompletionService } from '../../application/services/habit-completion.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateHabitSchema,
  CreateHabitDto,
  UpdateHabitSchema,
  UpdateHabitDto,
  CheckInHabitSchema,
  CheckInHabitDto,
} from '@pms/shared-types';
import { z } from 'zod';

const DateRangeQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

const HabitQuerySchema = z.object({
  isActive: z
    .string()
    .transform((v) => v === 'true')
    .optional(),
});

@Controller('habits')
export class HabitController {
  constructor(
    private readonly habitService: HabitService,
    private readonly completionService: HabitCompletionService,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateHabitSchema)) dto: CreateHabitDto,
  ) {
    const habit = await this.habitService.create(dto);
    return {
      success: true,
      data: habit.toJSON(),
    };
  }

  @Get()
  async findAll(@Query() query: z.infer<typeof HabitQuerySchema>) {
    const habits = await this.habitService.findAll({
      isActive: query.isActive,
    });
    return {
      success: true,
      data: habits.map((h) => h.toJSON()),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const habit = await this.habitService.findById(id);
    return {
      success: true,
      data: habit.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateHabitSchema)) dto: UpdateHabitDto,
  ) {
    const habit = await this.habitService.update(id, dto);
    return {
      success: true,
      data: habit.toJSON(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.habitService.delete(id);
    return {
      success: true,
      data: { message: 'Habit deleted successfully' },
    };
  }

  @Post(':id/check-in')
  async checkIn(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(CheckInHabitSchema)) dto: CheckInHabitDto,
  ) {
    const completion = await this.completionService.checkIn(id, dto);
    return {
      success: true,
      data: completion.toJSON(),
    };
  }

  @Get(':id/completions')
  async getCompletions(
    @Param('id') id: string,
    @Query() query: z.infer<typeof DateRangeQuerySchema>,
  ) {
    const completions = await this.completionService.getCompletions(id, {
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });
    return {
      success: true,
      data: completions.map((c) => c.toJSON()),
    };
  }

  @Get(':id/streak')
  async getStreak(@Param('id') id: string) {
    const streakInfo = await this.completionService.calculateStreak(id);
    return {
      success: true,
      data: streakInfo,
    };
  }
}
