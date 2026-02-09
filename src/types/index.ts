import { Prediction } from './Prediction';
import { LeaderboardEntry } from './Leaderboard';
import { GameStatus } from './GameStatus';
import { RedditPost } from './RedditPost';

// Export types for convenience
export type {
  Prediction,
  LeaderboardEntry,
  GameStatus,
  RedditPost
};

// Prediction type - user's submitted prediction
export interface Prediction {
  id: string;                // Unique ID for the prediction
  user: string;              // Username of the predictor
  subreddit: string;         // Predicted subreddit (e.g., "memes")
  title: string;             // Predicted post title
  reason: string;            // Reasoning for the prediction
  timestamp: number;         // Unix timestamp of prediction submission
  score?: number;            // Calculated score (optional)
}

// Leaderboard entry type
export interface LeaderboardEntry {
  rank: number;              // Current rank
  user: string;              // Username
  totalScore: number;        // Total accumulated score
  dailyStreak: number;       // Current streak count
  highestStreak: number;     // All-time highest streak
  lastPrediction?: number;   // Timestamp of last prediction
}

// Game status type
export interface GameStatus {
  isActive: boolean;         // Whether predictions are currently open
  deadline: Date;            // When predictions close (6 PM ET)
  timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  dayNumber: number;         // Day of the game (for historical tracking)
}

// Reddit post type (from API)
export interface RedditPost {
  id: string;                // Reddit post ID (t3_ format)
  subreddit: string;         // Subreddit name (e.g., "memes")
  title: string;             // Post title
  score: number;             // Upvotes/downvotes score
  created_utc: number;       // Timestamp in Unix seconds
  author: string;            // Username of the author
  num_comments: number;      // Number of comments
  thumbnail: string;         // URL to thumbnail image
  url: string;               // Link to the post
  is_video: boolean;         // Whether the post is a video
}

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