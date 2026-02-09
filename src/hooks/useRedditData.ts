import { useEffect, useState } from 'react';

// Mock data for development
const mockTopPost = {
  id: 't3_abc123',
  subreddit: 'memes',
  title: 'This is a sample top post title',
  score: 250000,
  created_utc: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
  author: 'RedditOracleBot',
  num_comments: 5000,
  thumbnail: 'https://via.placeholder.com/150x150',
  url: 'https://www.reddit.com/r/memes/comments/abc123/sample_post',
  is_video: false,
  num_awards: 150,
  permalink: '/r/memes/comments/abc123/sample_post'
};

// In development, we'll use mock data
// In production, this would be replaced with actual API calls
export const fetchTopPost = async () => {
  try {
    // Check if we're running in a Devvit environment with Reddit API access
    if (typeof context !== 'undefined' && context?.reddit) {
      // Use Devvit's built-in Reddit client
      const topPosts = await context.reddit.getTopPosts({
        subreddit: 'popular',
        timeFilter: 'DAY',
        limit: 1
      });
      
      if (topPosts && topPosts.length > 0) {
        const post = topPosts[0];
        return {
          id: post.id,
          subreddit: post.subreddit,
          title: post.title,
          score: post.score,
          created_utc: post.created,
          author: post.author,
          num_comments: post.numComments,
          thumbnail: post.thumbnail || '',
          url: post.url,
          is_video: post.isVideo || false,
          num_awards: post.numAwards || 0,
          permalink: post.permalink || ''
        };
      }
    }
    
    // Fallback to mock data if not in Devvit environment
    console.log('Fetching top post (mock data)');
    return new Promise<typeof mockTopPost>((resolve) => {
      setTimeout(() => {
        resolve(mockTopPost);
      }, 500);
    });
  } catch (error) {
    console.error('Failed to fetch top post from Reddit:', error);
    
    // Return mock data if there's an error
    console.log('Returning mock data due to error');
    return mockTopPost;
  }
};

// Get current UTC time adjusted for ET (Reddit uses UTC)
export const getCurrentETTime = () => {
  const now = new Date();
  // Convert to UTC time
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  // ET is UTC-5 (or UTC-4 during daylight saving)
  const etOffset = -5 * 60 * 60 * 1000; // Default to UTC-5
  return new Date(utcTime + etOffset);
};

// Check if it's after 6 PM ET (when predictions close)
export const isAfterDeadline = () => {
  const now = getCurrentETTime();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Deadline is 6:00 PM ET
  return hours >= 18;
};

// Get time until next deadline
export const getTimeUntilDeadline = () => {
  const now = getCurrentETTime();
  const deadline = new Date(now);
  
  // If after today's deadline, set for tomorrow
  if (isAfterDeadline()) {
    deadline.setDate(deadline.getDate() + 1);
  }
  
  // Set time to 18:00:00 ET
  deadline.setHours(18, 0, 0, 0);
  
  const diffMs = deadline.getTime() - now.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds };
};