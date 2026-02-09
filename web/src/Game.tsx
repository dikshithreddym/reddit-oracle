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
  const [deadlineInfo, setDeadlineInfo] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isPredictionOpen, setIsPredictionOpen] = useState(true);
  const [user, setUser] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadRedditData = async () => {
      try {
        const data = await fetchTopPost();
        setTopPost(data);
        setError(null);
      } catch (err) {
        setError("Failed to load today's top post. Using mock data for demonstration.");
        console.error('Failed to fetch Reddit data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRedditData();

    const checkDeadline = () => {
      const isAfter = isAfterDeadline();
      setIsPredictionOpen(!isAfter);
      setDeadlineInfo(getTimeUntilDeadline());
      return isAfter;
    };

    checkDeadline();
    const timerId = setInterval(checkDeadline, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleSubmitPrediction = (predictionData: { user: string; subreddit: string; title: string; reason: string }) => {
    if (!user.trim()) {
      setError('Please enter a username before submitting a prediction.');
      return;
    }
    if (!topPost) {
      setError('Cannot submit prediction: No top post data available.');
      return;
    }

    const score = topPost ? calculateScore(predictionData as Prediction, topPost) : 0;
    
    const newPrediction: Prediction = {
      ...predictionData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      user: user.trim(),
      score
    };

    setPredictions([newPrediction, ...predictions]);
    setSuccessMessage(score > 0 ? `Success! Your prediction earned ${score} points.` : 'Submitted! Check back later to see your score.');
    setError(null);
  };

  const dismissSuccess = () => setSuccessMessage(null);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1 style={{ color: '#ff4500', marginBottom: '5px' }}>Reddit Oracle</h1>
      <p style={{ fontSize: '1.1em', marginBottom: '20px' }}>Predict today's #1 post on r/popular</p>
      
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}
      
      {successMessage && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '20px' }}>
          {successMessage}
          <button onClick={dismissSuccess} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}

      <StreakCounter userId={user || 'anonymous'} />

      {isPredictionOpen ? (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e9f7ef', borderRadius: '8px' }}>
          <strong>Predictions close in:</strong> {deadlineInfo.hours}h {deadlineInfo.minutes}m {deadlineInfo.seconds}s
        </div>
      ) : (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', borderRadius: '8px' }}>
          <strong>Predictions closed!</strong> Results will be announced tomorrow.
        </div>
      )}

      <PredictionForm onSubmit={handleSubmitPrediction} onUserChange={setUser} disabled={!isPredictionOpen} />
      <Leaderboard predictions={predictions} topPost={topPost} />

      {loading && <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}><p>Loading...</p></div>}
      
      {!loading && topPost && (
        <div style={{ marginTop: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Today's Top Post:</h3>
          <p><strong>Subreddit:</strong> r/{topPost.subreddit}</p>
          <p><strong>Title:</strong> {topPost.title}</p>
          <p><strong>Score:</strong> {topPost.score.toLocaleString()}</p>
          <p><strong>Comments:</strong> {topPost.num_comments.toLocaleString()}</p>
          <a href={topPost.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '10px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>View Post</a>
        </div>
      )}
    </div>
  );
};

export default Game;