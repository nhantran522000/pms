import { ArgumentInvalidException } from '@pms/shared-kernel';

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export const MOOD_LABELS: Record<MoodValue, string> = {
  1: 'Terrible',
  2: 'Bad',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent',
} as const;

export const MOOD_EMOJIS: Record<MoodValue, string> = {
  1: '😢',
  2: '😔',
  3: '😐',
  4: '🙂',
  5: '😊',
} as const;

export class Mood {
  private constructor(private readonly _value: MoodValue) {}

  static fromNumber(value: number): Mood {
    if (!this.isValid(value)) {
      throw new ArgumentInvalidException('Mood must be between 1 and 5');
    }
    return new Mood(value as MoodValue);
  }

  static isValid(value: number): value is MoodValue {
    return Number.isInteger(value) && value >= 1 && value <= 5;
  }

  get value(): MoodValue {
    return this._value;
  }

  get label(): string {
    return MOOD_LABELS[this._value];
  }

  get emoji(): string {
    return MOOD_EMOJIS[this._value];
  }

  equals(other: Mood): boolean {
    return this._value === other._value;
  }
}
