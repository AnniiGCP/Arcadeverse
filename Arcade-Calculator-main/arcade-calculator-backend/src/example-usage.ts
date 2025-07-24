// Example usage of the calculation logic in other projects
// This file shows how to import and use the calculation functions

import { 
  Badge, 
  determineBadgeType, 
  calculateArcadePoints,
  calculatePoints,
  calculateMilestoneProgress
} from './calculationLogic';

// Example 1: Calculate badge type for a single badge
const badgeName = "Skills Boost Love Beyond";
const badgeType = determineBadgeType(badgeName);
console.log(`Badge "${badgeName}" is of type: ${badgeType}`);

// Example 2: Create sample badges and calculate points
const sampleBadges: Badge[] = [
  {
    name: "Skills Boost Love Beyond",
    type: "game",
    earnedDate: "2025-01-15T00:00:00.000Z"
  },
  {
    name: "Skills Boost Trivia Challenge",
    type: "trivia", 
    earnedDate: "2025-01-20T00:00:00.000Z"
  },
  {
    name: "Analyze BigQuery Data in Connected Sheets",
    type: "skill",
    earnedDate: "2025-01-25T00:00:00.000Z"
  },
  {
    name: "Get Started with Cloud Storage",
    type: "skill",
    earnedDate: "2025-01-30T00:00:00.000Z"
  }
];

// Calculate points for regular user
const regularUserResult = calculateArcadePoints(sampleBadges, false);
console.log('Regular user points:', regularUserResult.points);

// Calculate points for facilitator (includes milestone calculations)
const facilitatorResult = calculateArcadePoints(sampleBadges, true);
console.log('Facilitator points:', facilitatorResult.points);
console.log('Milestone progress:', facilitatorResult.milestoneProgress);

// Example 3: Calculate just the base points without milestone
const basePoints = calculatePoints(sampleBadges);
console.log('Base points only:', basePoints);

// Example 4: Calculate milestone progress separately
const milestoneProgress = calculateMilestoneProgress(sampleBadges);
console.log('Milestone progress:', milestoneProgress);

// Example 5: Process badges from external data
function processExternalBadgeData(externalData: any[]): Badge[] {
  return externalData.map(item => ({
    name: item.badgeName,
    type: determineBadgeType(item.badgeName),
    earnedDate: new Date(item.earnedDate).toISOString()
  }));
}

// Example 6: Calculate points for multiple users
function calculatePointsForUsers(users: { name: string; badges: Badge[]; isFacilitator: boolean }[]) {
  return users.map(user => ({
    name: user.name,
    result: calculateArcadePoints(user.badges, user.isFacilitator)
  }));
}

// Example usage of the multi-user function
const users = [
  {
    name: "John",
    badges: sampleBadges,
    isFacilitator: false
  },
  {
    name: "Jane", 
    badges: sampleBadges,
    isFacilitator: true
  }
];

const userResults = calculatePointsForUsers(users);
console.log('Multiple user results:', userResults); 