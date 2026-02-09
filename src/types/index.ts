// Re-export types from individual files
export type { Prediction } from './Prediction';
export type { LeaderboardEntry } from './Leaderboard';
export type { GameStatus } from './GameStatus';
export type { RedditPost } from './RedditPost';

// Score breakdown type
export interface ScoreBreakdown {
  participation: number;     // Points from participation
  subreddit: number;         // Points from subreddit accuracy
  title: number;             // Points from title accuracy
  streakBonus: number;       // Points from streak bonus
  total: number;             // Total score
}

// Prediction form submission type
export interface PredictionSubmission {
  subreddit: string;
  title: string;
  reason: string;
}

// Game statistics type
export interface GameStatistics {
  totalPredictions: number;
  uniqueParticipants: number;
  averageAccuracy: number;
  topPredictionRate: number;
  streakDistribution: Record<string, number>;
  trendingSubreddits: Record<string, number>;
}