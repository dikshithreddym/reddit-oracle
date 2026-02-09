import React, { useState, useEffect } from 'react';
import PredictionForm from './PredictionForm';
import Leaderboard from './Leaderboard';
import StreakCounter from './StreakCounter';
import { fetchTopPost, isAfterDeadline, getTimeUntilDeadline } from '../hooks/useRedditData';
import { calculateScore } from '../utils/scoring';
import { Prediction, RedditPost } from '../types';

const Game: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [topPost, setTopPost] = useState<RedditPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [deadlineInfo, setDeadlineInfo] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isPredictionOpen, setIsPredictionOpen] = useState(true);
  const [user, setUser] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Fetch today's top post from r/popular
    const loadRedditData = async () => {
      try {
        const data = await fetchTopPost();
        setTopPost(data);
        setError(null);
      } catch (err) {
        setError('Failed to load today's top post. Using mock data for demonstration.');
        console.error('Failed to fetch Reddit data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Load initial data
    loadRedditData();
    
    // Set up deadline timer
    const checkDeadline = () => {
      const isAfter = isAfterDeadline();
      setIsPredictionOpen(!isAfter);
      setDeadlineInfo(getTimeUntilDeadline());
      return isAfter;
    };
    
    // Initial check
    checkDeadline();
    
    // Update countdown every second
    const timerId = setInterval(checkDeadline, 1000);
    
    // Clean up timer
    return () => clearInterval(timerId);
  }, []);

  const handleSubmitPrediction = (prediction: Omit<Prediction, 'id' | 'timestamp'>) => {
    if (!user.trim()) {
      setError('Please enter a username before submitting a prediction.');
      return;
    }

    if (!topPost) {
      setError('Cannot submit prediction: No top post data available.');
      return;
    }

    // Create new prediction with ID and timestamp
    const newPrediction = {
      ...prediction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      user: user.trim()
    };
    
    // Calculate score if results are available
    let score = 0;
    if (topPost) {
      score = calculateScore(newPrediction, topPost);
      newPrediction.score = score;
      console.log(`Prediction score: ${score} points`);
    }

    // Update predictions list
    setPredictions([newPrediction, ...predictions]);
    
    // Show success message
    setSuccessMessage(score > 0 ? 
      `Success! Your prediction earned ${score} points.` : 
      'Submitted! Check back later to see your score.');
    
    // Clear error messages
    setError(null);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#ff4500', marginBottom: '5px' }}>Reddit Oracle</h1>
      <p style={{ fontSize: '1.1em', marginBottom: '20px' }}>Predict today's #1 post on r/popular</p>
      
      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8d7da',
          color: '#721c24',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {successMessage}
          <button 
            onClick={() => setSuccessMessage(null)}
            style={{
              marginLeft: '10px',
              padding: '3px 8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#155724',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      <StreakCounter userId={user || 'anonymous'} />
      
      {isPredictionOpen ? (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e9f7ef', borderRadius: '8px' }}>
          <p style={{ margin: '0', fontSize: '1.1em' }}>
            <strong>Predictions close in:</strong> 
            {deadlineInfo.hours}h {deadlineInfo.minutes}m {deadlineInfo.seconds}s
          </p>
        </div>
      ) : (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px', color: '#721c24' }}>
          <p style={{ margin: '0', fontSize: '1.1em' }}>
            <strong>Predictions closed!</strong> Results will be announced tomorrow.
          </p>
        </div>
      )}
      
      <PredictionForm 
        onSubmit={handleSubmitPrediction} 
        onUserChange={setUser}
        disabled={!isPredictionOpen}
      />
      
      <Leaderboard predictions={predictions} topPost={topPost} />
      
      {loading && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <p>Loading latest Reddit data...</p>
        </div>
      )}
      
      {!loading && topPost && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3 style={{ marginTop: '0' }}>Today's Top Post:</h3>
          <div style={{ padding: '10px' }}>
            <p><strong>Subreddit:</strong> r/{topPost.subreddit}</p>
            <p><strong>Title:</strong> {topPost.title}</p>
            <p><strong>Score:</strong> {topPost.score.toLocaleString()}</p>
            <p><strong>Comments:</strong> {topPost.num_comments.toLocaleString()}</p>
            <a 
              href={topPost.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                display: 'inline-block', 
                marginTop: '10px',
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '4px'
              }}
            >
              View Post
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;