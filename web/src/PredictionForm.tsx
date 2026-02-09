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
    if (!formData.user.trim()) newErrors.user = 'Username is required';
    if (!formData.subreddit.trim()) newErrors.subreddit = 'Subreddit is required';
    else if (!/^\w+$/.test(formData.subreddit)) newErrors.subreddit = 'Invalid format (no slashes/spaces)';
    if (!formData.title.trim()) newErrors.title = 'Post title is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reasoning is required';
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
    }
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, user: e.target.value });
    if (onUserChange) onUserChange(e.target.value);
  };

  return (
    <div style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '15px' }}>Make Your Prediction</h2>
      {submitted && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px' }}>
          Prediction submitted!
          <button onClick={() => setSubmitted(false)} style={{ marginLeft: '10px', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input type="text" value={formData.user} onChange={handleUserChange} disabled={disabled}
            style={{ width: '100%', padding: '8px', marginTop: '4px', border: errors.user ? '1px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.user && <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.user}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Predicted Subreddit (without /r/):</label>
          <input type="text" value={formData.subreddit} onChange={(e) => setFormData({ ...formData, subreddit: e.target.value })} disabled={disabled}
            style={{ width: '100%', padding: '8px', marginTop: '4px', border: errors.subreddit ? '1px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.subreddit && <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.subreddit}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Predicted Post Title:</label>
          <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} disabled={disabled}
            style={{ width: '100%', padding: '8px', marginTop: '4px', border: errors.title ? '1px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.title && <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.title}</div>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Reasoning:</label>
          <textarea value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} disabled={disabled} rows={4}
            style={{ width: '100%', padding: '8px', marginTop: '4px', border: errors.reason ? '1px solid #dc3545' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.reason && <div style={{ color: '#dc3545', fontSize: '0.9em', marginTop: '4px' }}>{errors.reason}</div>}
        </div>
        <button type="submit" disabled={disabled} style={{ padding: '10px 20px', backgroundColor: disabled ? '#6c757d' : '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: disabled ? 'not-allowed' : 'pointer' }}>
          Submit Prediction
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;