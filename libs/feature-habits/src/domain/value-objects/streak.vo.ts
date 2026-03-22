/**
 * Streak Value Object
 * Encapsulates streak calculation logic for habits
 */
export class Streak {
  private constructor(
    private readonly _current: number,
    private readonly _longest: number,
  ) {
    if (_current < 0) {
      throw new Error('Current streak cannot be negative');
    }
    if (_longest < 0) {
      throw new Error('Longest streak cannot be negative');
    }
  }

  static fromValues(current: number, longest: number): Streak {
    return new Streak(current, longest);
  }

  static initial(): Streak {
    return new Streak(0, 0);
  }

  get current(): number {
    return this._current;
  }

  get longest(): number {
    return this._longest;
  }

  /**
   * Increment the current streak by 1 day
   * Updates longest if current exceeds it
   */
  increment(): Streak {
    const newCurrent = this._current + 1;
    const newLongest = Math.max(newCurrent, this._longest);
    return new Streak(newCurrent, newLongest);
  }

  /**
   * Reset current streak to 0 (missed day)
   * Longest streak is preserved
   */
  reset(): Streak {
    return new Streak(0, this._longest);
  }

  /**
   * Update longest streak if current exceeds it
   */
  updateLongest(): Streak {
    if (this._current > this._longest) {
      return new Streak(this._current, this._current);
    }
    return this;
  }

  equals(other: Streak): boolean {
    return this._current === other._current && this._longest === other._longest;
  }

  toJSON(): { currentStreak: number; longestStreak: number } {
    return {
      currentStreak: this._current,
      longestStreak: this._longest,
    };
  }
}
