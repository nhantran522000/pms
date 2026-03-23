import { XP } from './xp.vo';

/**
 * Level Value Object for gamification
 * Uses formula: level = floor(sqrt(totalXP / 25)) + 1
 */
export class Level {
  private constructor(private readonly level: number) {
    if (level < 1) throw new Error('Level must be at least 1');
  }

  /**
   * Calculate level from XP using formula: level = floor(sqrt(totalXP / 25)) + 1
   */
  static fromXP(xp: XP): Level {
    const level = Math.floor(Math.sqrt(xp.value / 25)) + 1;
    return new Level(level);
  }

  static fromNumber(level: number): Level {
    return new Level(level);
  }

  get value(): number {
    return this.level;
  }

  /**
   * XP required to reach this level
   * Inverse of level formula: XP = (level - 1)^2 * 25
   */
  xpRequired(): number {
    return Math.pow(this.level - 1, 2) * 25;
  }

  /**
   * XP required to reach next level
   */
  xpRequiredForNext(): number {
    return Math.pow(this.level, 2) * 25;
  }

  xpToNextLevel(currentXP: XP): number {
    return this.xpRequiredForNext() - currentXP.value;
  }

  isLevelUp(newXP: XP): boolean {
    return Level.fromXP(newXP).value > this.level;
  }

  toString(): string {
    return this.level.toString();
  }
}
