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
  const [subredditFilter, setSubredditFilter] = useState('all');

  useEffect(() => {
    const loadRedditData = async () => {
      try {
        const data = await fetchTopPost();
        setTopPost(data);
        setError(null);
      } catch (err) {
        setError("Using demo data. Live Reddit data unavailable.");
      } finally {
        setLoading(false);
      }
    };

    loadRedditData();

    const checkDeadline = () => {
      const isAfter = isAfterDeadline();
      setIsPredictionOpen(!isAfter);
      setDeadlineInfo(getTimeUntilDeadline());
    };

    checkDeadline();
    const timerId = setInterval(checkDeadline, 1000);
    return () => clearInterval(timerId);
  }, []);

  const handleSubmitPrediction = (predictionData: { user: string; subreddit: string; title: string; reason: string }) => {
    if (!user.trim()) {
      setError('Please enter a username before submitting.');
      return;
    }
    if (!topPost) {
      setError('Cannot submit: No top post data available.');
      return;
    }

    const score = calculateScore(predictionData as Prediction, topPost);
    
    const newPrediction: Prediction = {
      ...predictionData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      user: user.trim(),
      score
    };

    setPredictions([newPrediction, ...predictions]);
    setSuccessMessage(score > 0 ? `🎉 You earned ${score} points!` : '✅ Submitted! Check back for results.');
    setError(null);
  };

  const dismissMessages = () => {
    setSuccessMessage(null);
    setError(null);
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
  };

  const titleStyle: React.CSSProperties = {
    color: '#ff4500',
    fontSize: '2em',
    marginBottom: '5px',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#aaa',
    fontSize: '1.1em',
  };

  const alertStyle = (type: 'error' | 'success'): React.CSSProperties => ({
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: type === 'error' ? '#ffebee' : '#e8f5e9',
    color: type === 'error' ? '#c62828' : '#2e7d32',
    border: `1px solid ${type === 'error' ? '#ef9a9a' : '#a5d6a7'}`,
  });

  const timerBoxStyle: React.CSSProperties = {
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    backgroundColor: isPredictionOpen ? '#1b5e20' : '#b71c1c',
    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
  };

  const timerDigitStyle: React.CSSProperties = {
    fontSize: '1.8em',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  };

  const postPreviewStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '15px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  const linkStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#ff4500',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '500',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>🔮 Reddit Oracle 🔮</h1>
        <p style={subtitleStyle}>Predict today's #1 post on r/popular</p>
      </div>

      {error && (
        <div style={alertStyle('error')}>
          <span>⚠️ {error}</span>
          <button onClick={dismissMessages} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}>×</button>
        </div>
      )}

      {successMessage && (
        <div style={alertStyle('success')}>
          <span>{successMessage}</span>
          <button onClick={dismissMessages} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2em' }}>×</button>
        </div>
      )}

      <StreakCounter userId={user || 'anonymous'} />

      <div style={timerBoxStyle}>
        {isPredictionOpen ? (
          <>
            <p style={{ marginBottom: '10px', fontSize: '0.9em', opacity: 0.9 }}>⏰ Predictions close in:</p>
            <div style={timerDigitStyle}>
              {String(deadlineInfo.hours).padStart(2, '0')}:
              {String(deadlineInfo.minutes).padStart(2, '0')}:
              {String(deadlineInfo.seconds).padStart(2, '0')}
            </div>
          </>
        ) : (
          <>
            <p style={{ marginBottom: '10px', fontSize: '1.1em' }}>🔒 Predictions CLOSED</p>
            <p style={{ fontSize: '0.9em', opacity: 0.9 }}>Come back tomorrow!</p>
          </>
        )}
      </div>

      <PredictionForm onSubmit={handleSubmitPrediction} onUserChange={setUser} disabled={!isPredictionOpen} />
      
      <Leaderboard predictions={predictions} topPost={topPost} />

      {loading && (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <p>🔄 Loading Reddit data...</p>
        </div>
      )}

      {!loading && topPost && (
        <div style={postPreviewStyle}>
          <h3 style={{ marginBottom: '15px', color: '#ff4500' }}>📊 Current Top Post</h3>
          <p><strong>r/{topPost.subreddit}</strong></p>
          <p style={{ marginTop: '8px', lineHeight: 1.5 }}>{topPost.title}</p>
          <p style={{ marginTop: '10px', color: '#aaa', fontSize: '0.9em' }}>
            ⬆️ {topPost.score.toLocaleString()} | 💬 {topPost.num_comments.toLocaleString()}
          </p>
          <a href={topPost.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
            View on Reddit
          </a>
        </div>
      )}

      <div style={{ marginTop: '30px', textAlign: 'center', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.8em', color: '#666' }}>
          🏆 Reddit Daily Games 2026 Hackathon Entry
        </p>
      </div>
    </div>
  );
};

export default Game;