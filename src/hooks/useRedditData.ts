import { useEffect, useState } from 'react';
import { RedditPost } from '../types';

// Mock data for development
const mockTopPost: RedditPost = {
  id: 't3_abc123',
  subreddit: 'memes',
  title: 'This is a sample top post title',
  score: 250000,
  created_utc: Math.floor(Date.now() / 1000) - 3600,
  author: 'RedditOracleBot',
  num_comments: 5000,
  thumbnail: 'https://via.placeholder.com/150x150',
  url: 'https://www.reddit.com/r/memes/comments/abc123/sample_post',
  is_video: false,
  num_awards: 150,
  permalink: '/r/memes/comments/abc123/sample_post'
};

// Fetch top post from r/popular
// This will use Devvit API when running inside Reddit, mock data otherwise
export const fetchTopPost = async (): Promise<RedditPost> => {
  try {
    // Try to use Devvit Reddit API if available
    // @ts-ignore - Devvit global
    if (typeof context !== 'undefined' && context?.reddit) {
      // @ts-ignore
      const topPosts = await context.reddit.getTopPosts({
        subreddit: 'popular',
        time: 'day',
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
          num_comments: post.num_comments || post.numComments,
          thumbnail: post.thumbnail || '',
          url: post.url,
          is_video: post.is_video || post.isVideo || false,
          num_awards: post.num_awards || post.numAwards || 0,
          permalink: post.permalink || ''
        };
      }
    }
    
    // Fallback to mock data
    console.log('Using mock data for Reddit top post');
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTopPost;
  } catch (error) {
    console.error('Failed to fetch top post:', error);
    return mockTopPost;
  }
};

// Get current UTC time adjusted for ET
export const getCurrentETTime = (): Date => {
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  const etOffset = -5 * 60 * 60 * 1000;
  return new Date(utcTime + etOffset);
};

// Check if it's after 6 PM ET
export const isAfterDeadline = (): boolean => {
  const etTime = getCurrentETTime();
  return etTime.getHours() >= 18;
};

// Get time until next deadline
export const getTimeUntilDeadline = (): { hours: number; minutes: number; seconds: number } => {
  const now = getCurrentETTime();
  const deadline = new Date(now);
  
  if (isAfterDeadline()) {
    deadline.setDate(deadline.getDate() + 1);
  }
  
  deadline.setHours(18, 0, 0, 0);
  const diffMs = deadline.getTime() - now.getTime();
  
  return {
    hours: Math.floor(diffMs / (1000 * 60 * 60)),
    minutes: Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diffMs % (1000 * 60)) / 1000)
  };
};