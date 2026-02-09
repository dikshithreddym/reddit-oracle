import React, { useState, useEffect } from 'react';
import PredictionForm from './PredictionForm';
import Leaderboard from './Leaderboard';
import StreakCounter from './StreakCounter';
import { fetchTopPost } from '../hooks/useRedditData';
import { calculateScore } from '../utils/scoring';

interface Prediction {
  id: string;
  user: string;
  subreddit: string;
  title: string;
  reason: string;
  timestamp: number;
}

const Game: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [topPost, setTopPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch today's top post from r/popular
    const loadRedditData = async () => {
      try {
        const data = await fetchTopPost();
        setTopPost(data);
      } catch (error) {
        console.error('Failed to fetch Reddit data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRedditData();
  }, []);

  const handleSubmitPrediction = (prediction: Omit<Prediction, 'id' | 'timestamp'>) => {
    const newPrediction = {
      ...prediction,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    
    // Calculate score if results are available
    if (topPost) {
      const score = calculateScore(newPrediction, topPost);
      console.log(`Prediction score: ${score} points`);
    }

    setPredictions([newPrediction, ...predictions]);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Reddit Oracle</h1>
      <p>Predict today's #1 post on r/popular</p>
      
      <StreakCounter />
      
      <PredictionForm onSubmit={handleSubmitPrediction} />
      
      <Leaderboard predictions={predictions} topPost={topPost} />
      
      {loading && <p>Loading latest Reddit data...</p>}
      
      {topPost && (
        <div style={{ marginTop: '30px' }}>
          <h3>Today's Top Post:</h3>
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <p>Subreddit: r/{topPost.subreddit}</p>
            <p>Title: {topPost.title}</p>
            <p>Score: {topPost.score.toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;