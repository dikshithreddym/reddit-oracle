import React from 'react';
import { calculateScore } from '../utils/scoring';
import { Prediction, RedditPost } from '../types';

interface LeaderboardProps {
  predictions: Prediction[];
  topPost: RedditPost | null;
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
      <h2 style={{ marginBottom: '15px' }}>Leaderboard</h2>
      
      {scoredPredictions.length === 0 ? (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e9ecef',
          borderRadius: '4px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0' }}>No predictions yet. Be the first to make a prediction!</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Rank</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>User</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Prediction</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'right' }}>Score</th>
              <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {scoredPredictions.map((prediction, index) => {
              const exactSubreddit = topPost && prediction.subreddit.toLowerCase() === topPost.subreddit.toLowerCase();
              const exactTitle = topPost && prediction.title.toLowerCase() === topPost.title.toLowerCase();
              
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
                    fontWeight: index === 0 ? 'bold' : 'normal',
                    textAlign: 'right'
                  }}>
                    {prediction.score}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                    <details style={{ fontSize: '0.9em' }}>
                      <summary style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '4px', backgroundColor: '#f8f9fa' }}>View Details</summary>
                      <div style={{ marginTop: '10px', paddingLeft: '10px', borderLeft: '2px solid #ddd' }}>
                        <p style={{ margin: '5px 0' }}><strong>Subreddit:</strong> {prediction.subreddit}</p>
                        <p style={{ margin: '5px 0' }}><strong>Reasoning:</strong> {prediction.reason}</p>
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                          <span style={{ color: exactSubreddit ? '#28a745' : '#6c757d' }}>
                            {exactSubreddit ? '✅' : '❌'} Subreddit Match
                          </span>
                          <span style={{ color: exactTitle ? '#28a745' : '#6c757d' }}>
                            {exactTitle ? '✅' : '❌'} Title Match
                          </span>
                        </div>
                      </div>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      
      {topPost && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#e9f7ef', 
          borderRadius: '8px',
          border: '1px solid #d4edda'
        }}>
          <h3 style={{ marginTop: '0' }}>Final Results</h3>
          <p style={{ margin: '5px 0' }}>Actual Top Post: r/{topPost.subreddit} - {topPost.title}</p>
          <p style={{ margin: '5px 0' }}>Post Score: {topPost.score.toLocaleString()}</p>
          <a 
            href={topPost.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ 
              display: 'inline-block', 
              marginTop: '10px',
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '0.9em'
            }}
          >
            View Winning Post
          </a>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;