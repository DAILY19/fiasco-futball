/**
 * Fiasco Bonus Registry
 * Defines bonus events that award points when a drafted player triggers them
 * These are NOT objectives - they are global bonuses
 */

import { FiascoBonus } from '../types/entities';

/**
 * Fiasco Bonuses
 * Limited set of high-impact events
 * Only these three should trigger special notifications
 */
const FIASCO_BONUSES: Record<string, FiascoBonus> = {
  OWN_GOAL: {
    id: 'OWN_GOAL',
    name: 'Own Goal',
    description: 'Drafted player scores own goal',
    eventType: 'OWN_GOAL',
    points: 15,
    icon: '🔥',
  },
  RED_CARD: {
    id: 'RED_CARD',
    name: 'Red Card',
    description: 'Drafted player receives red card',
    eventType: 'RED_CARD',
    points: 12,
    icon: '🔴',
  },
  MISSED_PENALTY: {
    id: 'MISSED_PENALTY',
    name: 'Missed Penalty',
    description: 'Drafted player misses penalty',
    eventType: 'MISSED_PENALTY',
    points: 10,
    icon: '⚽',
  },
};

export const fiascoBonusRegistry = FIASCO_BONUSES;

/**
 * Get fiasco bonus by ID
 */
export function getFiascoBonus(id: string): FiascoBonus | undefined {
  return fiascoBonusRegistry[id];
}

/**
 * Get all fiasco bonuses
 */
export function getAllFiascoBonuses(): FiascoBonus[] {
  return Object.values(fiascoBonusRegistry);
}

/**
 * Get fiasco bonus by event type
 */
export function getFiascoBonusByEventType(eventType: string): FiascoBonus | undefined {
  return Object.values(fiascoBonusRegistry).find((bonus) => bonus.eventType === eventType);
}

/**
 * Check if an event is a fiasco bonus trigger
 */
export function isFiascoBonus(eventType: string): boolean {
  return getFiascoBonusByEventType(eventType) !== undefined;
}
