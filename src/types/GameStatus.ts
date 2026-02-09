export interface GameStatus {
  isActive: boolean;         // Whether predictions are currently open
  deadline: Date;            // When predictions close (6 PM ET)
  timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  dayNumber: number;         // Day of the game (for historical tracking)
  lastUpdated: Date;         // When the game status was last updated
}