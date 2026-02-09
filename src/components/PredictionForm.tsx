import React, { useState } from 'react';

interface PredictionFormData {
  user: string;
  subreddit: string;
  title: string;
  reason: string;
}

interface PredictionFormProps {
  onSubmit: (prediction: Omit<PredictionFormData, 'user'>) => void;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PredictionFormData>({
    user: '',
    subreddit: '',
    title: '',
    reason: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof PredictionFormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PredictionFormData, string>> = {};
    
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
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <h2>Make Your Prediction</h2>
      
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
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Username:
            <input
              type="text"
              value={formData.user}
              onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
          {errors.user && (
            <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.user}</div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Predicted Subreddit (without /r/):
            <input
              type="text"
              value={formData.subreddit}
              onChange={(e) => setFormData({ ...formData, subreddit: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
          {errors.subreddit && (
            <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.subreddit}</div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Predicted Post Title:
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </label>
          {errors.title && (
            <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.title}</div>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Reasoning:
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '4px', minHeight: '100px' }}
            />
          </label>
          {errors.reason && (
            <div style={{ color: 'red', fontSize: '0.9em' }}>{errors.reason}</div>
          )}
        </div>
        
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Submit Prediction
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;