/**
 * Player Pool Service
 * Manages the available match players for drafting
 * Commissioner enters these before draft begins
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { ApiResponse } from '../types/api';
import { PlayerPool, MatchPlayer } from '../types/entities';
import { generateId } from '../utils/codeGen';

export class PlayerPoolService {
  /**
   * Create player pool for a room
   */
  static async createPlayerPool(
    roomId: string,
    commissionerId: string,
    matchPlayers: MatchPlayer[]
  ): Promise<ApiResponse<PlayerPool>> {
    try {
      const playerPool: PlayerPool = {
        id: generateId(),
        roomId,
        matchPlayers,
        createdAt: Date.now(),
        createdBy: commissionerId,
      };

      const poolRef = doc(db, 'rooms', roomId, 'playerPool', playerPool.id);
      await setDoc(poolRef, playerPool);

      return {
        success: true,
        data: playerPool,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'CREATE_POOL_FAILED',
          message: err instanceof Error ? err.message : 'Failed to create player pool',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get player pool for a room
   */
  static async getPlayerPool(roomId: string): Promise<ApiResponse<PlayerPool>> {
    try {
      const poolsRef = collection(db, 'rooms', roomId, 'playerPool');
      const snapshot = await getDocs(poolsRef);

      if (snapshot.empty) {
        throw new Error('No player pool found');
      }

      const pool = snapshot.docs[0].data() as PlayerPool;

      return {
        success: true,
        data: pool,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_POOL_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get player pool',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get available (not yet drafted) match players
   */
  static async getAvailableMatchPlayers(
    roomId: string,
    draftedPlayerIds: string[]
  ): Promise<ApiResponse<MatchPlayer[]>> {
    try {
      const poolResult = await PlayerPoolService.getPlayerPool(roomId);

      if (!poolResult.success || !poolResult.data) {
        throw new Error('Failed to get player pool');
      }

      const available = poolResult.data.matchPlayers.filter(
        (p) => !draftedPlayerIds.includes(p.id)
      );

      return {
        success: true,
        data: available,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_AVAILABLE_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get available players',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Add match player to pool
   */
  static async addMatchPlayer(
    roomId: string,
    poolId: string,
    matchPlayer: MatchPlayer
  ): Promise<ApiResponse<MatchPlayer>> {
    try {
      const poolRef = doc(db, 'rooms', roomId, 'playerPool', poolId);
      const poolSnap = await getDoc(poolRef);

      if (!poolSnap.exists()) {
        throw new Error('Player pool not found');
      }

      const pool = poolSnap.data() as PlayerPool;

      // Check if player already exists
      if (pool.matchPlayers.some((p) => p.id === matchPlayer.id)) {
        throw new Error('Player already in pool');
      }

      pool.matchPlayers.push(matchPlayer);

      await updateDoc(poolRef, {
        matchPlayers: pool.matchPlayers,
      });

      return {
        success: true,
        data: matchPlayer,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'ADD_PLAYER_FAILED',
          message: err instanceof Error ? err.message : 'Failed to add player',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Remove match player from pool
   */
  static async removeMatchPlayer(
    roomId: string,
    poolId: string,
    matchPlayerId: string
  ): Promise<ApiResponse<void>> {
    try {
      const poolRef = doc(db, 'rooms', roomId, 'playerPool', poolId);
      const poolSnap = await getDoc(poolRef);

      if (!poolSnap.exists()) {
        throw new Error('Player pool not found');
      }

      const pool = poolSnap.data() as PlayerPool;
      pool.matchPlayers = pool.matchPlayers.filter((p) => p.id !== matchPlayerId);

      await updateDoc(poolRef, {
        matchPlayers: pool.matchPlayers,
      });

      return {
        success: true,
        data: undefined,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'REMOVE_PLAYER_FAILED',
          message: err instanceof Error ? err.message : 'Failed to remove player',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get match player by ID
   */
  static async getMatchPlayer(roomId: string, matchPlayerId: string): Promise<ApiResponse<MatchPlayer>> {
    try {
      const poolResult = await PlayerPoolService.getPlayerPool(roomId);

      if (!poolResult.success || !poolResult.data) {
        throw new Error('Failed to get player pool');
      }

      const matchPlayer = poolResult.data.matchPlayers.find((p) => p.id === matchPlayerId);

      if (!matchPlayer) {
        throw new Error('Match player not found');
      }

      return {
        success: true,
        data: matchPlayer,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_PLAYER_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get match player',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get players by position
   */
  static async getPlayersByPosition(roomId: string, position: string): Promise<ApiResponse<MatchPlayer[]>> {
    try {
      const poolResult = await PlayerPoolService.getPlayerPool(roomId);

      if (!poolResult.success || !poolResult.data) {
        throw new Error('Failed to get player pool');
      }

      const players = poolResult.data.matchPlayers.filter((p) => p.position === position);

      return {
        success: true,
        data: players,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_BY_POSITION_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get players by position',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get players by team
   */
  static async getPlayersByTeam(roomId: string, team: string): Promise<ApiResponse<MatchPlayer[]>> {
    try {
      const poolResult = await PlayerPoolService.getPlayerPool(roomId);

      if (!poolResult.success || !poolResult.data) {
        throw new Error('Failed to get player pool');
      }

      const players = poolResult.data.matchPlayers.filter((p) => p.team === team);

      return {
        success: true,
        data: players,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_BY_TEAM_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get players by team',
        },
        timestamp: Date.now(),
      };
    }
  }
}
