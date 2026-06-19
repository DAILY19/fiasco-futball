/**
 * Score Service
 * Handles scoring calculations and leaderboard management
 * Phase 4: Objective-based scoring (80-90% of score)
 *          Fiasco bonus scoring (10-20% of score)
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { LeaderboardEntry, MatchResult, ApiResponse, Room, GameEvent, ExtendedLeaderboardEntry } from '../types/entities';
import { getEvent } from '../registries/eventRegistry';
import { getFiascoBonusByEventType } from '../registries/fiascoBonusRegistry';
import { getCurrentTimestamp, generateId } from '../utils/codeGen';
import { ObjectiveService } from './objectiveService';
import { DraftService } from './draftService';

const ROOMS_COLLECTION = 'rooms';
const EVENTS_COLLECTION = 'events';
const SCORES_COLLECTION = 'scores';

export class ScoreService {
  /**
   * Calculate objective score for a player
   * Based on their assigned objectives and drafted players
   */
  static async calculateObjectiveScore(
    roomId: string,
    playerId: string
  ): Promise<{
    objectiveScore: number;
    breakdown: { objectiveId: string; points: number }[];
  }> {
    try {
      // Get player's objectives
      const objectivesResult = await ObjectiveService.getPlayerObjectives(roomId, playerId);
      const objectives = objectivesResult.data || [];

      // Get player's draft picks
      const picksResult = await DraftService.getPlayerDraftPicks(roomId, playerId);
      const picks = picksResult.data || [];
      const draftedMatchPlayerIds = picks.map((p) => p.matchPlayerId);

      // Get all events
      const eventsRef = collection(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION);
      const docs = await getDocs(eventsRef);
      const events = docs.docs.map((d) => d.data() as GameEvent);

      // Calculate score
      let objectiveScore = 0;
      const breakdown: { objectiveId: string; points: number }[] = [];

      for (const objective of objectives) {
        for (const matchPlayerId of draftedMatchPlayerIds) {
          const { points } = ObjectiveService.checkObjectiveCompletion(
            objective.objectiveId,
            events,
            matchPlayerId
          );

          if (points > 0) {
            objectiveScore += points;
            breakdown.push({
              objectiveId: objective.objectiveId,
              points,
            });
          }
        }
      }

      return { objectiveScore, breakdown };
    } catch (err) {
      console.error('Failed to calculate objective score:', err);
      return { objectiveScore: 0, breakdown: [] };
    }
  }

  /**
   * Calculate fiasco bonus score for a player
   * Based on drafted players triggering fiasco events
   */
  static async calculateFiascoScore(
    roomId: string,
    playerId: string
  ): Promise<{
    fiascoScore: number;
    breakdown: { fiascoBonusId: string; points: number }[];
  }> {
    try {
      // Get player's draft picks
      const picksResult = await DraftService.getPlayerDraftPicks(roomId, playerId);
      const picks = picksResult.data || [];
      const draftedMatchPlayerIds = picks.map((p) => p.matchPlayerId);

      // Get all events for drafted players
      const eventsRef = collection(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION);
      const docs = await getDocs(eventsRef);
      const allEvents = docs.docs.map((d) => d.data() as GameEvent);

      const draftedPlayerEvents = allEvents.filter((e) => draftedMatchPlayerIds.includes(e.matchPlayerId || ''));

      let fiascoScore = 0;
      const breakdown: { fiascoBonusId: string; points: number }[] = [];

      // Check for fiasco bonuses
      for (const event of draftedPlayerEvents) {
        const fiascoBonus = getFiascoBonusByEventType(event.eventDefinitionId);
        if (fiascoBonus) {
          fiascoScore += fiascoBonus.points;
          breakdown.push({
            fiascoBonusId: fiascoBonus.id,
            points: fiascoBonus.points,
          });
        }
      }

      return { fiascoScore, breakdown };
    } catch (err) {
      console.error('Failed to calculate fiasco score:', err);
      return { fiascoScore: 0, breakdown: [] };
    }
  }

  /**
   * Calculate total score for a player (objectives + fiascos)
   */
  static async calculatePlayerScore(
    roomId: string,
    playerId: string
  ): Promise<
    ApiResponse<{
      totalPoints: number;
      objectiveScore: number;
      fiascoScore: number;
      breakdown: {
        objectives: { objectiveId: string; points: number }[];
        fiascoBonuses: { fiascoBonusId: string; points: number }[];
      };
    }>
  > {
    try {
      const objectiveResult = await ScoreService.calculateObjectiveScore(roomId, playerId);
      const fiascoResult = await ScoreService.calculateFiascoScore(roomId, playerId);

      return {
        success: true,
        data: {
          totalPoints: objectiveResult.objectiveScore + fiascoResult.fiascoScore,
          objectiveScore: objectiveResult.objectiveScore,
          fiascoScore: fiascoResult.fiascoScore,
          breakdown: {
            objectives: objectiveResult.breakdown,
            fiascoBonuses: fiascoResult.breakdown,
          },
        },
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'CALCULATE_PLAYER_SCORE_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Generate extended leaderboard for a room (with score breakdowns)
   */
  static async generateLeaderboard(roomId: string): Promise<ApiResponse<ExtendedLeaderboardEntry[]>> {
    try {
      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;
      const leaderboard: ExtendedLeaderboardEntry[] = [];

      // Calculate score for each player
      for (const player of room.players) {
        const scoreResult = await ScoreService.calculatePlayerScore(roomId, player.playerId);

        if (scoreResult.success && scoreResult.data) {
          const entry: ExtendedLeaderboardEntry = {
            playerId: player.playerId,
            displayName: player.displayName,
            rank: 0, // Will be set after sorting
            totalPoints: scoreResult.data.totalPoints,
            objectiveScore: scoreResult.data.objectiveScore,
            fiascoBonusScore: scoreResult.data.fiascoScore,
            correctPredictions: 0, // For future implementation
            totalPredictions: 0,
            accuracy: 0,
            draftedCategories: [], // Legacy field
            objectiveDetails: scoreResult.data.breakdown.objectives,
            fiascoDetails: scoreResult.data.breakdown.fiascoBonuses,
          };
          leaderboard.push(entry);
        }
      }

      // Sort by points descending
      leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

      // Set ranks
      leaderboard.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      return {
        success: true,
        data: leaderboard,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GENERATE_LEADERBOARD_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Cache leaderboard in Firestore for fast retrieval
   */
  static async cacheLeaderboard(roomId: string): Promise<ApiResponse<void>> {
    try {
      const leaderboardResult = await ScoreService.generateLeaderboard(roomId);

      if (!leaderboardResult.success || !leaderboardResult.data) {
        throw new Error('Failed to generate leaderboard');
      }

      // Store each player's score
      for (const entry of leaderboardResult.data) {
        const scoreRef = doc(db, ROOMS_COLLECTION, roomId, SCORES_COLLECTION, entry.playerId);
        await setDoc(scoreRef, {
          playerId: entry.playerId,
          displayName: entry.displayName,
          totalPoints: entry.totalPoints,
          objectiveScore: entry.objectiveScore,
          fiascoBonusScore: entry.fiascoBonusScore,
          rank: entry.rank,
          updatedAt: getCurrentTimestamp(),
        });
      }

      return {
        success: true,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'CACHE_LEADERBOARD_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get top players (for Fiasco Meter)
   */
  static async getTopPlayers(roomId: string, limit = 3): Promise<ApiResponse<ExtendedLeaderboardEntry[]>> {
    try {
      const result = await ScoreService.generateLeaderboard(roomId);

      if (!result.success || !result.data) {
        throw new Error('Failed to generate leaderboard');
      }

      return {
        success: true,
        data: result.data.slice(0, limit),
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_TOP_PLAYERS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get event statistics
   */
  static async getEventStatistics(roomId: string): Promise<
    ApiResponse<{
      totalEvents: number;
      eventsByType: Record<string, number>;
      totalObjectiveScore: number;
      totalFiascoScore: number;
    }>
  > {
    try {
      const eventsRef = collection(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION);
      const docs = await getDocs(eventsRef);
      const events = docs.docs.map((d) => d.data() as GameEvent);

      const eventsByType: Record<string, number> = {};
      let totalObjectiveScore = 0;
      let totalFiascoScore = 0;

      for (const event of events) {
        // Count by type
        eventsByType[event.eventDefinitionId] = (eventsByType[event.eventDefinitionId] || 0) + 1;

        // Check if it's a fiasco bonus
        const fiascoBonus = getFiascoBonusByEventType(event.eventDefinitionId);
        if (fiascoBonus) {
          totalFiascoScore += fiascoBonus.points;
        }
      }

      // Total objective score would be calculated from leaderboard
      const leaderboardResult = await ScoreService.generateLeaderboard(roomId);
      if (leaderboardResult.success && leaderboardResult.data) {
        for (const entry of leaderboardResult.data) {
          totalObjectiveScore += entry.objectiveScore;
        }
      }

      return {
        success: true,
        data: {
          totalEvents: events.length,
          eventsByType,
          totalObjectiveScore,
          totalFiascoScore,
        },
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_EVENT_STATISTICS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }
}
