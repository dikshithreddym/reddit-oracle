import { Prediction } from '../types';

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

/**
 * Calculate similarity between two strings using Levenshtein distance
 * @param s1 First string
 * @param s2 Second string
 * @returns Similarity score between 0 and 1
 */
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  if (shorter.length === 0) return 0.0;
  
  const ratio = longer.length / shorter.length;
  if (ratio > 2) return 0.0; // If one string is more than twice as long as the other
  
  // Simple case-insensitive comparison
  const lower1 = longer.toLowerCase();
  const lower2 = shorter.toLowerCase();
  
  if (lower1.includes(lower2) || lower2.includes(lower1)) {
    return 0.7; // Partial inclusion gets a decent score
  }
  
  // For now, return a basic similarity (in a real app, implement Levenshtein)
  return 0.5;
}

/**
 * Calculate score for a prediction based on accuracy
 * @param prediction User's prediction
 * @param actualPost Actual top post data
 * @returns Score in points
 */
export function calculateScore(prediction: Prediction, actualPost: any): number {
  let score = 0;
  
  // Participation points
  score += SCORES.PARTICIPATION;
  
  // Subreddit matching
  const predictedSubreddit = prediction.subreddit.toLowerCase().trim();
  const actualSubreddit = actualPost.subreddit.toLowerCase().trim();
  
  if (predictedSubreddit === actualSubreddit) {
    // Exact subreddit match
    score += SCORES.EXACT_SUBREDDIT;
  } else {
    // Check for category match (e.g., both are gaming, memes, etc.)
    const subredditCategories = {
      gaming: ['gaming', 'playstation', 'xbox', 'nintendo'],
      memes: ['memes', 'dankmemes', 'funny'],
      news: ['news', 'worldnews', 'technology'],
      science: ['science', 'space', 'physics'],
      sports: ['sports', 'nba', 'soccer'],
      // Add more categories as needed
    };
    
    // Find category match
    for (const [category, subreddits] of Object.entries(subredditCategories)) {
      if (subreddits.includes(predictedSubreddit) && 
          subreddits.includes(actualSubreddit)) {
        score += SCORES.CATEGORY_MATCH;
        break;
      }
    }
    
    // Check for partial subreddit match
    const subRedditSimilarity = similarity(predictedSubreddit, actualSubreddit);
    if (subRedditSimilarity >= PARTIAL_MATCH_THRESHOLD) {
      score += SCORES.PARTIAL_SUBREDDIT;
    }
  }
  
  // Title matching
  const predictedTitle = prediction.title.toLowerCase().trim();
  const actualTitle = actualPost.title.toLowerCase().trim();
  
  if (predictedTitle === actualTitle) {
    // Exact title match
    score += SCORES.EXACT_TITLE;
  } else {
    // Check for partial title match
    const titleSimilarity = similarity(predictedTitle, actualTitle);
    if (titleSimilarity >= PARTIAL_MATCH_THRESHOLD) {
      score += SCORES.PARTIAL_TITLE;
    }
  }
  
  // Apply streak bonus (if implemented)
  // In a real app, this would come from user state
  const streakBonus = 1.0; // 10% bonus for each consecutive day
  
  return Math.round(score * streakBonus);
}

/**
 * Get prediction accuracy breakdown
 * @param prediction User's prediction
 * @param actualPost Actual top post data
 * @returns Detailed breakdown of score components
 */
export function getScoreBreakdown(prediction: Prediction, actualPost: any) {
  // This would be implemented to show users how their score was calculated
  // For now, return a mock breakdown
  return {
    participation: SCORES.PARTICIPATION,
    subreddit: 100, // Mock value
    title: 80, // Mock value
    streakBonus: 10, // Mock value
    total: 200 // Mock total
  };
}