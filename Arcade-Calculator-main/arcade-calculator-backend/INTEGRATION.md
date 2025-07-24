# Integration Guide

This guide explains how to integrate the Arcade Calculator calculation logic into your own projects.

## Quick Start

### Option 1: Use the Calculation Logic Only

If you only need the calculation functions without web scraping:

```typescript
import { 
  Badge, 
  calculateArcadePoints, 
  determineBadgeType 
} from './src/calculationLogic';

// Create your badge data
const badges: Badge[] = [
  {
    name: "Skills Boost Love Beyond",
    type: "game",
    earnedDate: "2025-01-15T00:00:00.000Z"
  }
  // ... more badges
];

// Calculate points
const result = calculateArcadePoints(badges, false); // false = not a facilitator
console.log(result.points.total);
```

### Option 2: Use the Full Backend

If you need the complete backend with web scraping:

1. Copy the entire `arcade-calculator-backend` folder to your project
2. Install dependencies: `npm install`
3. Build: `npm run build`
4. Start: `npm start`
5. Make API calls to `http://localhost:3001/api/calculate-points`

## API Integration

### Making API Calls

```javascript
// Example API call
const response = await fetch('http://localhost:3001/api/calculate-points?profileUrl=YOUR_PROFILE_URL&isFacilitator=false');
const result = await response.json();

console.log('Total points:', result.points.total);
console.log('Game badges:', result.points.gameBadges);
console.log('Trivia badges:', result.points.triviaBadges);
console.log('Skill badges:', result.points.skillBadges);
console.log('Milestone points:', result.points.milestonePoints);
```

### Response Format

```json
{
  "badges": [
    {
      "name": "Badge Name",
      "type": "game|trivia|skill|completion|lab-free",
      "earnedDate": "2025-01-15T00:00:00.000Z"
    }
  ],
  "points": {
    "total": 25,
    "gameBadges": 10,
    "triviaBadges": 5,
    "skillBadges": 10,
    "milestonePoints": 0
  },
  "milestoneProgress": {
    "currentMilestone": 2,
    "progress": 50
  }
}
```

## Frontend Integration Examples

### React Example

```tsx
import React, { useState, useEffect } from 'react';

function ArcadeCalculator() {
  const [profileUrl, setProfileUrl] = useState('');
  const [isFacilitator, setIsFacilitator] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculatePoints = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/calculate-points?profileUrl=${encodeURIComponent(profileUrl)}&isFacilitator=${isFacilitator}`
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={profileUrl}
        onChange={(e) => setProfileUrl(e.target.value)}
        placeholder="Enter Google Arcade profile URL"
      />
      <label>
        <input
          type="checkbox"
          checked={isFacilitator}
          onChange={(e) => setIsFacilitator(e.target.checked)}
        />
        Is Facilitator
      </label>
      <button onClick={calculatePoints} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate Points'}
      </button>
      
      {result && (
        <div>
          <h3>Results:</h3>
          <p>Total Points: {result.points.total}</p>
          <p>Game Badges: {result.points.gameBadges}</p>
          <p>Trivia Badges: {result.points.triviaBadges}</p>
          <p>Skill Badges: {result.points.skillBadges}</p>
          <p>Milestone Points: {result.points.milestonePoints}</p>
        </div>
      )}
    </div>
  );
}
```

### Vue.js Example

```vue
<template>
  <div>
    <input v-model="profileUrl" placeholder="Enter Google Arcade profile URL" />
    <label>
      <input type="checkbox" v-model="isFacilitator" />
      Is Facilitator
    </label>
    <button @click="calculatePoints" :disabled="loading">
      {{ loading ? 'Calculating...' : 'Calculate Points' }}
    </button>
    
    <div v-if="result">
      <h3>Results:</h3>
      <p>Total Points: {{ result.points.total }}</p>
      <p>Game Badges: {{ result.points.gameBadges }}</p>
      <p>Trivia Badges: {{ result.points.triviaBadges }}</p>
      <p>Skill Badges: {{ result.points.skillBadges }}</p>
      <p>Milestone Points: {{ result.points.milestonePoints }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profileUrl: '',
      isFacilitator: false,
      result: null,
      loading: false
    };
  },
  methods: {
    async calculatePoints() {
      this.loading = true;
      try {
        const response = await fetch(
          `http://localhost:3001/api/calculate-points?profileUrl=${encodeURIComponent(this.profileUrl)}&isFacilitator=${this.isFacilitator}`
        );
        this.result = await response.json();
      } catch (error) {
        console.error('Error:', error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
```

## Customization

### Modifying Badge Lists

You can modify the badge lists in `src/calculationLogic.ts`:

```typescript
// Add new game badge keywords
export const GAME_BADGE_KEYWORDS = [
  "Love Beyond",
  "Arcade Skills Resolve",
  // ... add your new keywords here
];

// Add new skill badges
export const SKILL_BADGES = [
  "Analyze BigQuery Data in Connected Sheets",
  // ... add your new skill badges here
];
```

### Changing Point Values

Modify the point calculation logic in the `calculatePoints` function:

```typescript
export function calculatePoints(badges: Badge[]): Points {
  // ... existing code ...
  
  // Modify point values here
  case 'game':
    gamePoints += 1; // Change from 1 to your desired value
    break;
  case 'trivia':
    triviaPoints += 1; // Change from 1 to your desired value
    break;
  
  // ... rest of the function
}
```

### Adjusting Milestone Requirements

Modify the milestone requirements in `calculateMilestoneProgress`:

```typescript
export function calculateMilestoneProgress(badges: Badge[]): MilestoneProgress {
  // ... existing code ...
  
  // Modify milestone requirements here
  if (gameBadgeCount >= 10 && triviaBadgeCount >= 8 && skillBadgeCount >= 44 && labFreeBadgeCount >= 16) {
    currentMilestone = 4;
    progress = 100;
  }
  // ... adjust other milestone levels
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Successful calculation
- `400`: Missing or invalid profile URL
- `500`: Server error during calculation

Always handle these cases in your frontend:

```javascript
const response = await fetch(url);
if (!response.ok) {
  if (response.status === 400) {
    throw new Error('Invalid profile URL');
  } else if (response.status === 500) {
    throw new Error('Server error during calculation');
  }
}
const result = await response.json();
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
- `PORT`: Server port (default: 3001)

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Support

For questions or issues with integration, refer to the main README.md file or check the example usage in `src/example-usage.ts`. 