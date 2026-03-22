import * as bcrypt from 'bcrypt';
import zxcvbn from 'zxcvbn';

export interface PasswordValidationResult {
  valid: boolean;
  score: number;
  warnings: string[];
  suggestions: string[];
}

export class Password {
  private constructor(private readonly hashedPassword: string) {}

  static async create(plainPassword: string): Promise<Password> {
    const validation = Password.validate(plainPassword);
    if (!validation.valid) {
      throw new Error(`Password validation failed: ${validation.warnings.join(', ')}`);
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    return new Password(hashedPassword);
  }

  static fromHash(hashedPassword: string): Password {
    return new Password(hashedPassword);
  }

  static validate(password: string): PasswordValidationResult {
    const result = zxcvbn(password);

    // Per CONTEXT.md: Zxcvbn score 3+ required
    const valid = result.score >= 3;
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (result.feedback.warning) {
      warnings.push(result.feedback.warning);
    }
    if (result.feedback.suggestions) {
      suggestions.push(...result.feedback.suggestions);
    }

    // Additional basic checks
    if (password.length < 8) {
      warnings.push('Password must be at least 8 characters');
    }

    return {
      valid,
      score: result.score,
      warnings,
      suggestions,
    };
  }

  get hash(): string {
    return this.hashedPassword;
  }

  async compare(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.hashedPassword);
  }
}
