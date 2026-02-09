# Reddit Oracle - Deployment Guide

## Overview
This guide explains how to deploy the Reddit Oracle game to the Devvit platform for use on Reddit.

## Prerequisites
1. A Reddit account with access to the Devvit beta
2. The Devvit CLI installed
3. A Reddit app configured with the necessary permissions

## Deployment Steps

### 1. Log in to Devvit
```bash
npx devvit login
```

### 2. Build the application
```bash
npm run build
```

### 3. Deploy the application
```bash
npx devvit deploy
```

### 4. Configure the application on Reddit
1. Go to your subreddit or user profile
2. Create a new post with the Interactive component
3. Select the Reddit Oracle game from your deployed components
4. Configure any additional settings

## Configuration
The application requires no additional configuration beyond the Devvit setup.

## Testing
To test the application locally:
```bash
npx devvit dev-server
```

## Development Workflow
1. Make changes to the code
2. Run `npm run build` to build the application
3. Run `npx devvit deploy` to deploy the changes

## Troubleshooting
- If you encounter issues with the Reddit API integration, ensure you have the correct permissions
- Check the Devvit documentation for