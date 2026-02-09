import React, { useState, useEffect } from 'react';

interface StreakCounterProps {
  userId: string;
}

const StreakCounter: React.FC<StreakCounterProps> = ({ userId }) => {
  // In a real app, this would come from a database or local storage
  // For now, using mock data and simple in-memory state
  const [streak, setStreak] = useState<number>(0);
  const [lastPredictionDate, setLastPredictionDate] = useState<string | null>(null);
  const [bonusMultiplier, setBonusMultiplier] = useState<number>(1);

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

  return (
    <div style={{ 
      margin: '20px 0', 
      padding: '15px', 
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }}>
      <h2 style={{ margin: '0 0 10px 0' }}>Your Streak</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        
        <div>
          <p style={{ margin: '0', fontWeight: 'bold' }}>Streak Bonus</p>
          <p style={{ margin: '5px 0 0 0' }}>
            <span style={{ color: '#28a745', fontWeight: 'bold' }}>
              {bonusMultiplier.toFixed(1)}x
            </span> points multiplier
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakCounter;