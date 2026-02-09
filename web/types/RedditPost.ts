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
  num_awards: number;        // Number of awards received
  permalink: string;         // Relative URL to the post
}