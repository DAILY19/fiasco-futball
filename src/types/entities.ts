/**
 * Core Entity Type Definitions
 * These define the primary data models for Fiasco Futball
 */

export type GamePhase = 'LOBBY' | 'OBJECTIVES_REVEAL' | 'DRAFT' | 'PREDICTIONS' | 'MATCH' | 'RESULTS';

export type Sport = 'FOOTBALL' | 'BASKETBALL' | 'HOCKEY' | 'BASEBALL' | 'RUGBY';

export type UserRole = 'ADMIN' | 'HOST' | 'PLAYER';

/**
 * Player - Individual participant
 */
export interface Player {
  id: string;
  displayName: string;
  avatar?: string;
  createdAt: number;
  stats?: {
    gamesPlayed: number;
    totalPoints: number;
    avgPointsPerGame: number;
  };
}

/**
 * Room - Game session container
 */
export interface Room {
  id: string;
  hostId: string;
  displayName: string;
  sport: Sport;
  gameMode: string;
  phase: GamePhase;
  settings: MatchSettings;
  roomCode: string; // Short code for joining (e.g., "ABCD")
  players: RoomPlayer[];
  createdAt: number;
  updatedAt: number;
  startedAt?: number;
  endedAt?: number;
  isActive: boolean;
  maxPlayers: number;
  password?: string; // Optional: for private rooms
}

/**
 * RoomPlayer - Player within a specific room
 */
export interface RoomPlayer {
  playerId: string;
  displayName: string;
  joinedAt: number;
  isReady: boolean;
  role: UserRole;
  draftPicks?: string[]; // Category IDs selected during draft
  predictions?: GamePrediction[];
  finalScore?: number;
}

/**
 * MatchSettings - Configuration for a game
 */
export interface MatchSettings {
  pointsPerCorrection: number;
  pointsPerWildCard: number;
  customRules: Record<string, any>;
  houseName?: string;
  venue?: string;
  homeTeam?: string;
  awayTeam?: string;
  expectedKickoff?: number;
}

/**
 * GameState - Runtime state of the current game
 */
export interface GameState {
  roomId: string;
  phase: GamePhase;
  currentTime: number;
  matchStartTime?: number;
  matchEndTime?: number;
  events: GameEvent[];
  predictions: GamePrediction[];
  finalScores: Record<string, number>; // playerId -> score
  phaseHistory: PhaseTransition[];
}

/**
 * PhaseTransition - Track game phase changes
 */
export interface PhaseTransition {
  from: GamePhase;
  to: GamePhase;
  timestamp: number;
  triggeredBy?: string;
}

/**
 * DraftCategory - Category selected by a player during draft
 */
export interface DraftCategory {
  playerId: string;
  categoryId: string;
  selectedAt: number;
  points?: number;
}

/**
 * GameEvent - Something that happened during the match
 */
export interface GameEvent {
  id: string;
  roomId: string;
  eventDefinitionId: string; // References eventRegistry
  timestamp: number;
  affectedPlayers: string[]; // Player IDs
  description: string;
  data?: Record<string, any>;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: number;
  // Phase 4 additions
  matchPlayerId?: string; // Reference to drafted match player
  matchMinute?: number; // 0-90+ (minute of match)
}

/**
 * EventDefinition - Static definition of an event type
 */
export interface EventDefinition {
  id: string;
  displayName: string;
  description: string;
  icon: string;
  fiascoValue: number;
  category?: string;
  metadata?: {
    affectsTeam?: boolean;
    affectsPlayer?: boolean;
    requiresVerification?: boolean;
  };
}

/**
 * CategoryDefinition - Static definition of a draft category
 */
export interface CategoryDefinition {
  id: string;
  name: string;
  description: string;
  icon?: string;
  scoringTriggers: ScoringTrigger[];
  maxSelections?: number;
  sport?: Sport; // If sport-specific
}

/**
 * ScoringTrigger - Condition that awards points
 */
export interface ScoringTrigger {
  id: string;
  eventId: string; // References eventRegistry
  basePoints: number;
  multiplier?: number;
  condition?: string; // Optional: complex condition description
}

/**
 * GamePrediction - Player's guess about an event
 */
