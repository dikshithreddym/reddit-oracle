import React, { useState } from 'react';
import { Prediction } from '../types';

interface PredictionFormProps {
  onSubmit: (prediction: { user: string; subreddit: string; title: string; reason: string }) => void;
  onUserChange?: (user: string) => void;
  disabled?: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, onUserChange, disabled = false }) => {
  const [formData, setFormData] = useState({ user: '', subreddit: '', title: '', reason: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Prediction, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Prediction, string>> = {};
    if (!formData.user.trim()) newErrors.user = 'Username required';
    if (!formData.subreddit.trim()) newErrors.subreddit = 'Subreddit required';
    else if (!/^\w+$/.test(formData.subreddit)) newErrors.subreddit = 'Invalid format';
    if (!formData.title.trim()) newErrors.title = 'Title required';
    if (!formData.reason.trim()) newErrors.reason = 'Reasoning required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setSubmitted(true);
      setFormData({ user: '', subreddit: '', title: '', reason: '' });
      setErrors({});
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, user: e.target.value });
    if (onUserChange) onUserChange(e.target.value);
  };

  const inputStyle = (error?: string): React.CSSProperties => ({
    width: '100%',
    padding: '12px',
    marginTop: '6px',
    backgroundColor: disabled ? '#333' : '#2a2a3e',
    border: `2px solid ${error ? '#ff4444' : '#444'}`,
    borderRadius: '8px',
    color: '#fff',
    fontSize: '1em',
    transition: 'border-color 0.2s',
  });

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '15px',
    color: '#ddd',
    fontSize: '0.95em',
  };

  const errorStyle: React.CSSProperties = {
    color: '#ff4444',
    fontSize: '0.85em',
    marginTop: '4px',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    backgroundColor: disabled ? '#666' : '#ff4500',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1em',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    marginTop: '10px',
  };

  return (
    <div style={{ 
      marginBottom: '20px', 
      padding: '20px', 
      backgroundColor: 'rgba(255,255,255,0.05)', 
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#ff4500', textAlign: 'center' }}>
        🎯 Make Your Prediction
      </h2>
      
      {submitted && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#2d5016', 
          color: '#7ee787',
          borderRadius: '8px', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          ✅ Prediction submitted!
        </div>
      )}

      {disabled && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#4a1c1c', 
          color: '#ff9999',
          borderRadius: '8px', 
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          🔒 Predictions are currently closed. Come back tomorrow!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>
          👤 Username
          <input 
            type="text" 
            value={formData.user} 
            onChange={handleUserChange} 
            disabled={disabled}
            placeholder="Enter your username"
            style={inputStyle(errors.user)}
          />
          {errors.user && <div style={errorStyle}>{errors.user}</div>}
        </label>

        <label style={labelStyle}>
          📁 Predicted Subreddit (without r/)
          <input 
            type="text" 
            value={formData.subreddit} 
            onChange={(e) => setFormData({ ...formData, subreddit: e.target.value })} 
            disabled={disabled}
            placeholder="e.g., memes, funny, askreddit"
            style={inputStyle(errors.subreddit)}
          />
          {errors.subreddit && <div style={errorStyle}>{errors.subreddit}</div>}
        </label>

        <label style={labelStyle}>
          📝 Predicted Post Title
          <input 
            type="text" 
            value={formData.title} 
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
            disabled={disabled}
            placeholder="What will the title say?"
            style={inputStyle(errors.title)}
          />
          {errors.title && <div style={errorStyle}>{errors.title}</div>}
        </label>

        <label style={labelStyle}>
          💭 Your Reasoning
          <textarea 
            value={formData.reason} 
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })} 
            disabled={disabled}
            placeholder="Why do you think this will be #1?"
            rows={4}
            style={{ ...inputStyle(errors.reason), resize: 'vertical', minHeight: '100px' }}
          />
          {errors.reason && <div style={errorStyle}>{errors.reason}</div>}
        </label>

        <button type="submit" disabled={disabled} style={buttonStyle}>
          {disabled ? '⏸️ Predictions Closed' : '🚀 Submit Prediction'}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;