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
import { TransactionService } from '../../application/services/transaction.service';
import { ZodValidationPipe } from '@pms/shared-kernel';
import {
  CreateTransactionSchema,
  CreateTransactionDto,
  UpdateTransactionSchema,
  UpdateTransactionDto,
} from '@pms/shared-types';
import { z } from 'zod';

const DateQuerySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  accountId: z.string().cuid().optional(),
  categoryId: z.string().cuid().optional(),
  type: z.enum(['income', 'expense']).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  offset: z.coerce.number().int().min(0).optional(),
});

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateTransactionSchema)) dto: CreateTransactionDto,
  ) {
    const transaction = await this.transactionService.create(dto);
    return {
      success: true,
      data: transaction.toJSON(),
    };
  }

  @Get()
  async findAll(@Query() query: z.infer<typeof DateQuerySchema>) {
    const transactions = await this.transactionService.findWithRelations({
      accountId: query.accountId,
      categoryId: query.categoryId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      type: query.type,
      limit: query.limit,
      offset: query.offset,
    });

    return {
      success: true,
      data: transactions,
    };
  }

  @Get('totals')
  async getTotals(@Query() query: { startDate?: string; endDate?: string; accountId?: string }) {
    const totals = await this.transactionService.getTotals({
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      accountId: query.accountId,
    });

    return {
      success: true,
      data: totals,
    };
  }

  @Get('count')
  async count(@Query() query: z.infer<typeof DateQuerySchema>) {
    const count = await this.transactionService.count({
      accountId: query.accountId,
      categoryId: query.categoryId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      type: query.type,
    });

    return {
      success: true,
      data: { count },
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const transaction = await this.transactionService.findById(id);
    return {
      success: true,
      data: transaction.toJSON(),
    };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateTransactionSchema)) dto: UpdateTransactionDto,
  ) {
    const transaction = await this.transactionService.update(id, dto);
    return {
      success: true,
      data: transaction.toJSON(),
    };
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string) {
    await this.transactionService.softDelete(id);
    return {
      success: true,
      data: { message: 'Transaction deleted successfully' },
    };
  }

  @Post(':id/restore')
  async restore(@Param('id') id: string) {
    const transaction = await this.transactionService.restore(id);
    return {
      success: true,
      data: transaction.toJSON(),
    };
  }
}
