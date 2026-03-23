import {
  WeightData,
  BloodPressureData,
  HeartRateData,
  SleepData,
  WorkoutData,
  HealthLogType,
  WeightDataSchema,
  BloodPressureDataSchema,
  HeartRateDataSchema,
  SleepDataSchema,
  WorkoutDataSchema,
} from '@pms/shared-types';

/**
 * HealthData value object - wraps JSONB data with type-specific validation
 */
export class HealthData {
  private constructor(private readonly data: Record<string, unknown>) {}

  /**
   * Create HealthData for weight measurement
   */
  static forWeight(value: number, unit: 'kg' | 'lbs'): HealthData {
    const data: WeightData = { value, unit };
    WeightDataSchema.parse(data);
    return new HealthData(data);
  }

  /**
   * Create HealthData for blood pressure measurement
   */
  static forBloodPressure(systolic: number, diastolic: number): HealthData {
    const data: BloodPressureData = { systolic, diastolic };
    BloodPressureDataSchema.parse(data);
    return new HealthData(data);
  }

  /**
   * Create HealthData for heart rate measurement
   */
  static forHeartRate(bpm: number): HealthData {
    const data: HeartRateData = { bpm };
    HeartRateDataSchema.parse(data);
    return new HealthData(data);
  }

  /**
   * Create HealthData for sleep tracking
   */
  static forSleep(durationMinutes: number, quality: number): HealthData {
    const data: SleepData = { durationMinutes, quality };
    SleepDataSchema.parse(data);
    return new HealthData(data);
  }

  /**
   * Create HealthData for workout tracking
   */
  static forWorkout(
    type: string,
    durationMinutes: number,
    intensity: 'low' | 'moderate' | 'high',
    caloriesBurned?: number,
  ): HealthData {
    const data: WorkoutData = { type, durationMinutes, intensity, caloriesBurned };
    WorkoutDataSchema.parse(data);
    return new HealthData(data);
  }

  /**
   * Create HealthData from raw JSONB data with validation
   */
  static fromJSON(type: HealthLogType, data: Record<string, unknown>): HealthData {
    switch (type) {
      case 'WEIGHT':
        WeightDataSchema.parse(data);
        break;
      case 'BLOOD_PRESSURE':
        BloodPressureDataSchema.parse(data);
        break;
      case 'HEART_RATE':
        HeartRateDataSchema.parse(data);
        break;
      case 'SLEEP':
        SleepDataSchema.parse(data);
        break;
      case 'WORKOUT':
        WorkoutDataSchema.parse(data);
        break;
      default:
        throw new Error(`Unknown health log type: ${type}`);
    }
    return new HealthData(data);
  }

  /**
   * Create HealthData without validation (for trusted data like from database)
   */
  static fromPrisma(data: Record<string, unknown>): HealthData {
    return new HealthData(data);
  }

  /**
   * Get the raw data object
   */
  toJSON(): Record<string, unknown> {
    return { ...this.data };
  }

  /**
   * Get weight value if this is weight data
   */
  getWeightValue(): number | null {
    if (typeof this.data.value === 'number') {
      return this.data.value;
    }
    return null;
  }

  /**
   * Get weight unit if this is weight data
   */
  getWeightUnit(): 'kg' | 'lbs' | null {
    if (this.data.unit === 'kg' || this.data.unit === 'lbs') {
      return this.data.unit;
    }
    return null;
  }

  /**
   * Get blood pressure values if this is blood pressure data
   */
  getBloodPressure(): { systolic: number; diastolic: number } | null {
    if (typeof this.data.systolic === 'number' && typeof this.data.diastolic === 'number') {
      return { systolic: this.data.systolic, diastolic: this.data.diastolic };
    }
    return null;
  }

  /**
   * Get heart rate value if this is heart rate data
   */
  getHeartRate(): number | null {
    if (typeof this.data.bpm === 'number') {
      return this.data.bpm;
    }
    return null;
  }

  /**
   * Get sleep data if this is sleep data
   */
  getSleepData(): { durationMinutes: number; quality: number } | null {
    if (typeof this.data.durationMinutes === 'number' && typeof this.data.quality === 'number') {
      return { durationMinutes: this.data.durationMinutes, quality: this.data.quality };
    }
    return null;
  }

  /**
   * Get workout data if this is workout data
   */
  getWorkoutData(): {
    type: string;
    durationMinutes: number;
    intensity: string;
    caloriesBurned?: number;
  } | null {
    if (
      typeof this.data.type === 'string' &&
      typeof this.data.durationMinutes === 'number' &&
      typeof this.data.intensity === 'string'
    ) {
      return {
        type: this.data.type,
        durationMinutes: this.data.durationMinutes,
        intensity: this.data.intensity,
        caloriesBurned:
          typeof this.data.caloriesBurned === 'number' ? this.data.caloriesBurned : undefined,
      };
    }
    return null;
  }
}
