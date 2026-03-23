import { HealthLogType } from '@prisma/client';

export interface HealthLogEntityProps {
  id: string;
  tenantId: string;
  type: HealthLogType;
  loggedAt: Date;
  data: Record<string, unknown>;
  notes: string | null;
  source: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * HealthLog domain entity
 */
export class HealthLogEntity {
  private constructor(private readonly props: HealthLogEntityProps) {}

  static fromPrisma(log: {
    id: string;
    tenantId: string;
    type: HealthLogType;
    loggedAt: Date;
    data: JsonValue;
    notes: string | null;
    source: string;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): HealthLogEntity {
    return new HealthLogEntity({
      id: log.id,
      tenantId: log.tenantId,
      type: log.type,
      loggedAt: log.loggedAt,
      data: log.data as Record<string, unknown>,
      notes: log.notes,
      source: log.source,
      deletedAt: log.deletedAt,
      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get type(): HealthLogType {
    return this.props.type;
  }

  get loggedAt(): Date {
    return this.props.loggedAt;
  }

  get data(): Record<string, unknown> {
    return this.props.data;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get source(): string {
    return this.props.source;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  toJSON(): HealthLogEntityProps {
    return {
      id: this.props.id,
      tenantId: this.props.tenantId,
      type: this.props.type,
      loggedAt: this.props.loggedAt,
      data: this.props.data,
      notes: this.props.notes,
      source: this.props.source,
      deletedAt: this.props.deletedAt,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}

type JsonValue = { [key: string]: JsonValue[key] } | null | string | number | boolean | object | JsonValue[];
