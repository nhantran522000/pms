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
import { JournalService } from '../../application/services/journal.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateJournalEntrySchema,
  CreateJournalEntryDto,
  UpdateJournalEntrySchema,
  UpdateJournalEntryDto,
} from '@pms/shared-types';
import { z } from 'zod';

const JournalQuerySchema = z.object({
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

const DateParamSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateJournalEntrySchema)) dto: CreateJournalEntryDto,
  ) {
    const entry = await this.journalService.create(dto);
    return {
      success: true,
      data: entry.toJSON(),
    };
  }

  @Get()
  async findAll(@Query() query: z.infer<typeof JournalQuerySchema>) {
    const entries = await this.journalService.findAll({
      startDate: query.startDate,
      endDate: query.endDate,
      limit: query.limit,
    });
    return {
      success: true,
      data: entries.map((e) => e.toJSON()),
    };
  }

  @Get('date/:date')
  async findByDate(@Param('date') date: string) {
    // Validate date format
    DateParamSchema.parse(date);
    const entry = await this.journalService.findByDate(date);
    return {
      success: true,
      data: entry.toJSON(),
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const entry = await this.journalService.findById(id);
    return {
      success: true,
      data: entry.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateJournalEntrySchema)) dto: UpdateJournalEntryDto,
  ) {
    const entry = await this.journalService.update(id, dto);
    return {
      success: true,
      data: entry.toJSON(),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.journalService.delete(id);
    return {
      success: true,
      data: { message: 'Journal entry deleted successfully' },
    };
  }
}
