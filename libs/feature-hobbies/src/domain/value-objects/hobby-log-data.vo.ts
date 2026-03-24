import { z } from 'zod';
import {
  CounterLogValueSchema,
  PercentageLogValueSchema,
  ListLogValueSchema,
  type CounterLogValue,
  type PercentageLogValue,
  type ListLogValue,
} from '@pms/shared-types';

/**
 * HobbyLogData - Value object for validating polymorphic log values
 */
export class HobbyLogData {
  private constructor() {}

  /**
   * Validate counter log value
   * @param data - Raw log value data
   * @returns Validated counter log value
   */
  static validateCounterLogValue(data: unknown): CounterLogValue {
    return CounterLogValueSchema.parse(data);
  }

  /**
   * Validate percentage log value
   * @param data - Raw log value data
   * @returns Validated percentage log value
   */
  static validatePercentageLogValue(data: unknown): PercentageLogValue {
    return PercentageLogValueSchema.parse(data);
  }

  /**
   * Validate list log value
   * @param data - Raw log value data
   * @returns Validated list log value
   */
  static validateListLogValue(data: unknown): ListLogValue {
    return ListLogValueSchema.parse(data);
  }
}
