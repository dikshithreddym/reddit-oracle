import React, { useState } from 'react';
import { calculateScore } from '../utils/scoring';
import { Prediction, RedditPost } from '../types';

interface LeaderboardProps {
  predictions: Prediction[];
  topPost: RedditPost | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ predictions, topPost }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const scoredPredictions = predictions
    .map(prediction => ({
      ...prediction,
      score: topPost ? calculateScore(prediction, topPost) : 0
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  if (predictions.length === 0) {
    return (
      <div style={{
        marginTop: '20px',
        padding: '30px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '12px',
        textAlign: 'center',
        color: '#888'
      }}>
        <p style={{ fontSize: '1.2em' }}>📊</p>
        <p>No predictions yet. Be the first!</p>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}.`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#7ee787'; // Green
    if (score >= 40) return '#ffa726'; // Orange
    return '#ff5252'; // Red
  };

  return (
    <div style={{
      marginTop: '20px',
      padding: '20px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#ff4500', textAlign: 'center' }}>
        🏆 Leaderboard
      </h2>

      {scoredPredictions.map((prediction, index) => (
        <div key={prediction.id} style={{
          marginBottom: '10px',
          padding: '15px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '10px',
          border: `2px solid ${index < 3 ? 'rgba(255,215,0,0.3)' : 'transparent'}`,
        }}>
          <div 
            onClick={() => setExpandedId(expandedId === prediction.id ? null : prediction.id)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '1.5em' }}>{getRankIcon(index)}</span>
              <div>
                <div style={{ fontWeight: 'bold', color: '#fff' }}>
                  {prediction.user}
                </div>
                <div style={{ fontSize: '0.85em', color: '#aaa' }}>
                  r/{prediction.subreddit}
                </div>
              </div>
            </div>
            <div style={{
              fontSize: '1.3em',
              fontWeight: 'bold',
              color: getScoreColor(prediction.score || 0)
            }}>
              {prediction.score} pts
            </div>
          </div>

          {expandedId === prediction.id && (
            <div style={{
              marginTop: '15px',
              paddingTop: '15px',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              color: '#ccc'
            }}>
              <p style={{ marginBottom: '10px' }}>
                <strong style={{ color: '#ff9800' }}>"{prediction.title}"</strong>
              </p>
              <p style={{ fontSize: '0.9em', fontStyle: 'italic', marginBottom: '10px' }}>
                💭 "{prediction.reason}"
              </p>
              {topPost && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  fontSize: '0.85em'
                }}>
                  <p>✅ Predicted: <strong>r/{prediction.subreddit}</strong></p>
                  {topPost.subreddit.toLowerCase() === prediction.subreddit.toLowerCase() ? (
                    <p style={{ color: '#7ee787' }}>🎯 Correct subreddit! +{prediction.score} points</p>
                  ) : (
                    <p style={{ color: '#ff5252' }}>
                      ❌ Was r/{topPost.subreddit}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <div style={{ 
        marginTop: '15px', 
        textAlign: 'center',
        fontSize: '0.8em',
        color: '#666'
      }}>
        Click any entry to see details
      </div>
    </div>
  );
};

export default Leaderboard;