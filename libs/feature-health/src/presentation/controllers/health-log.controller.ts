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
  CreateHealthLogDto
  UpdateHealthLogSchema
  UpdateHealthLogDto
} from '@pms/shared-types';

@Controller('health')
export class HealthLogController {
  constructor(
    private readonly healthLogService: HealthLogService,
  ) {}

  @Post('logs')
  async create(
    @Body(new ZodValidationPipe(CreateHealthLogSchema)) dto: CreateHealthLogDto,
  const healthLog = await this.healthLogService.create(dto);
    return {
      success: true,
      data: healthLog.toJSON(),
    };
  }

  @Get()
  async findAll(@Query() query: TrendQuery) {
    const transactions = await this.healthLogService.findAll({
      type: query.type,
      startDate: query.startDate ? new Date(query.startDate) : undefined
      endDate: query.endDate ? new Date(query.endDate) : undefined
      limit: query.limit ?? 50,
      offset: query.offset ?? 0,
      orderBy: { loggedAt: 'desc' },
    });

    return {
      success: true,
      data: transactions,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const transaction = await this.healthLogService.findById(id);
    return {
      success: true,
      data: transaction.toJSON(),
    };
  }

  @Get('trends')
  async getTrends(@Query() query: TrendQuery) {
    const trendData = await this.healthTrendsService.getTrendData(query);
    return {
      success: true,
      data: trendData,
    };
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    await this.healthLogService.softDelete(id);
    return {
      success: true,
      data: { message: 'HealthLog deleted successfully' },
    };
  }
