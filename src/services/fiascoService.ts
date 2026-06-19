/**
 * Fiasco Service
 * Core game logic and phase transitions
 * Phase 4: Handles draft initialization and objective assignment
 */

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, getCurrentUserId } from './firebase';
import { GameState, Room, GamePhase, ApiResponse, PhaseTransition } from '../types/entities';
import { getCurrentTimestamp } from '../utils/codeGen';
import { ScoreService } from './scoreService';
import { ObjectiveService } from './objectiveService';
import { DraftService } from './draftService';

const ROOMS_COLLECTION = 'rooms';

export class FiascoService {
  /**
   * Get current game state
   */
  static async getGameState(roomId: string): Promise<ApiResponse<Partial<GameState>>> {
    try {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;

      return {
        success: true,
        data: {
          roomId,
          phase: room.phase,
          currentTime: getCurrentTimestamp(),
          matchStartTime: room.startedAt,
          matchEndTime: room.endedAt,
          events: [], // Will be populated by real-time listeners
          predictions: [],
          finalScores: {},
          phaseHistory: [],
        },
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_GAME_STATE_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Transition game to next phase
   */
  static async transitionPhase(
    roomId: string,
    newPhase: GamePhase
  ): Promise<ApiResponse<Room>> {
    try {
      const playerId = getCurrentUserId();
      if (!playerId) throw new Error('User not authenticated');

      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;

      // Only host can transition phases
      if (room.hostId !== playerId) {
        throw new Error('Only host can transition phases');
      }

      // Validate phase transition
      const validTransitions: Record<GamePhase, GamePhase[]> = {
        LOBBY: ['DRAFT', 'MATCH'], // Skip draft in vertical slice
        DRAFT: ['PREDICTIONS'],
        PREDICTIONS: ['MATCH'],
        MATCH: ['RESULTS'],
        RESULTS: ['LOBBY'],
      };

      if (!validTransitions[room.phase]?.includes(newPhase)) {
        throw new Error(
          `Cannot transition from ${room.phase} to ${newPhase}`
        );
      }

      // Validate all players are ready before starting draft/match
      if (newPhase === 'DRAFT' || newPhase === 'MATCH') {
        const allReady = room.players.every((p) => p.isReady);
        if (!allReady) {
          throw new Error('All players must be ready');
        }

        if (room.players.length < 2) {
          throw new Error('At least 2 players required');
        }
      }

      // Execute phase-specific logic
      if (newPhase === 'DRAFT') {
        // Initialize draft
        room.phase = 'DRAFT';
        
        // Assign random objectives to each player
        const playerIds = room.players.map((p) => p.playerId);
        await ObjectiveService.assignObjectivesToPlayers(roomId, playerIds);
        
        // Initialize snake draft
        await DraftService.initializeDraft(roomId, room.players);
        
        console.log('Draft phase started for:', roomId);
      } else if (newPhase === 'MATCH') {
        // Start match
        room.phase = 'MATCH';
        room.startedAt = getCurrentTimestamp();
      } else if (newPhase === 'RESULTS') {
        // End match and calculate final scores
        room.phase = 'RESULTS';
        room.endedAt = getCurrentTimestamp();
        
        // Cache leaderboard for results display
        await ScoreService.cacheLeaderboard(roomId);
      } else if (newPhase === 'LOBBY') {
        // Reset for new game
        room.phase = 'LOBBY';
        room.startedAt = undefined;
        room.endedAt = undefined;
        // Reset player ready states
        room.players.forEach((p) => {
          p.isReady = false;
        });
      } else {
        room.phase = newPhase;
      }

      room.updatedAt = getCurrentTimestamp();

      await updateDoc(roomRef, {
        phase: room.phase,
        startedAt: room.startedAt,
        endedAt: room.endedAt,
        players: room.players,
        updatedAt: room.updatedAt,
      });

      console.log('Phase transitioned to:', newPhase, roomId);

      return {
        success: true,
        data: room,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'TRANSITION_PHASE_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Start the match (convenience method)
   */
  static async startMatch(roomId: string): Promise<ApiResponse<Room>> {
    return FiascoService.transitionPhase(roomId, 'MATCH');
  }

  /**
   * End the match
   */
  static async endMatch(roomId: string): Promise<ApiResponse<Room>> {
    return FiascoService.transitionPhase(roomId, 'RESULTS');
  }

  /**
   * Get current phase
   */
  static async getPhase(roomId: string): Promise<ApiResponse<GamePhase>> {
    try {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;

      return {
        success: true,
        data: room.phase,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_PHASE_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Check if match is active
   */
  static async isMatchActive(roomId: string): Promise<boolean> {
    try {
      const result = await FiascoService.getPhase(roomId);
      return result.success && result.data === 'MATCH';
    } catch {
      return false;
    }
  }

  /**
   * Get match duration in seconds
   */
  static async getMatchDuration(roomId: string): Promise<number> {
    try {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        return 0;
      }

      const room = roomDoc.data() as Room;

      if (!room.startedAt) {
        return 0;
      }

      const endTime = room.endedAt || getCurrentTimestamp();
      return Math.floor((endTime - room.startedAt) / 1000);
    } catch {
      return 0;
    }
  }

  /**
   * Get game summary
   */
  static async getGameSummary(
    roomId: string
  ): Promise<
    ApiResponse<{
      roomId: string;
      phase: GamePhase;
      playerCount: number;
      totalEvents: number;
      totalPoints: number;
      duration: number;
    }>
  > {
    try {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;
      const stats = await ScoreService.getEventStatistics(roomId);
      const duration = await FiascoService.getMatchDuration(roomId);

      return {
        success: true,
        data: {
          roomId,
          phase: room.phase,
          playerCount: room.players.length,
          totalEvents: stats.success ? stats.data?.totalEvents || 0 : 0,
          totalPoints: stats.success ? stats.data?.totalPointsAwarded || 0 : 0,
          duration,
        },
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_GAME_SUMMARY_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }
}
