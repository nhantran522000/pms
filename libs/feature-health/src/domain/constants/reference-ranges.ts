/**
 * Reference ranges for health metrics
 * Stored in code constants for easier updates without migrations
 */

export const HEALTH_REFERENCE_RANGES = {
  bloodPressure: {
    systolic: {
    low: 90,
    normal: { min: 90, max: 120 },
    elevated: { min: 120, max: 130 },
    high: 130,
  },
  diastolic: {
    low: 60,
    normal: { min: 60, max: 80 },
    high: 80,
  },
  },
  heartRate: {
    resting: {
    low: 60,
    normal: { min: 60, max: 100 },
    high: 100,
    },
  },
  sleep: {
    recommended: {
    adult: { minHours: 7, maxHours: 9 },
    },
  },
} as const;

export type BloodPressureCategory = 'low' | 'normal' | 'elevated' | 'high';
export type HeartRateCategory = 'low' | 'normal' | 'high';

/**
 * Categorize blood pressure based on systolic and diastolic values
 */
export function getBloodPressureCategory(
  systolic: number,
  diastolic: number,
): BloodPressureCategory {
  if (systolic < 90 || diastolic < 60) {
    return 'low';
  }
  if (systolic <= 120 && diastolic <= 80) {
    return 'normal';
  }
  if (systolic <= 130 && diastolic <= 80) {
    return 'elevated';
  }
  return 'high';
}

/**
 * Categorize heart rate based on bpm value
 */
export function getHeartRateCategory(bpm: number): HeartRateCategory {
  if (bpm < 60) {
    return 'low';
  }
  if (bpm <= 100) {
    return 'normal';
  }
  return 'high';
}
