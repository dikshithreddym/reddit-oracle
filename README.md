# Reddit Oracle - Daily Prediction Game

## Overview
Reddit Oracle is a daily prediction game where users predict what will be the top post on r/popular at 6 PM ET. Users earn points for correct guesses and compete on leaderboards with streaks and social proof features.

## Features
- Daily prediction challenges
- Real-time leaderboard
- Streak tracking for consecutive correct predictions
- Reddit API integration
- Timezone-aware deadline tracking
- Scoring algorithm with partial matches

## Tech Stack
- **Platform**: Reddit Devvit Web (Interactive Posts)
- **Language**: TypeScript
- **Framework**: React
- **API**: Reddit API (read-only)
- **State Management**: React Hooks
- **Styling**: CSS-in-JS (inline styles)

## Project Structure
```
reddit-oracle/
├── src/
│   ├── main.tsx              # Entry point
│   ├── components/
│   │   ├── Game.tsx          # Main game component
│   │   ├── PredictionForm.tsx # Input for predictions
│   │   ├── Leaderboard.tsx   # Score board
│   │   └── StreakCounter.tsx # Streak display
│   ├── hooks/
│   │   └── useRedditData.ts  # Reddit API interactions
│   ├── utils/
│   │   ├── scoring.ts        # Scoring algorithm
│   │   └── time.ts           # Timezone handling
│   └── types/
│       └── index.ts          # TypeScript types
├── devvit.yaml               # Devvit configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Reddit Devvit CLI (for deployment)

### Installation
1. Clone the repository
```bash
gh repo clone dikshithreddym/reddit-oracle
```

2. Install dependencies
```bash
npm install
```

3. Build the project
```bash
npm run build
```

### Development
To run in development mode with hot reloading:
```bash
npm run dev
```

### Deployment
1. Authenticate with Reddit Devvit CLI
```bash
npx devvit login
```

2. Deploy the application
```bash
npx devvit deploy
```

## Game Mechanics

### Prediction Process
1. Users see daily challenge: "Predict today's #1 post on r/popular"
2. Users submit prediction (subreddit + title guess) + reason
3. At 6 PM ET: Game checks actual Reddit API
4. Results: Points awarded, leaderboard updates
5. Next day: New challenge with fresh content

### Scoring Algorithm
- Exact subreddit match: 100 points
- Correct category (e.g., r/gaming if actual is r/gaming): 50 points
- Partial match: 10-40 points based on similarity
- Participation: 10 points
- Streak bonus: +10% cumulative per consecutive day

## Contributing
Contributions are welcome! Please open an issue first to discuss what you'd like to add or fix.

## License
MIT License

## Acknowledgements
- Reddit Devvit Platform
- React Community
- TypeScript Team

## Contact
For questions about the project, please reach out to the maintainers.

## Roadmap
- [ ] Implement real Reddit API integration
- [ ] Add user authentication
- [ ] Implement historical results view
- [ ] Add social sharing features
- [ ] Enhance UI/UX with animations
- [ ] Add push notifications for results

## Credits
This project was created for the Reddit Daily Games Hackathon.