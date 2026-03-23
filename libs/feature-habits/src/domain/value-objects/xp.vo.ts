import { Level } from './level.vo';

/**
 * XP Value Object for gamification
 * Handles experience points calculations and level progression
 */
export class XP {
  private constructor(private readonly amount: number) {
    if (amount < 0) throw new Error('XP cannot be negative');
  }

  static fromNumber(value: number): XP {
    return new XP(value);
  }

  get value(): number {
    return this.amount;
  }

  add(other: XP): XP {
    return new XP(this.amount + other.amount);
  }

  toLevel(): Level {
    return Level.fromXP(this);
  }

  xpRequiredForNextLevel(): number {
    const currentLevel = this.toLevel();
    return currentLevel.xpRequiredForNext();
  }

  progressToNextLevel(): number {
    const currentLevel = this.toLevel();
    const currentLevelXP = currentLevel.xpRequired();
    const nextLevelXP = currentLevel.xpRequiredForNext();
    const progress = this.amount - currentLevelXP;
    const needed = nextLevelXP - currentLevelXP;
    return Math.min(100, Math.max(0, (progress / needed) * 100));
  }

  toString(): string {
    return this.amount.toString();
  }
}
