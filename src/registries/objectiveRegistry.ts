/**
 * Objective Registry
 * Defines all available objectives that players can be assigned
 */

import { Objective } from '../types/entities';

/**
 * Common Objectives
 * Players receive 2 of these randomly
 * Should be based on events that occur regularly
 */
const COMMON_OBJECTIVES: Record<string, Objective> = {
  FINISHER: {
    id: 'FINISHER',
    name: 'Finisher',
    description: '+3 per Goal',
    rarity: 'COMMON',
    eventType: 'GOAL',
    points: 3,
    applicablePositions: ['FWD', 'MID'],
    condition: 'Player scores a goal',
    recommendedPositions: ['FWD'],
    draftHint: 'Draft attackers who are likely to score. Look for strikers in form.',
  },
  CREATOR: {
    id: 'CREATOR',
    name: 'Creator',
    description: '+2 per Assist',
    rarity: 'COMMON',
    eventType: 'ASSIST',
    points: 2,
    condition: 'Player records an assist',
    recommendedPositions: ['MID', 'FWD'],
    draftHint: 'Draft playmakers and attacking midfielders. Choose creative players.',
  },
  MARKSMAN: {
    id: 'MARKSMAN',
    name: 'Marksman',
    description: '+1 per Shot On Target',
    rarity: 'COMMON',
    eventType: 'SHOT_ON_TARGET',
    points: 1,
    applicablePositions: ['FWD'],
    condition: 'Player takes shot on target',
    recommendedPositions: ['FWD'],
    draftHint: 'Draft forwards who will take shots. Strikers and aggressive forwards excel.',
  },
  ENFORCER: {
    id: 'ENFORCER',
    name: 'Enforcer',
    description: '+1 per Foul Committed',
    rarity: 'COMMON',
    eventType: 'FOUL_COMMITTED',
    points: 1,
    condition: 'Player commits a foul',
    recommendedPositions: ['DEF', 'MID'],
    draftHint: 'Draft aggressive players who make tackles. Defensive midfielders are great choices.',
  },
  CARD_MAGNET: {
    id: 'CARD_MAGNET',
    name: 'Card Magnet',
    description: '+2 per Yellow Card',
    rarity: 'COMMON',
    eventType: 'YELLOW_CARD',
    points: 2,
    condition: 'Player receives yellow card',
    recommendedPositions: ['DEF', 'MID'],
    draftHint: 'Draft aggressive defenders and midfielders. Players with physical playing styles get carded more.',
  },
  BRICK_WALL: {
    id: 'BRICK_WALL',
    name: 'Brick Wall',
    description: '+1 per Save',
    rarity: 'COMMON',
    eventType: 'SAVE',
    points: 1,
    applicablePositions: ['GK'],
    condition: 'Goalkeeper makes a save',
    recommendedPositions: ['GK'],
    draftHint: 'Draft goalkeepers expected to face shots. Choose goalkeepers with busy schedules.',
  },
  WORKHORSE: {
    id: 'WORKHORSE',
    name: 'Workhorse',
    description: '+1 per Match Appearance',
    rarity: 'COMMON',
    eventType: 'STARTER',
    points: 1,
    condition: 'Player starts the match',
    recommendedPositions: ['DEF', 'MID', 'FWD'],
    draftHint: 'Draft guaranteed starters. Look for players who always play 90 minutes.',
  },
};

/**
 * Rare Objectives
 * Players receive 1 of these randomly
 * Exciting but realistically achievable
 * Do NOT overlap with Fiasco Bonuses
 */
