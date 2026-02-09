import React, { useState, useEffect } from 'react';
import { Prediction } from '../types';

interface StreakCounterProps {
  userId: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ userId }) => {
  const [streak, setStreak] = useState<number>(0);
  const [lastPredictionDate, setLastPredictionDate] = useState<string | null>(null);
  const [bonusMultiplier, setBonusMultiplier] = useState<number>(1);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [predictionHistory, setPredictionHistory] = useState<Record<string, number>>({
    '2026-02-04': 85,
    '2026-02-05': 120,
    '2026-02-06': 95,
    '2026-02-07': 110,
    '2026-02-08': 90
  });

  useEffect(() => {
    const mockStreak = 3;
    const mockLastPrediction = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    setStreak(mockStreak);
    setLastPredictionDate(mockLastPrediction);
    setBonusMultiplier(1 + (mockStreak * 0.1));
  }, []);

  const handlePredictionSubmitted = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const predictedYesterday = lastPredictionDate && 
      new Date(lastPredictionDate) >= yesterday && 
      new Date(lastPredictionDate) < today;

    let newStreak = predictedYesterday ? streak + 1 : 1;
    setStreak(newStreak);
    setLastPredictionDate(today.toISOString());
    setBonusMultiplier(1 + (newStreak * 0.1));

    const dateKey = today.toISOString().split('T')[0];
    setPredictionHistory({
      ...predictionHistory,
      [dateKey]: Math.floor(Math.random() * 150) + 50
    });
  };

  const streakText = streak === 1 ? '1 day streak' : `${streak} days streak`;

  const getStreakColor = () => {
    if (streak >= 7) return '#7ee787';
    if (streak >= 3) return '#ffa726';
    return '#aaa';
  };

  const getFireColor = () => {
    if (streak >= 7) return '#7ee787';
    if (streak >= 3) return '#ffa726';
    return '#ff4500';
  };

  const sortedHistory = Object.entries(predictionHistory)
    .sort(([date1], [date2]) => date2.localeCompare(date1))
    .slice(0, 5);

  return (
    <div style={{
      marginBottom: '20px',
      padding: '20px',
      backgroundColor: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#fff'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.5em' }}>🔥</span>
          <h2 style={{ margin: '0', color: '#ff4500', fontSize: '1.3em' }}>Your Streak</h2>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '8px 16px',
            backgroundColor: showDetails ? 'rgba(255,255,255,0.1)' : '#ff4500',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85em',
            fontWeight: 500,
            transition: 'all 0.2s'
          }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '10px'
      }}>
        <div>
          <p style={{ margin: '0', fontSize: '1.4em', fontWeight: 'bold', color: getStreakColor() }}>
            {streakText}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#888' }}>
            {bonusMultiplier > 1 
              ? `${(bonusMultiplier * 100 - 100).toFixed(0)}% bonus active!` 
              : 'Make a prediction to start streak'}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontSize: '2em',
            fontWeight: 'bold',
            color: getFireColor()
          }}>
            {bonusMultiplier.toFixed(1)}x
          </div>
          <p style={{ margin: '3px 0 0 0', fontSize: '0.8em', color: '#666' }}>
            multiplier
          </p>
        </div>
      </div>

      {showDetails && (
        <div style={{
          marginTop: '20px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '1em', color: '#ff4500' }}>
            📊 Prediction History
          </h3>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#aaa' }}>Recent Scores:</p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {sortedHistory.map(([date, score]) => (
                <div key={date} style={{
                  padding: '8px 12px',
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  fontSize: '0.85em',
                  color: '#ccc'
                }}>
                  {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: <strong style={{ color: '#ff9800' }}>{score} pts</strong>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            fontSize: '0.85em'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#888' }}>Last Predicted</p>
              <strong style={{ color: '#fff' }}>
                {lastPredictionDate ? new Date(lastPredictionDate).toLocaleDateString() : 'Never'}
              </strong>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#888' }}>Best Streak</p>
              <strong style={{ color: '#7ee787' }}>7 days</strong>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#888' }}>Total Predictions</p>
              <strong style={{ color: '#fff' }}>{Object.keys(predictionHistory).length}</strong>
            </div>
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(255,255,255,0.03)',
              borderRadius: '8px'
            }}>
              <p style={{ margin: '0 0 5px 0', color: '#888' }}>Accuracy Rate</p>
              <strong style={{ color: '#ffa726' }}>65%</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakCounter;
