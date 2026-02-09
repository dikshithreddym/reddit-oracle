import React from 'react';
import { render } from 'devvit';
import Game from './components/Game';

// Entry point for Devvit Interactive Post
export default function App() {
  return (
    <Game />
  );
}

// Render the app
render(<App />);