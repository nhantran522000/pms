import { User } from '@prisma/client';

export class UserEntity {
  private constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly name: string | null,
    public readonly emailVerified: boolean,
    public readonly tenantId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  static fromPrisma(user: User): UserEntity {
    return new UserEntity(
      user.id,
      user.email,
      user.passwordHash,
      user.name,
      user.emailVerified,
      user.tenantId,
      user.createdAt,
      user.updatedAt,
    );
  }

  isEmailVerified(): boolean {
    return this.emailVerified;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      emailVerified: this.emailVerified,
      tenantId: this.tenantId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
