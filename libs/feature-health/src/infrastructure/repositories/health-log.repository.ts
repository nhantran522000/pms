import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { HealthLogEntity } from '../../domain/entities/health-log.entity';
import { HealthLogType } from '@pms/shared-types';
import { Prisma } from '@prisma/client';

export interface CreateHealthLogInput {
  tenantId: string;
  type: HealthLogType;
  loggedAt: Date;
  data: Record<string, unknown>;
  notes: string | null;
  source: string;
}

export interface UpdateHealthLogInput {
  loggedAt?: Date;
  data?: Record<string, unknown>;
  notes?: string | null;
}

@Injectable()
export class HealthLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateHealthLogInput): Promise<HealthLogEntity> {
    const healthLog = await this.prisma.healthLog.create({
      data: {
        tenantId: input.tenantId,
        type: input.type,
        loggedAt: input.loggedAt,
        data: input.data,
        notes: input.notes,
        source: input.source,
      },
    });

    return HealthLogEntity.fromPrisma(healthLog);
  }

  async findById(id: string, tenantId: string): Promise<HealthLogEntity | null> {
    const healthLog = await this.prisma.healthLog.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
    return healthLog ? HealthLogEntity.fromPrisma(healthLog) : null;
  }

  async findByType(
    tenantId: string,
    type: HealthLogType,
    options?: { startDate?: Date; endDate?: Date; limit?: number },
  ): Promise<HealthLogEntity[]> {
    const where: Prisma.HealthLogWhereInput = {
      tenantId,
      type,
      deletedAt: null,
      ...(options?.startDate && { loggedAt: { gte: options.startDate } }),
      ...(options?.endDate && { loggedAt: { lte: options.endDate } }),
    };

    const healthLogs = await this.prisma.healthLog.findMany({
      where,
      orderBy: { loggedAt: 'desc' },
      take: options?.limit ?? 50,
    });

    return healthLogs.map((log) => HealthLogEntity.fromPrisma(log));
  }

  async update(
    id: string,
    tenantId: string,
    input: UpdateHealthLogInput,
  ): Promise<HealthLogEntity> {
    const data: Prisma.HealthLogUpdateInput = {};

    if (input.loggedAt !== undefined) data.loggedAt = input.loggedAt;
    if (input.data !== undefined) data.data = input.data;
    if (input.notes !== undefined) data.notes = input.notes;

    const healthLog = await this.prisma.healthLog.update({
      where: { id, tenantId },
      data,
    });

    return HealthLogEntity.fromPrisma(healthLog);
  }

  async softDelete(id: string, tenantId: string): Promise<HealthLogEntity> {
    const healthLog = await this.prisma.healthLog.update({
      where: { id, tenantId },
      data: { deletedAt: new Date() },
    });

    return HealthLogEntity.fromPrisma(healthLog);
  }

  async findTrendData(
    tenantId: string,
    type: HealthLogType,
    startDate: Date,
    endDate: Date,
  ): Promise<HealthLogEntity[]> {
    const healthLogs = await this.prisma.healthLog.findMany({
      where: {
        tenantId,
        type,
        deletedAt: null,
        loggedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { loggedAt: 'asc' },
    });

    return healthLogs.map((log) => HealthLogEntity.fromPrisma(log));
  }
}
