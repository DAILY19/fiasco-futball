/**
 * Category Registry
 * Centralized definition of all draft categories
 * Each category represents something a player can draft to predict
 */

import { CategoryDefinition, ScoringTrigger } from '../types/entities';

// Scoring triggers for each category
const cardCollectorTriggers: ScoringTrigger[] = [
  {
    id: 'cc_yellow_1',
    eventId: 'YELLOW_CARD',
    basePoints: 5,
  },
  {
    id: 'cc_red_1',
    eventId: 'RED_CARD',
    basePoints: 15,
  },
  {
    id: 'cc_bench_1',
    eventId: 'BENCH_CARD',
    basePoints: 10,
  },
];

const chaosCupTriggers: ScoringTrigger[] = [
  {
    id: 'cc_owngoal_1',
    eventId: 'OWN_GOAL',
    basePoints: 20,
  },
  {
    id: 'cc_var_1',
    eventId: 'VAR_OVERTURN',
    basePoints: 15,
  },
  {
    id: 'cc_handball_1',
    eventId: 'HANDBALL',
    basePoints: 12,
  },
  {
    id: 'cc_dive_1',
    eventId: 'DIVE',
    basePoints: 10,
  },
  {
    id: 'cc_pitch_1',
    eventId: 'PITCH_INVASION',
    basePoints: 18,
  },
];

const refShowTriggers: ScoringTrigger[] = [
  {
    id: 'rs_yellow_1',
    eventId: 'YELLOW_CARD',
    basePoints: 8,
  },
  {
    id: 'rs_red_1',
    eventId: 'RED_CARD',
    basePoints: 20,
  },
  {
    id: 'rs_var_1',
    eventId: 'VAR_REVIEW',
    basePoints: 5,
  },
  {
    id: 'rs_offside_1',
    eventId: 'OFFSIDE',
    basePoints: 3,
  },
];

const heartbreakerTriggers: ScoringTrigger[] = [
  {
    id: 'hb_missed_1',
    eventId: 'MISSED_PENALTY',
    basePoints: 15,
  },
  {
    id: 'hb_post_1',
    eventId: 'HIT_POST',
    basePoints: 8,
  },
  {
    id: 'hb_owngoal_1',
    eventId: 'OWN_GOAL',
    basePoints: 20,
  },
  {
    id: 'hb_goalkeeper_1',
    eventId: 'GOALKEEPER_BLUNDER',
    basePoints: 18,
  },
];

const hollywoodTriggers: ScoringTrigger[] = [
  {
    id: 'hw_dive_1',
    eventId: 'DIVE',
    basePoints: 12,
  },
  {
    id: 'hw_var_1',
    eventId: 'VAR_OVERTURN',
    basePoints: 15,
  },
  {
    id: 'hw_red_1',
    eventId: 'RED_CARD',
    basePoints: 18,
  },
];

const lateDrawTriggers: ScoringTrigger[] = [
  {
    id: 'ld_late_1',
    eventId: 'LATE_GOAL',
    basePoints: 20,
  },
  {
    id: 'ld_var_1',
    eventId: 'VAR_OVERTURN',
    basePoints: 15,
  },
  {
    id: 'ld_save_1',
    eventId: 'SAVE_OF_SEASON',
    basePoints: 10,
  },
];

const sikosCommunityTriggers: ScoringTrigger[] = [
  {
    id: 'sc_hatrick_1',
    eventId: 'HAT_TRICK',
    basePoints: 25,
  },
  {
    id: 'sc_brace_1',
    eventId: 'BRACE',
    basePoints: 18,
  },
  {
    id: 'sc_save_1',
    eventId: 'SAVE_OF_SEASON',
    basePoints: 15,
  },
];

const refuseShowTriggers: ScoringTrigger[] = [
  {
    id: 'rs2_weather_1',
    eventId: 'WEATHER_DELAY',
    basePoints: 10,
  },
  {
    id: 'rs2_injury_1',
    eventId: 'INJURY',
    basePoints: 8,
  },
  {
    id: 'rs2_sub_1',
    eventId: 'SUBSTITUTION',
    basePoints: 2,
  },
];

export const categoryRegistry: Record<string, CategoryDefinition> = {
  // Core categories
  CARD_COLLECTOR: {
    id: 'CARD_COLLECTOR',
    name: 'Card Collector',
    description:
      'Predict which players will receive cards. Yellow cards earn 5 points, red cards earn 15 points.',
    icon: '🟨',
    scoringTriggers: cardCollectorTriggers,
    maxSelections: 1,
  },

  CHAOS_CUP: {
    id: 'CHAOS_CUP',
    name: 'Chaos Cup',
    description:
      'Bet on the most absurd moments. Own goals, VAR overturn, handballs, and dives all score big.',
    icon: '🎪',
    scoringTriggers: chaosCupTriggers,
    maxSelections: 1,
  },

  REF_SHOW: {
    id: 'REF_SHOW',
    name: 'Ref Show',
    description:
      'Will the referee dominate the match? Track cards, VAR reviews, and controversial calls.',
    icon: '👨‍⚖️',
    scoringTriggers: refShowTriggers,
    maxSelections: 1,
  },

  HEARTBREAKER: {
    id: 'HEARTBREAKER',
    name: 'Heartbreaker',
    description:
      'Predict moments of anguish. Missed penalties, own goals, and goalkeeper blunders.',
    icon: '💔',
    scoringTriggers: heartbreakerTriggers,
    maxSelections: 1,
  },

  HOLLYWOOD: {
    id: 'HOLLYWOOD',
    name: 'Hollywood',
    description:
      'Dramatic moments and controversial decisions. Dives, VAR overturns, and red cards.',
    icon: '🎬',
    scoringTriggers: hollywoodTriggers,
    maxSelections: 1,
  },

  LATE_DRAMA: {
    id: 'LATE_DRAMA',
    name: 'Late Drama',
    description: 'Will the match be decided late? Late goals and dramatic VAR overturn moments.',
    icon: '⏰',
    scoringTriggers: lateDrawTriggers,
    maxSelections: 1,
  },

  SICKOS_COMMITTEE: {
    id: 'SICKOS_COMMITTEE',
    name: "Sickos' Committee",
    description:
      'Excellence and beauty. Hat tricks, amazing saves, and masterful performances.',
    icon: '🎯',
    scoringTriggers: sikosCommunityTriggers,
    maxSelections: 1,
  },

  // Extended categories
  REFUSE_SHOW: {
    id: 'REFUSE_SHOW',
    name: 'Refuse Show',
    description: 'Predict delays, injuries, and substitution chaos.',
    icon: '🗑️',
    scoringTriggers: refuseShowTriggers,
    maxSelections: 1,
  },
};

/**
 * Get a category by ID
 */
export function getCategory(categoryId: string): CategoryDefinition | undefined {
  return categoryRegistry[categoryId];
}

/**
 * Get all categories
 */
export function getAllCategories(): CategoryDefinition[] {
  return Object.values(categoryRegistry);
}

/**
 * Get all category IDs
 */
export function getAllCategoryIds(): string[] {
  return Object.keys(categoryRegistry);
}

/**
 * Get categories available for a specific sport
 */
export function getCategoriesBySport(sport: string): CategoryDefinition[] {
  return Object.values(categoryRegistry).filter(
    (cat) => !cat.sport || cat.sport === sport
  );
}

/**
 * Get scoring triggers for a category
 */
export function getCategoryTriggers(categoryId: string): ScoringTrigger[] {
  const category = getCategory(categoryId);
  return category ? category.scoringTriggers : [];
}