const RARE_OBJECTIVES: Record<string, Objective> = {
  BRACE_HUNTER: {
    id: 'BRACE_HUNTER',
    name: 'Brace Hunter',
    description: '+10 if 2+ goals',
    rarity: 'RARE',
    eventType: 'MULTI_GOAL',
    points: 10,
    applicablePositions: ['FWD'],
    condition: 'Player scores 2 or more goals',
    recommendedPositions: ['FWD'],
    draftHint: 'Draft prolific strikers. Look for players with high goal-scoring potential.',
  },
  CLUTCH_PLAYER: {
    id: 'CLUTCH_PLAYER',
    name: 'Clutch Player',
    description: '+8 for goal after 80\'',
    rarity: 'RARE',
    eventType: 'LATE_GOAL',
    points: 8,
    applicablePositions: ['FWD', 'MID'],
    condition: 'Player scores after 80th minute',
    recommendedPositions: ['FWD', 'MID'],
    draftHint: 'Draft players known for late heroics. Look for impact players and super subs.',
  },
  MATCH_WINNER: {
    id: 'MATCH_WINNER',
    name: 'Match Winner',
    description: '+10 for winning goal',
    rarity: 'RARE',
    eventType: 'WINNING_GOAL',
    points: 10,
    applicablePositions: ['FWD', 'MID'],
    condition: 'Player scores the winning goal',
    recommendedPositions: ['FWD', 'MID'],
    draftHint: 'Draft key attacking players. Choose playmakers and finishers likely to score decisive goals.',
  },
  SUPER_SUB: {
    id: 'SUPER_SUB',
    name: 'Super Sub',
    description: '+8 if substitute scores',
    rarity: 'RARE',
    eventType: 'SUBSTITUTE_GOAL',
    points: 8,
    applicablePositions: ['FWD', 'MID'],
    condition: 'Substitute player scores',
    recommendedPositions: ['FWD', 'MID'],
    draftHint: 'Draft impact substitutes on the bench. Look for quality backup players known for scoring.',
  },
  CLEAN_SHEET_KING: {
    id: 'CLEAN_SHEET_KING',
    name: 'Clean Sheet King',
    description: '+8 for clean sheet',
    rarity: 'RARE',
    eventType: 'CLEAN_SHEET',
    points: 8,
    applicablePositions: ['GK'],
    condition: 'Goalkeeper keeps clean sheet (no goals against)',
    recommendedPositions: ['GK'],
    draftHint: 'Draft elite goalkeepers. Choose keepers from defensive teams.',
  },
  ASSIST_MACHINE: {
    id: 'ASSIST_MACHINE',
    name: 'Assist Machine',
    description: '+8 if 2 assists',
    rarity: 'RARE',
    eventType: 'MULTI_ASSIST',
    points: 8,
    condition: 'Player records 2 or more assists',
    recommendedPositions: ['MID', 'FWD'],
    draftHint: 'Draft creative playmakers. Choose midfielders and wingers who create chances.',
  },
};

export const objectiveRegistry = {
  ...COMMON_OBJECTIVES,
  ...RARE_OBJECTIVES,
};

/**
 * Get objective by ID
 */
export function getObjective(id: string): Objective | undefined {
  return objectiveRegistry[id];
}

/**
 * Get all common objectives
 */
export function getCommonObjectives(): Objective[] {
  return Object.values(COMMON_OBJECTIVES);
}

/**
 * Get all rare objectives
 */
export function getRareObjectives(): Objective[] {
  return Object.values(RARE_OBJECTIVES);
}

/**
 * Get random common objectives
 * @param count Number of objectives to return
 * @returns Array of random common objectives
 */
export function getRandomCommonObjectives(count: number): Objective[] {
  const objectives = getCommonObjectives();
  const selected: Objective[] = [];
  const indices = new Set<number>();

  while (selected.length < Math.min(count, objectives.length)) {
    const index = Math.floor(Math.random() * objectives.length);
    if (!indices.has(index)) {
      indices.add(index);
      selected.push(objectives[index]);
    }
  }

  return selected;
}

/**
 * Get random rare objective
 * @returns One random rare objective
 */
export function getRandomRareObjective(): Objective {
  const objectives = getRareObjectives();
  return objectives[Math.floor(Math.random() * objectives.length)];
}

/**
 * Get all objectives for a player
 * 2 Common + 1 Rare
 */
export function getObjectiveSet(): Objective[] {
  const common = getRandomCommonObjectives(2);
  const rare = getRandomRareObjective();
  return [...common, rare];
}