export interface GamePrediction {
  id: string;
  roomId: string;
  playerId: string;
  categoryId: string;
  eventId: string; // Predicted event
  predictedAt: number;
  confidence?: number; // 0-100
  result?: 'CORRECT' | 'INCORRECT' | 'PENDING';
  pointsAwarded?: number;
}

/**
 * ScoringRule - Scoring system configuration
 */
export interface ScoringRule {
  id: string;
  name: string;
  basePoints: number;
  multipliers?: {
    [key: string]: number;
  };
  conditions?: Record<string, any>;
  priority?: number;
}

/**
 * LeaderboardEntry - Player's standings
 */
export interface LeaderboardEntry {
  playerId: string;
  displayName: string;
  rank: number;
  totalPoints: number;
  correctPredictions: number;
  totalPredictions: number;
  accuracy: number; // percentage
  draftedCategories: string[]; // Category IDs
}

/**
 * MatchResult - Final game result
 */
export interface MatchResult {
  roomId: string;
  leaderboard: LeaderboardEntry[];
  finalizedAt: number;
  topPredictions: GamePrediction[];
  mostFiascos: RoomPlayer[];
  bestCategory: string; // Category with most points
}

/**
 * Phase 4: Objectives & Fiasco System
 */

/**
 * Objective - Secret objective assigned to players
 */
export interface Objective {
  id: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE'; // COMMON = 2 per player, RARE = 1 per player
  eventType: string; // Type of event this tracks (e.g., 'GOAL', 'ASSIST')
  points: number; // Points if objective is met
  applicablePositions?: string[]; // Optional: only applies to certain positions
  condition?: string; // Description of how to trigger
  recommendedPositions: string[]; // Positions best suited for this objective (e.g., 'FWD', 'MID', 'DEF', 'GK')
  draftHint: string; // Strategy hint for drafting (e.g., "Draft attackers who are likely to score")
}

/**
 * ObjectiveAssignment - Objective assigned to a player
 */
export interface ObjectiveAssignment {
  id: string;
  roomId: string;
  playerId: string;
  objectiveId: string;
  assignedAt: number;
  completed: boolean;
  pointsEarned: number;
  completedAt?: number;
  triggeredBy?: string; // Which match player triggered it
}

/**
 * FiascoBonus - Global bonus event
 */
export interface FiascoBonus {
  id: string;
  name: string;
  description: string;
  eventType: string; // e.g., 'OWN_GOAL', 'RED_CARD', 'MISSED_PENALTY'
  points: number;
  icon: string;
}

/**
 * FiascoBonusAwarded - Record of fiasco bonus given
 */
export interface FiascoBonusAwarded {
  id: string;
  roomId: string;
  playerId: string; // Owner of the player who triggered it
  fiascoBonusId: string;
  matchPlayerId: string; // The player who caused the fiasco
  timestamp: number;
  points: number;
}

/**
 * MatchPlayer - Player in the match pool (to be drafted)
 */
export interface MatchPlayer {
  id: string;
  name: string;
  team: string;
  position: string; // e.g., 'GK', 'DEF', 'MID', 'FWD'
  number?: number;
  jerseyColor?: string; // For display
}

/**
 * PlayerPool - Set of available match players
 */
export interface PlayerPool {
  id: string;
  roomId: string;
  matchPlayers: MatchPlayer[];
  createdAt: number;
  createdBy: string; // Commissioner ID
}

/**
 * DraftPick - One player's draft selection
 */
export interface DraftPick {
  id: string;
  roomId: string;
  playerId: string; // Room player who made the pick
  matchPlayerId: string; // Match player selected
  pickNumber: number; // 1, 2, 3, etc.
  pickedAt: number;
}

/**
 * Draft - Container for all draft picks
 */
export interface Draft {
  id: string;
  roomId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  pickOrder: string[]; // Array of room player IDs in draft order (snake)
  currentPickIndex: number;
  currentPickPlayerId?: string;
  picks: DraftPick[];
  startedAt?: number;
  completedAt?: number;
}

/**
 * Extended LeaderboardEntry with objective and fiasco breakdowns
 */
export interface ExtendedLeaderboardEntry extends LeaderboardEntry {
  objectiveScore: number;
  fiascoBonusScore: number;
  objectiveDetails?: { objectiveId: string; points: number }[];
  fiascoDetails?: { fiascoBonusId: string; points: number }[];
}
