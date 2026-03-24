import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@pms/data-access';
import { HobbyEntity } from '../../domain/entities/hobby.entity';
import type { CreateHobbyDto, UpdateHobbyDto } from '@pms/shared-types';
import { Decimal } from '@prisma/client/runtime/library';

type PrismaHobby = {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  trackingType: string;
  goalTarget: { toNumber: () => number } | null;
  goalDeadline: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class HobbyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: CreateHobbyDto): Promise<HobbyEntity> {
    const hobby = await this.prisma.hobby.create({
      data: {
        tenantId,
        name: data.name,
        description: data.description,
        trackingType: data.trackingType,
        goalTarget: data.goalTarget !== undefined ? new Decimal(data.goalTarget) : null,
        goalDeadline: data.goalDeadline ? new Date(data.goalDeadline) : null,
      },
    });
    return HobbyEntity.fromPrisma(hobby as PrismaHobby);
  }

  async findById(tenantId: string, id: string): Promise<HobbyEntity | null> {
    const hobby = await this.prisma.hobby.findFirst({
      where: { tenantId, id },
    });
    return hobby ? HobbyEntity.fromPrisma(hobby as PrismaHobby) : null;
  }

  async findAll(tenantId: string, includeInactive = false): Promise<HobbyEntity[]> {
    const hobbies = await this.prisma.hobby.findMany({
      where: {
        tenantId,
        ...(includeInactive ? {} : { isActive: true }),
      },
      orderBy: { createdAt: 'desc' },
    });
    return hobbies.map((h) => HobbyEntity.fromPrisma(h as PrismaHobby));
  }

  async update(tenantId: string, id: string, data: UpdateHobbyDto): Promise<HobbyEntity> {
    const hobby = await this.prisma.hobby.update({
      where: { tenantId, id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.goalTarget !== undefined && {
          goalTarget: data.goalTarget === null ? null : new Decimal(data.goalTarget),
        }),
        ...(data.goalDeadline !== undefined && {
          goalDeadline: data.goalDeadline === null ? null : new Date(data.goalDeadline),
        }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
    return HobbyEntity.fromPrisma(hobby as PrismaHobby);
  }

  async delete(tenantId: string, id: string): Promise<void> {
    await this.prisma.hobby.delete({
      where: { tenantId, id },
    });
  }
}
