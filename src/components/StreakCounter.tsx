import React, { useState, useEffect } from 'react';
import { Prediction } from '../types';

interface StreakCounterProps {
  userId: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ userId }) => {
  // In a real app, this would come from a database or local storage
  // For now, using mock data and simple in-memory state
  const [streak, setStreak] = useState<number>(0);
  const [lastPredictionDate, setLastPredictionDate] = useState<string | null>(null);
  const [bonusMultiplier, setBonusMultiplier] = useState<number>(1);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [predictionHistory, setPredictionHistory] = useState<Record<string, number>>({
    '2023-02-01': 85,
    '2023-02-02': 120,
    '2023-02-03': 95,
    '2023-02-04': 110,
    '2023-02-05': 90
  });

  useEffect(() => {
    // In a real app, this would fetch from a database
    // Mock data for demonstration
    const mockStreak = 3;
    const mockLastPrediction = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(); // Yesterday
    
    setStreak(mockStreak);
    setLastPredictionDate(mockLastPrediction);
    setBonusMultiplier(1 + (mockStreak * 0.1));
  }, []);

  const handlePredictionSubmitted = () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    // Check if user predicted yesterday (in a real app, we'd check actual accuracy)
    const predictedYesterday = lastPredictionDate && 
      new Date(lastPredictionDate) >= yesterday &&
      new Date(lastPredictionDate) < today;

    let newStreak = streak;
    
    // Update streak based on activity
    if (predictedYesterday) {
      newStreak += 1;
    } else {
      newStreak = 1; // Reset streak if didn't predict yesterday
    }
    
    setStreak(newStreak);
    setLastPredictionDate(today.toISOString());
    setBonusMultiplier(1 + (newStreak * 0.1));
    
    // Update prediction history
    const dateKey = today.toISOString().split('T')[0];
    const newPredictionHistory = {
      ...predictionHistory,
      [dateKey]: Math.floor(Math.random() * 150) + 50 // Mock score between 50-200
    };
    setPredictionHistory(newPredictionHistory);
  };

  // Format streak display
  const streakText = streak === 1 
    ? '1 day streak'
    : `${streak} days streak`;

  // Determine streak color based on length
  const getStreakColor = () => {
    if (streak >= 7) return '#28a745'; // Green for week-long streak
    if (streak >= 3) return '#ffc107'; // Yellow for 3+ days
    return '#6c757d'; // Gray for shorter
  };

  // Get prediction history sorted by date
  const sortedHistory = Object.entries(predictionHistory)
    .sort(([date1], [date2]) => date2.localeCompare(date1))
    .slice(0, 5);

  return (
    <div style={{ 
      margin: '20px 0', 
      padding: '15px', 
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: '0' }}>Your Streak</h2>
        <button
          onClick={() => setShowDetails(!showDetails)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.9em'
          }}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div>
          <p style={{ 
            margin: '0',
            fontSize: '1.2em',
            fontWeight: 'bold',
            color: getStreakColor()
          }}>
            🔥 {streakText}
          </p>
          <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
            {bonusMultiplier > 1 
              ? `+${(bonusMultiplier * 100 - 100).toFixed(0)}% bonus points today!`
              : 'Predict today to start your streak!'}
          </p>
        </div>
        
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>Streak Bonus</p>
          <p style={{ margin: '5px 0 0 0' }}>
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>
              {bonusMultiplier.toFixed(1)}x
            </span> points multiplier
          </p>
        </div>
      </div>
      
      {showDetails && (
        <div style={{ 
          marginTop: '15px', 
          paddingTop: '15px',
          borderTop: '1px solid #dee2e6'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1em' }}>Streak History</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '0 0 10px 0' }}>Recent Predictions:</p>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.9em' }}>
              {sortedHistory.map(([date, score]) => (
                <li key={date} style={{ marginBottom: '5px' }}>
                  {new Date(date).toLocaleDateString()}: {score} points
                </li>
              ))}
              {sortedHistory.length === 0 && (
                <li>No prediction history available</li>
              )}
            </ul>
          </div>
          
          <div>
            <p style={{ margin: '0 0 10px 0' }}>Streak Statistics:</p>
            <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.9em' }}>
              <li>Last prediction: {lastPredictionDate ? new Date(lastPredictionDate).toLocaleDateString() : 'Never'}</li>
              <li>Longest streak: 7 days</li>
              <li>Total predictions: {Object.keys(predictionHistory).length}</li>
              <li>Accuracy rate: 65%</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreakCounter;