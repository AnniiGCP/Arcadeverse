# Arcade Calculator Backend

This is the backend calculation logic for the Google Arcade Points Calculator. It contains all the core calculation functions and API endpoints needed to calculate points from Google Arcade badges.

## Features

- **Badge Type Detection**: Automatically categorizes badges into game, trivia, skill, completion, and lab-free types
- **Points Calculation**: Calculates points based on badge types and special rules
- **Milestone System**: Supports facilitator milestone calculations with bonus points
- **Web Scraping**: Scrapes badge data from Google Arcade profile URLs
- **REST API**: Provides a clean API endpoint for point calculations

## Installation

1. Navigate to the backend directory:
```bash
cd arcade-calculator-backend
```

2. Install dependencies:
```bash
npm install
```

3. Build the TypeScript code:
```bash
npm run build
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Health Check
```
GET /api/health
```
Returns server status.

### Calculate Points
```
GET /api/calculate-points?profileUrl={URL}&isFacilitator={boolean}
```

**Parameters:**
- `profileUrl` (required): The Google Arcade profile URL to scrape
- `isFacilitator` (optional): Whether the user is a facilitator (affects milestone calculations)

**Response:**
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

## Calculation Logic

### Badge Types

1. **Game Badges**: Earned from arcade games
   - Regular game badges: 1 point each
   - Special game badges (Love Beyond, Arcade Skills Resolve, etc.): 2 points each

2. **Trivia Badges**: Earned from trivia challenges
   - All trivia badges: 1 point each

3. **Skill Badges**: Earned from skill-based activities
   - 1 point per 2 skill badges (rounded down)

4. **Completion Badges**: General completion badges
   - No points awarded

5. **Lab-Free Badges**: Free lab completion badges
   - No points awarded

### Milestone System (Facilitators Only)

Facilitators can earn bonus milestone points based on their progress:

- **Milestone 1 (25%)**: +2 points
- **Milestone 2 (50%)**: +8 points  
- **Milestone 3 (75%)**: +15 points
- **Milestone 4 (100%)**: +25 points

Milestone requirements (badges earned after April 1st, 2025):
- Milestone 1: 4 game, 4 trivia, 10 skill, 4 lab-free
- Milestone 2: 6 game, 6 trivia, 20 skill, 8 lab-free
- Milestone 3: 8 game, 7 trivia, 30 skill, 12 lab-free
- Milestone 4: 10 game, 8 trivia, 44 skill, 16 lab-free

### Date Filtering

Only badges earned after January 8th, 2025 are counted for regular point calculations.

## Configuration

The backend uses several configuration constants that can be modified:

- `START_DATE`: Date from which badges are counted (default: 2025-01-08)
- `GAME_BADGE_KEYWORDS`: Keywords to identify game badges
- `SKILL_BADGES`: List of all valid skill badge names
- `LAB_FREE_BADGES`: List of all valid lab-free badge names
- `MILESTONE_POINTS`: Point values for each milestone level

## Error Handling

The API returns appropriate HTTP status codes:
- `200`: Successful calculation
- `400`: Missing or invalid profile URL
- `500`: Server error during calculation

## Dependencies

- **express**: Web framework
- **cors**: Cross-origin resource sharing
- **axios**: HTTP client for web scraping
- **cheerio**: HTML parsing for web scraping
- **typescript**: Type safety and compilation

## Development

The backend is written in TypeScript and includes:
- Type definitions for all data structures
- Comprehensive error handling
- Detailed logging for debugging
- Modular function design for easy testing and modification 