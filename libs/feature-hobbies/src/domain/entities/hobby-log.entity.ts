import type { HobbyTrackingType } from '@pms/shared-types';

export interface HobbyLogEntityProps {
  id: string;
  tenantId: string;
  hobbyId: string;
  trackingType: HobbyTrackingType;
  logValue: Record<string, unknown>;
  loggedAt: Date;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * HobbyLog domain entity
 */
export class HobbyLogEntity {
  private constructor(private readonly props: HobbyLogEntityProps) {}

  static fromPrisma(log: {
    id: string;
    tenantId: string;
    hobbyId: string;
    trackingType: HobbyTrackingType;
    logValue: unknown;
    loggedAt: Date;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): HobbyLogEntity {
    return new HobbyLogEntity({
      id: log.id,
      tenantId: log.tenantId,
      hobbyId: log.hobbyId,
      trackingType: log.trackingType,
      logValue: log.logValue as Record<string, unknown>,
      loggedAt: log.loggedAt,
      notes: log.notes,
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

  get hobbyId(): string {
    return this.props.hobbyId;
  }

  get trackingType(): HobbyTrackingType {
    return this.props.trackingType;
  }

  get logValue(): Record<string, unknown> {
    return this.props.logValue;
  }

  get loggedAt(): Date {
    return this.props.loggedAt;
  }

  get notes(): string | null {
    return this.props.notes;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Get counter increment value if trackingType is COUNTER
   * @returns increment value or null if not a counter log
   */
  getCounterIncrement(): number | null {
    if (this.props.trackingType !== 'COUNTER') {
      return null;
    }
    const increment = (this.props.logValue as { increment?: number }).increment;
    return increment ?? 1;
  }

  /**
   * Get percentage value if trackingType is PERCENTAGE
   * @returns percentage value or null if not a percentage log
   */
  getPercentage(): number | null {
    if (this.props.trackingType !== 'PERCENTAGE') {
      return null;
    }
    return (this.props.logValue as { percentage: number }).percentage ?? null;
  }

  /**
   * Get list label if trackingType is LIST
   * @returns label or null if not a list log
   */
  getListLabel(): string | null {
    if (this.props.trackingType !== 'LIST') {
      return null;
    }
    return (this.props.logValue as { label: string }).label ?? null;
  }

  toJSON(): HobbyLogEntityProps {
    return {
      id: this.props.id,
      tenantId: this.props.tenantId,
      hobbyId: this.props.hobbyId,
      trackingType: this.props.trackingType,
      logValue: this.props.logValue,
      loggedAt: this.props.loggedAt,
      notes: this.props.notes,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
