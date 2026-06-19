/**
 * Scoring Registry
 * Centralized scoring values and calculations
 * No scoring logic should exist inside React components
 */

import { ScoringRule } from '../types/entities';

export const scoringRegistry: Record<string, ScoringRule> = {
  // Direct event scoring
  YELLOW_CARD: {
    id: 'YELLOW_CARD',
    name: 'Yellow Card',
    basePoints: 5,
  },

  RED_CARD: {
    id: 'RED_CARD',
    name: 'Red Card',
    basePoints: 15,
  },

  BENCH_CARD: {
    id: 'BENCH_CARD',
    name: 'Bench Card',
    basePoints: 10,
  },

  VAR_REVIEW: {
    id: 'VAR_REVIEW',
    name: 'VAR Review',
    basePoints: 5,
  },

  VAR_OVERTURN: {
    id: 'VAR_OVERTURN',
    name: 'VAR Overturn',
    basePoints: 15,
  },

  OWN_GOAL: {
    id: 'OWN_GOAL',
    name: 'Own Goal',
    basePoints: 20,
  },

  MISSED_PENALTY: {
    id: 'MISSED_PENALTY',
    name: 'Missed Penalty',
    basePoints: 15,
  },

  HIT_POST: {
    id: 'HIT_POST',
    name: 'Hit Post',
    basePoints: 5,
  },

  LATE_GOAL: {
    id: 'LATE_GOAL',
    name: 'Late Goal (Final 5 Minutes)',
    basePoints: 20,
  },

  SAVE_OF_SEASON: {
    id: 'SAVE_OF_SEASON',
    name: 'Save of the Season',
    basePoints: 15,
  },

  GOALKEEPER_BLUNDER: {
    id: 'GOALKEEPER_BLUNDER',
    name: 'Goalkeeper Blunder',
    basePoints: 18,
  },

  HAT_TRICK: {
    id: 'HAT_TRICK',
    name: 'Hat Trick',
    basePoints: 25,
  },

  INJURY: {
    id: 'INJURY',
    name: 'Injury Substitution',
    basePoints: 5,
  },

  BRACE: {
    id: 'BRACE',
    name: 'Brace',
    basePoints: 18,
  },

  DIVE: {
    id: 'DIVE',
    name: 'Dive/Simulation',
    basePoints: 12,
  },

  HANDBALL: {
    id: 'HANDBALL',
    name: 'Handball',
    basePoints: 12,
  },

  OFFSIDE: {
    id: 'OFFSIDE',
    name: 'Offside',
    basePoints: 2,
  },

  WEATHER_DELAY: {
    id: 'WEATHER_DELAY',
    name: 'Weather Delay',
    basePoints: 10,
  },

  PITCH_INVASION: {
    id: 'PITCH_INVASION',
    name: 'Pitch Invasion',
    basePoints: 18,
  },

  SUBSTITUTION: {
    id: 'SUBSTITUTION',
    name: 'Substitution',
    basePoints: 1,
  },
};

/**
 * Multiplier configurations for specific scenarios
 */
export const multipliers = {
  EARLY_PREDICTION: 1.5, // If predicted before match starts
  CORRECT_TIMING: 1.2, // If predicted within 5 minutes of occurrence
  RARE_EVENT: 2.0, // For uncommon events
  MULTIPLE_PREDICTIONS: 0.8, // Diminishing returns for multiple correct predictions
};

/**
 * Get base points for an event
 */
export function getBasePoints(eventId: string): number {
  const rule = scoringRegistry[eventId];
  return rule ? rule.basePoints : 0;
}

/**
 * Calculate points with multipliers
 */
export function calculatePointsWithMultipliers(
  basePoints: number,
  multiplierKeys: string[]
): number {
  let total = basePoints;

  multiplierKeys.forEach((key) => {
    const multiplier = multipliers[key as keyof typeof multipliers];
    if (multiplier) {
      total *= multiplier;
    }
  });

  return Math.round(total);
}

/**
 * Get all available scoring rules
 */
export function getAllScoringRules(): ScoringRule[] {
  return Object.values(scoringRegistry);
}

/**
 * Get total potential points (for leaderboard max possible)
 */
export function getTotalPotentialPoints(): number {
  return Object.values(scoringRegistry).reduce(
    (sum, rule) => sum + rule.basePoints,
    0
  );
}

/**
 * Get average points per event
 */
export function getAveragePointsPerEvent(): number {
  const rules = Object.values(scoringRegistry);
  const total = rules.reduce((sum, rule) => sum + rule.basePoints, 0);
  return Math.round(total / rules.length);
}

/**
 * Validate and normalize scoring for a category
 */
export function validateCategoryScoring(categoryId: string): boolean {
  // This will be implemented when we link categories to events
  // For now, placeholder for validation logic
  return true;
}
