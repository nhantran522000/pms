import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { HobbyLogService } from '../../application/services/hobby-log.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateHobbyLogSchema,
  type CreateHobbyLogDto,
  type HobbyLogResponse,
} from '@pms/shared-types';

@Controller('hobbies')
export class HobbyLogController {
  constructor(private readonly hobbyLogService: HobbyLogService) {}

  /**
   * POST /hobbies/:hobbyId/logs
   * Log progress for a hobby
   */
  @Post(':hobbyId/logs')
  async create(
    @Param('hobbyId') hobbyId: string,
    @Body(new ZodValidationPipe(CreateHobbyLogSchema)) dto: CreateHobbyLogDto,
  ) {
    const log = await this.hobbyLogService.create(hobbyId, dto);
    return {
      success: true,
      data: log,
    };
  }

  /**
   * GET /hobbies/:hobbyId/logs
   * Get all logs for a hobby
   */
  @Get(':hobbyId/logs')
  async findByHobby(
    @Param('hobbyId') hobbyId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    let logs: HobbyLogResponse[];

    if (startDate && endDate) {
      logs = await this.hobbyLogService.findByHobbyAndDateRange(
        hobbyId,
        new Date(startDate),
        new Date(endDate),
      );
    } else {
      logs = await this.hobbyLogService.findByHobby(hobbyId);
    }

    return {
      success: true,
      data: logs,
      meta: {
        total: logs.length,
      },
    };
  }

  /**
   * DELETE /hobbies/:hobbyId/logs/:logId
   * Delete a hobby log entry
   */
  @Delete(':hobbyId/logs/:logId')
  async delete(@Param('hobbyId') hobbyId: string, @Param('logId') logId: string) {
    await this.hobbyLogService.delete(hobbyId, logId);
    return {
      success: true,
    };
  }
}
