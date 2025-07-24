import express from 'express';
import cors from 'cors';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { 
  Badge, 
  Points, 
  MilestoneProgress, 
  CalculationResult,
  determineBadgeType,
  calculateArcadePoints
} from './calculationLogic';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/calculate-points', async (req, res) => {
  try {
    const { profileUrl, isFacilitator } = req.query;
    console.log('Received request with:', { profileUrl, isFacilitator });

    if (!profileUrl || typeof profileUrl !== 'string') {
      return res.status(400).json({ error: 'Profile URL is required' });
    }

    const response = await axios.get(profileUrl);
    const $ = cheerio.load(response.data);

    const badges: Badge[] = [];

    // Find all profile badges
    $('.profile-badge').each((_, element) => {
      const $element = $(element);
      
      // Get badge name from the title span
      const name = $element.find('.ql-title-medium.l-mts').text().trim();
      
      // Get earned date from the body span
      const dateText = $element.find('.ql-body-medium.l-mbs').text().trim();
      
      // Extract date from the text (e.g., "Earned Dec 17, 2024 EST" or "Earned Apr 3, 2025 EDT")
      const dateMatch = dateText.match(/Earned (.+?) (?:EST|EDT)/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        // Parse the date string to a proper Date object
        const earnedDate = new Date(dateStr);
        
        if (name && !isNaN(earnedDate.getTime())) {
          const type = determineBadgeType(name);
          badges.push({
            name,
            type,
            earnedDate: earnedDate.toISOString()
          });
        }
      }
    });

    console.log('Total badges found:', badges.length);

    // Use the calculation logic module to calculate points
    const result: CalculationResult = calculateArcadePoints(badges, isFacilitator === 'true');
    
    console.log('Calculation result:', result);

    res.json(result);
  } catch (error) {
    console.error('Error calculating points:', error);
    res.status(500).json({ error: 'Failed to calculate points' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 