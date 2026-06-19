/**
 * API Request/Response Types
 * Types for service layer communication
 */

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Room Operations
export interface CreateRoomRequest {
  displayName: string;
  sport: string;
  gameMode: string;
  settings: Record<string, any>;
  maxPlayers?: number;
  password?: string;
}

export interface JoinRoomRequest {
  playerId: string;
  displayName: string;
  password?: string;
}

// Game Operations
export interface StartGameRequest {
  roomId: string;
  draftDuration?: number;
  predictionDuration?: number;
}

export interface RecordEventRequest {
  roomId: string;
  eventDefinitionId: string;
  timestamp: number;
  affectedPlayers?: string[];
  data?: Record<string, any>;
  // Phase 4 additions
  matchPlayerId?: string; // Drafted player who triggered the event
  matchMinute?: number; // Minute of match when event occurred
}

export interface MakePredictionRequest {
  roomId: string;
  playerId: string;
  categoryId: string;
  eventId: string;
  confidence?: number;
}

export interface VerifyEventRequest {
  eventId: string;
  verified: boolean;
  verifiedBy: string;
}

// Batch Operations
export interface BatchEventRequest {
  roomId: string;
  events: Array<{
    eventDefinitionId: string;
    timestamp: number;
    affectedPlayers?: string[];
    data?: Record<string, any>;
  }>;
}
