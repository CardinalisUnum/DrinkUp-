// Equivalent to HydrationModels.swift

export interface HydrationEntry {
  id: string; // UUID
  timestamp: Date;
  mlAmount: number; // Calculated from AI %
  confidenceScore: number; // 0.0 - 1.0
  beforeImageId: string; // Local identifier/URL for the image
  afterImageId: string; // Local identifier/URL for the image
}

export type ActivityLevel = 'low' | 'medium' | 'high';

export interface UserSettings {
  // Biometrics
  name: string;
  dailyGoalML: number;
  containerSizeML: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  
  // Notification Preferences
  notificationsEnabled: boolean;
  reminderFrequencyMinutes: number;
  reminderStartTime: string; // "09:00"
  reminderEndTime: string; // "22:00"
}

export interface VerificationResult {
  valid: boolean;
  dropPercentage: number;
  reasoning: string;
}