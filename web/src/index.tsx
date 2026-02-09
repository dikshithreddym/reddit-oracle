import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Game from './Game';
import './styles.css';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Game />);
}

// Notify Devvit parent when loaded
window.parent.postMessage?.({ type: 'loaded' }, '*');