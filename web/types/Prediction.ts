export interface Prediction {
  id: string;
  user: string;
  subreddit: string;
  title: string;
  reason: string;
  timestamp: number;
  score?: number;
}

export interface PredictionSubmission {
  user: string;
  subreddit: string;
  title: string;
  reason: string;
}