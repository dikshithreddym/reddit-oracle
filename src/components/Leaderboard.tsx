import React from 'react';
import { calculateScore } from '../../utils/scoring';

interface LeaderboardProps {
  predictions: Array<{
    id: string;
    user: string;
    subreddit: string;
    title: string;
    reason: string;
    timestamp: number;
  }>;
  topPost: {
    subreddit: string;
    title: string;
    score: number;
  } | null;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ predictions, topPost }) => {
  // Calculate scores for all predictions
  const scoredPredictions = predictions
    .map(prediction => ({
      ...prediction,
      score: topPost ? calculateScore(prediction, topPost) : 0
    }))
    .sort((a, b) => b.score - a.score);

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>Leaderboard</h2>
      
      {scoredPredictions.length === 0 ? (
        <p>No predictions yet. Be the first to make a prediction!</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Rank</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>User</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Prediction</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Subreddit Match</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Title Match</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {scoredPredictions.map((prediction, index) => {
              const exactSubreddit = prediction.subreddit.toLowerCase() === topPost?.subreddit.toLowerCase();
              const exactTitle = prediction.title.toLowerCase() === topPost?.title.toLowerCase();
              
              return (
                <tr 
                  key={prediction.id} 
                  style={{ 
                    backgroundColor: index === 0 ? '#fff3cd' : 'inherit',
                    fontWeight: index === 0 ? 'bold' : 'normal'
                  }}
                >
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{index + 1}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prediction.user}</td>
                  <td style={{ border: '1px solid #ddd', padding: '8px' }}>{prediction.title}</td>
                  <td style={{ 
                    border: '1px solid #ddd', 
                    padding: '8px',
                    color: exactSubreddit ? 'green' : 'inherit'
                  }}>
                    {exactSubreddit ? '✅' : '❌'}
                  </td>
                  <td style={{ 
                    border: '1px solid #ddd', 
                    padding: '8px',
                    color: exactTitle ? 'green' : 'inherit'
                  }}>
                    {exactTitle ? '✅' : '❌'}
                  </td>
                  <td style={{ 
                    border: '1px solid #ddd', 
                    padding: '8px',
                    fontWeight: index === 0 ? 'bold' : 'normal'
                  }}>
                    {prediction.score}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      
      {topPost && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9f7ef', borderRadius: '8px' }}>
          <h3>Final Results</h3>
          <p>Actual Top Post: r/{topPost.subreddit} - {topPost.title}</p>
          <p>Post Score: {topPost.score.toLocaleString()}</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;