import type { HobbyTrackingType } from '@pms/shared-types';

export interface HobbyEntityProps {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  trackingType: HobbyTrackingType;
  goalTarget: number | null;
  goalDeadline: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Hobby domain entity
 */
export class HobbyEntity {
  private constructor(private readonly props: HobbyEntityProps) {}

  static fromPrisma(hobby: {
    id: string;
    tenantId: string;
    name: string;
    description: string | null;
    trackingType: HobbyTrackingType;
    goalTarget: { toNumber: () => number } | null;
    goalDeadline: Date | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): HobbyEntity {
    return new HobbyEntity({
      id: hobby.id,
      tenantId: hobby.tenantId,
      name: hobby.name,
      description: hobby.description,
      trackingType: hobby.trackingType,
      goalTarget: hobby.goalTarget?.toNumber() ?? null,
      goalDeadline: hobby.goalDeadline,
      isActive: hobby.isActive,
      createdAt: hobby.createdAt,
      updatedAt: hobby.updatedAt,
    });
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description;
  }

  get trackingType(): HobbyTrackingType {
    return this.props.trackingType;
  }

  get goalTarget(): number | null {
    return this.props.goalTarget;
  }

  get goalDeadline(): Date | null {
    return this.props.goalDeadline;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toJSON(): HobbyEntityProps {
    return {
      id: this.props.id,
      tenantId: this.props.tenantId,
      name: this.props.name,
      description: this.props.description,
      trackingType: this.props.trackingType,
      goalTarget: this.props.goalTarget,
      goalDeadline: this.props.goalDeadline,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
}
