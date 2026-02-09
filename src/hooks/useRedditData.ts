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
  is_video: false
};

// In development, we'll use mock data
// In production, this would be replaced with actual API calls
export const fetchTopPost = async () => {
  // This is a placeholder for the actual Reddit API integration
  // When we have access to the Reddit API via Devvit, we'll use:
  /*
  const response = await fetch('https://oauth.reddit.com/r/popular/top?sort=top&t=day', {
    headers: {
      'Authorization': `bearer ${REDDIT_ACCESS_TOKEN}`,
      'User-Agent': 'RedditOracleBot/1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch top post from Reddit');
  }
  
  const data = await response.json();
  // Process and return the top post data
  */
  
  // For now, return mock data
  console.log('Fetching top post (mock data)');
  return new Promise<typeof mockTopPost>((resolve) => {
    setTimeout(() => {
      resolve(mockTopPost);
    }, 500);
  });
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
  return hours >= 18 && minutes >= 0;
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
  
  return { hours, minutes, seconds, deadline };
};