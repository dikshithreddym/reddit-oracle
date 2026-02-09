export interface Prediction {
  id: string;                // Unique ID for the prediction
  user: string;              // Username of the predictor
  subreddit: string;         // Predicted subreddit (e.g., "memes")
  title: string;             // Predicted post title
  reason: string;            // Reasoning for the prediction
  timestamp: number;         // Unix timestamp of prediction submission
  score?: number;            // Calculated score (optional)
}