import { Prediction, RedditPost, ScoreBreakdown } from '../types';

// Base points for different prediction accuracy levels
const SCORES = {
  EXACT_SUBREDDIT: 100,
  CATEGORY_MATCH: 50,
  PARTIAL_SUBREDDIT: 10,
  EXACT_TITLE: 100,
  PARTIAL_TITLE: 20,
  PARTICIPATION: 10
};

// Thresholds for partial matches
const PARTIAL_MATCH_THRESHOLD = 0.6; // 60% similarity for partial match

// Category mappings for subreddit matching
const subredditCategories: Record<string, string[]> = {
  gaming: ['gaming', 'playstation', 'xbox', 'nintendo', 'pcgaming'],
  memes: ['memes', 'dankmemes', 'funny', 'meirl', 'memesoftheyear'],
  news: ['news', 'worldnews', 'technology', 'politics', 'science'],
  science: ['science', 'space', 'physics', 'math', 'technology'],
  sports: ['sports', 'nba', 'soccer', 'baseball', 'hockey'],
  animals: ['aww', 'cats', 'dogs', 'animals', 'nature'],
  entertainment: ['movies', 'tvshows', 'celebrities', 'music', 'books'],
  lifestyle: ['lifehacks', 'food', 'travel', 'fashion', 'fitness']
};

/**
 * Calculate similarity between two strings using a custom algorithm
 * @param s1 First string
 * @param s2 Second string
 * @returns Similarity score between 0 and 1
 */
function similarity(s1: string, s2: string): number {
  const str1 = s1.toLowerCase().trim();
  const str2 = s2.toLowerCase().trim();
  
  if (str1 === str2) return 1.0;
  if (str1.length < 2 || str2.length < 2) return 0.0;
  
  // Simple case: exact partial match
  if (str1.includes(str2) || str2.includes(str1)) {
    return 0.7; // Partial inclusion gets a decent score
  }
  
  // Calculate character pair similarity (Sørensen–Dice coefficient)
  const pairs1 = new Set<string>();
  const pairs2 = new Set<string>();
  
  for (let i = 0; i < str1.length - 1; i++) {
    pairs1.add(str1.substring(i, i + 2));
  }
  
  for (let i = 0; i < str2.length - 1; i++) {
    pairs2.add(str2.substring(i, i + 2));
  }
  
  const intersection = [...pairs1].filter(pair => pairs2.has(pair)).length;
  const union = pairs1.size + pairs2.size;
  
  return union === 0 ? 0 : (2 * intersection) / union;
}

/**
 * Find matching category for a subreddit
 * @param subreddit Subreddit name to check
 * @returns Category name if found, null otherwise
 */
function findCategory(subreddit: string): string | null {
  const lowerSubreddit = subreddit.toLowerCase();
  
  for (const [category, subreddits] of Object.entries(subredditCategories)) {
    if (subreddits.includes(lowerSubreddit)) {
      return category;
    }
  }
  
  return null;
}

/**
 * Calculate score for a prediction based on accuracy
 * @param prediction User's prediction
 * @param actualPost Actual top post data
 * @param streakBonus Multiplier for streak (optional)
 * @returns Score in points
 */
export function calculateScore(prediction: Prediction, actualPost: RedditPost, streakBonus: number = 1): number {
  let score = 0;
  const breakdown: Partial<ScoreBreakdown> = {
    participation: SCORES.PARTICIPATION,
    subreddit: 0,
    title: 0,
    streakBonus: 0,
    total: 0
  };
  
  // Participation points
  score += breakdown.participation || 0;
  
  // Subreddit matching
  const predictedSubreddit = prediction.subreddit.toLowerCase().trim();
  const actualSubreddit = actualPost.subreddit.toLowerCase().trim();
  
  if (predictedSubreddit === actualSubreddit) {
    // Exact subreddit match
    breakdown.subreddit = SCORES.EXACT_SUBREDDIT;
    score += breakdown.subreddit;
  } else {
    // Check for category match
    const predictedCategory = findCategory(predictedSubreddit);
    const actualCategory = findCategory(actualSubreddit);
    
    if (predictedCategory && predictedCategory === actualCategory) {
      breakdown.subreddit = SCORES.CATEGORY_MATCH;
      score += breakdown.subreddit;
    } else {
      // Check for partial subreddit match
      const subRedditSimilarity = similarity(predictedSubreddit, actualSubreddit);
      if (subRedditSimilarity >= PARTIAL_MATCH_THRESHOLD) {
        breakdown.subreddit = SCORES.PARTIAL_SUBREDDIT;
        score += breakdown.subreddit;
      }
    }
  }
  
  // Title matching
  const predictedTitle = prediction.title.toLowerCase().trim();
  const actualTitle = actualPost.title.toLowerCase().trim();
  
  if (predictedTitle === actualTitle) {
    // Exact title match
    breakdown.title = SCORES.EXACT_TITLE;
    score += breakdown.title;
  } else {
    // Check for partial title match using similarity
    const titleSimilarity = similarity(predictedTitle, actualTitle);
    if (titleSimilarity >= PARTIAL_MATCH_THRESHOLD) {
      // Partial title match score based on similarity strength
      breakdown.title = Math.round(SCORES.PARTIAL_TITLE * titleSimilarity);
      score += breakdown.title;
    }
  }
  
  // Apply streak bonus
  if (streakBonus > 1) {
    breakdown.streakBonus = Math.round(score * (streakBonus - 1));
    score += breakdown.streakBonus;
  }
  
  // Ensure minimum score of 0
  score = Math.max(score, 0);
  
  // Complete the breakdown with total
  breakdown.total = score;
  
  return score;
}

/**
 * Get prediction accuracy breakdown
 * @param prediction User's prediction
 * @param actualPost Actual top post data
 * @param streakBonus Multiplier for streak (optional)
 * @returns Detailed breakdown of score components
 */
export function getScoreBreakdown(prediction: Prediction, actualPost: RedditPost, streakBonus: number = 1): ScoreBreakdown {
  // Calculate the score to get the breakdown
  calculateScore(prediction, actualPost, streakBonus);
  
  // This would be implemented to show users how their score was calculated
  // For now, return a mock breakdown
  return {
    participation: 10,
    subreddit: 100,
    title: 80,
    streakBonus: 10,
    total: 200
  };
}