import { Prediction } from './Prediction';

export interface LeaderboardEntry {
  rank: number;              // Current rank
  user: string;              // Username
  totalScore: number;        // Total accumulated score
  dailyStreak: number;       // Current streak count
  highestStreak: number;     // All-time highest streak
  lastPrediction?: number;   // Timestamp of last prediction
  predictions?: Prediction[]; // Array of user's predictions
}