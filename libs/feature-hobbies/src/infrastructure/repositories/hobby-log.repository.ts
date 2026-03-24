import { Injectable } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { HobbyLogEntity } from '../../domain/entities/hobby-log.entity';
import type { CreateHobbyLogDto, HobbyTrackingType } from '@pms/shared-types';

type PrismaHobbyLog = {
  id: string;
  tenantId: string;
  hobbyId: string;
  trackingType: string;
  logValue: unknown;
  loggedAt: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class HobbyLogRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    tenantId: string,
    hobbyId: string,
    trackingType: HobbyTrackingType,
    data: CreateHobbyLogDto,
  ): Promise<HobbyLogEntity> {
    const log = await this.prisma.hobbyLog.create({
      data: {
        tenantId,
        hobbyId,
        trackingType,
        logValue: data.logValue,
        loggedAt: data.loggedAt ? new Date(data.loggedAt) : new Date(),
        notes: data.notes,
      },
    });
    return HobbyLogEntity.fromPrisma(log as PrismaHobbyLog);
  }

  async findByHobby(tenantId: string, hobbyId: string): Promise<HobbyLogEntity[]> {
    const logs = await this.prisma.hobbyLog.findMany({
      where: { tenantId, hobbyId },
      orderBy: { loggedAt: 'asc' },
    });
    return logs.map((l) => HobbyLogEntity.fromPrisma(l as PrismaHobbyLog));
  }

  async findByHobbyAndDateRange(
    tenantId: string,
    hobbyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<HobbyLogEntity[]> {
    const logs = await this.prisma.hobbyLog.findMany({
      where: {
        tenantId,
        hobbyId,
        loggedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { loggedAt: 'asc' },
    });
    return logs.map((l) => HobbyLogEntity.fromPrisma(l as PrismaHobbyLog));
  }

  async findById(tenantId: string, id: string): Promise<HobbyLogEntity | null> {
    const log = await this.prisma.hobbyLog.findFirst({
      where: { tenantId, id },
    });
    return log ? HobbyLogEntity.fromPrisma(log as PrismaHobbyLog) : null;
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.prisma.hobbyLog.delete({
      where: { tenantId, id },
    });
  }

  async sumCounterByHobby(tenantId: string, hobbyId: string): Promise<number> {
    const logs = await this.prisma.hobbyLog.findMany({
      where: { tenantId, hobbyId, trackingType: 'COUNTER' },
      select: { logValue: true },
    });
    return logs.reduce((sum, log) => {
      const increment = (log.logValue as { increment?: number }).increment ?? 1;
      return sum + increment;
    }, 0);
  }

  async getLatestPercentageByHobby(tenantId: string, hobbyId: string): Promise<number | null> {
    const log = await this.prisma.hobbyLog.findFirst({
      where: { tenantId, hobbyId, trackingType: 'PERCENTAGE' },
      orderBy: { loggedAt: 'desc' },
      select: { logValue: true },
    });
    if (!log) return null;
    return (log.logValue as { percentage: number }).percentage ?? null;
  }

  async countListEntriesByHobby(tenantId: string, hobbyId: string): Promise<number> {
    return this.prisma.hobbyLog.count({
      where: { tenantId, hobbyId, trackingType: 'LIST' },
    });
  }
}
