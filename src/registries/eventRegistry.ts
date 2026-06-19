/**
 * Event Registry
 * Centralized definition of all events that can occur during a match
 * No event data should be hardcoded elsewhere
 */

import { EventDefinition } from '../types/entities';

export const eventRegistry: Record<string, EventDefinition> = {
  // Cards
  YELLOW_CARD: {
    id: 'YELLOW_CARD',
    displayName: 'Yellow Card',
    description: 'A player receives a caution from the referee',
    icon: '🟨',
    fiascoValue: 10,
    category: 'DISCIPLINE',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  RED_CARD: {
    id: 'RED_CARD',
    displayName: 'Red Card',
    description: 'A player is sent off by the referee',
    icon: '🟥',
    fiascoValue: 30,
    category: 'DISCIPLINE',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  BENCH_CARD: {
    id: 'BENCH_CARD',
    displayName: 'Bench Card',
    description: 'Coach receives a warning or ejection',
    icon: '💺',
    fiascoValue: 15,
    category: 'DISCIPLINE',
    metadata: {
      affectsTeam: true,
      requiresVerification: true,
    },
  },

  // VAR Events
  VAR_REVIEW: {
    id: 'VAR_REVIEW',
    displayName: 'VAR Review',
    description: 'Video review initiated for controversial play',
    icon: '📹',
    fiascoValue: 8,
    category: 'CHAOS',
    metadata: {
      requiresVerification: false,
    },
  },

  VAR_OVERTURN: {
    id: 'VAR_OVERTURN',
    displayName: 'VAR Overturn',
    description: 'Original decision overturned by VAR',
    icon: '🔄',
    fiascoValue: 25,
    category: 'CHAOS',
    metadata: {
      requiresVerification: true,
    },
  },

  // Scoring Events
  OWN_GOAL: {
    id: 'OWN_GOAL',
    displayName: 'Own Goal',
    description: 'Player scores for the opposing team',
    icon: '😱',
    fiascoValue: 40,
    category: 'CHAOS',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  MISSED_PENALTY: {
    id: 'MISSED_PENALTY',
    displayName: 'Missed Penalty',
    description: 'A penalty kick fails to score',
    icon: '⚽',
    fiascoValue: 20,
    category: 'CHAOS',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  HIT_POST: {
    id: 'HIT_POST',
    displayName: 'Hit Post',
    description: 'Ball strikes the post/crossbar',
    icon: '🎯',
    fiascoValue: 5,
    category: 'EVENTS',
    metadata: {
      requiresVerification: false,
    },
  },

  LATE_GOAL: {
    id: 'LATE_GOAL',
    displayName: 'Late Goal',
    description: 'Goal scored in final 5 minutes of match',
    icon: '⏰',
    fiascoValue: 15,
    category: 'DRAMA',
    metadata: {
      requiresVerification: true,
    },
  },

  // Goalkeeper Events
  SAVE_OF_SEASON: {
    id: 'SAVE_OF_SEASON',
    displayName: 'Save of the Season',
    description: 'Exceptional goalkeeper save',
    icon: '🧤',
    fiascoValue: 12,
    category: 'EXCELLENCE',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  GOALKEEPER_BLUNDER: {
    id: 'GOALKEEPER_BLUNDER',
    displayName: 'Goalkeeper Blunder',
    description: 'Goalkeeper error leads to goal',
    icon: '😬',
    fiascoValue: 35,
    category: 'CHAOS',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  // Player Events
  HAT_TRICK: {
    id: 'HAT_TRICK',
    displayName: 'Hat Trick',
    description: 'Player scores three goals',
    icon: '🎩',
    fiascoValue: 50,
    category: 'EXCELLENCE',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  INJURY: {
    id: 'INJURY',
    displayName: 'Injury',
    description: 'Player substituted due to injury',
    icon: '🤕',
    fiascoValue: 8,
    category: 'EVENTS',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  BRACE: {
    id: 'BRACE',
    displayName: 'Brace',
    description: 'Player scores two goals',
    icon: '👟',
    fiascoValue: 30,
    category: 'EXCELLENCE',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  // Controversy
  DIVE: {
    id: 'DIVE',
    displayName: 'Dive',
    description: 'Player accused of simulation/diving',
    icon: '🏊',
    fiascoValue: 18,
    category: 'CHAOS',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  HANDBALL: {
    id: 'HANDBALL',
    displayName: 'Handball',
    description: 'Ball touches hand intentionally',
    icon: '🖐️',
    fiascoValue: 22,
    category: 'CHAOS',
    metadata: {
      affectsPlayer: true,
      requiresVerification: true,
    },
  },

  OFFSIDE: {
    id: 'OFFSIDE',
    displayName: 'Offside',
    description: 'Offside flag raised',
    icon: '📍',
    fiascoValue: 5,
    category: 'EVENTS',
    metadata: {
      requiresVerification: false,
    },
  },

  // Weather/Conditions
  WEATHER_DELAY: {
    id: 'WEATHER_DELAY',
    displayName: 'Weather Delay',
    description: 'Match delayed due to weather',
    icon: '⛈️',
    fiascoValue: 10,
    category: 'EVENTS',
    metadata: {
      requiresVerification: false,
    },
  },

  PITCH_INVASION: {
    id: 'PITCH_INVASION',
    displayName: 'Pitch Invasion',
    description: 'Unauthorized person on playing field',
    icon: '🏃',
    fiascoValue: 25,
    category: 'CHAOS',
    metadata: {
      requiresVerification: false,
    },
  },

  // Technical
  SUBSTITUTION: {
    id: 'SUBSTITUTION',
    displayName: 'Substitution',
    description: 'Player replaced',
    icon: '🔄',
    fiascoValue: 2,
    category: 'EVENTS',
    metadata: {
      affectsPlayer: true,
      requiresVerification: false,
    },
  },
};

/**
 * Get an event by ID
 */
export function getEvent(eventId: string): EventDefinition | undefined {
  return eventRegistry[eventId];
}

/**
 * Get all events for a category
 */
export function getEventsByCategory(category: string): EventDefinition[] {
  return Object.values(eventRegistry).filter(
    (event) => event.category === category
  );
}

/**
 * Get all available event IDs
 */
export function getAllEventIds(): string[] {
  return Object.keys(eventRegistry);
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  const categories = new Set<string>();
  Object.values(eventRegistry).forEach((event) => {
    if (event.category) {
      categories.add(event.category);
    }
  });
  return Array.from(categories);
}
