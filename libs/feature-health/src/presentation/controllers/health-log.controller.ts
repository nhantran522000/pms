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
import { HealthLogService } from '../../application/services/health-log.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateHealthLogSchema,
  CreateHealthLogDto,
  UpdateHealthLogSchema,
  UpdateHealthLogDto,
  HealthLogTypeSchema,
} from '@pms/shared-types';
import { z } from 'zod';

const ListQuerySchema = z.object({
  type: HealthLogTypeSchema.optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

@Controller('health')
export class HealthLogController {
  constructor(private readonly healthLogService: HealthLogService) {}

  @Post('logs')
  async create(
    @Body(new ZodValidationPipe(CreateHealthLogSchema)) dto: CreateHealthLogDto,
  ) {
    const healthLog = await this.healthLogService.create(dto);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  @Get('logs')
  async findAll(@Query() query: z.infer<typeof ListQuerySchema>) {
    const healthLogs = await this.healthLogService.findAll({
      type: query.type,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });

    return {
      success: true,
      data: healthLogs.map((log) => log.toJSON()),
    };
  }

  @Get('logs/:id')
  async findById(@Param('id') id: string) {
    const healthLog = await this.healthLogService.findById(id);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  @Put('logs/:id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateHealthLogSchema)) dto: UpdateHealthLogDto,
  ) {
    const healthLog = await this.healthLogService.update(id, dto);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  @Delete('logs/:id')
  async softDelete(@Param('id') id: string) {
    await this.healthLogService.softDelete(id);
    return {
      success: true,
      data: { message: 'Health log deleted successfully' },
    };
  }
}
