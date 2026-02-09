import React, { useState } from 'react';
import { Prediction } from '../types';

interface PredictionFormProps {
  onSubmit: (prediction: Omit<Prediction, 'id' | 'timestamp'>) => void;
  onUserChange?: (user: string) => void;
  disabled?: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, onUserChange, disabled = false }) => {
  const [formData, setFormData] = useState({
    user: '',
    subreddit: '',
    title: '',
    reason: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof Prediction, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Prediction, string>> = {};
    
    if (!formData.user.trim()) {
      newErrors.user = 'Username is required';
    }
    
    if (!formData.subreddit.trim()) {
      newErrors.subreddit = 'Subreddit is required';
    } else if (!/^\w+$/.test(formData.subreddit)) {
      newErrors.subreddit = 'Invalid subreddit format (no slashes or spaces)';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Post title is required';
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'Reasoning is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Omit user from submission for now (will be handled by auth later)
      const { user, ...predictionData } = formData;
      onSubmit(predictionData);
      setSubmitted(true);
      
      // Reset form after submission
      setFormData({
        user: '',
        subreddit: '',
        title: '',
        reason: ''
      });
      
      // Reset validation
      setErrors({});
    }
  };

  // Update user state when username changes
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUser = e.target.value;
    setFormData({ ...formData, user: newUser });
    if (onUserChange) {
      onUserChange(newUser);
    }
  };

  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '15px' }}>Make Your Prediction</h2>
      
      {submitted && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#d4edda',
          color: '#155724',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          Prediction submitted successfully!
          <button 
            onClick={() => setSubmitted(false)}
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
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Username:
            <input
              type="text"
              value={formData.user}
              onChange={handleUserChange}
              disabled={disabled}
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '4px',
                backgroundColor: disabled ? '#e9ecef' : 'white',
                border: errors.user ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </label>
          {errors.user && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.user}</div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Predicted Subreddit (without /r/):
            <input
              type="text"
              value={formData.subreddit}
              onChange={(e) => setFormData({ ...formData, subreddit: e.target.value })}
              disabled={disabled}
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '4px',
                backgroundColor: disabled ? '#e9ecef' : 'white',
                border: errors.subreddit ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </label>
          {errors.subreddit && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.subreddit}</div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Predicted Post Title:
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={disabled}
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '4px',
                backgroundColor: disabled ? '#e9ecef' : 'white',
                border: errors.title ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </label>
          {errors.title && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.title}</div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Reasoning:
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              disabled={disabled}
              style={{ 
                width: '100%', 
                padding: '8px', 
                marginTop: '4px', 
                minHeight: '100px',
                backgroundColor: disabled ? '#e9ecef' : 'white',
                border: errors.reason ? '1px solid #dc3545' : '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </label>
          {errors.reason && (
            <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.reason}</div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={disabled}
          style={{
            padding: '10px 20px',
            backgroundColor: disabled ? '#6c757d' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: '1em'
          }}
        >
          Submit Prediction
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;