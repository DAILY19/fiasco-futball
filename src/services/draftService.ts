/**
 * Draft Service
 * Manages the snake draft system for player pool selection
 * Players draft match players in snake order (normal → reverse → normal)
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
import { Draft, DraftPick, RoomPlayer } from '../types/entities';
import { generateId } from '../utils/codeGen';

export class DraftService {
  /**
   * Initialize draft for a room
   * Creates the pick order (snake order)
   */
  static async initializeDraft(roomId: string, players: RoomPlayer[]): Promise<ApiResponse<Draft>> {
    try {
      // Create snake pick order
      // Round 1: normal order
      // Round 2: reverse order
      // Round 3: normal order
      const pickOrder = DraftService.generateSnakeOrder(players.map((p) => p.playerId), 3);

      const draft: Draft = {
        id: generateId(),
        roomId,
        status: 'NOT_STARTED',
        pickOrder,
        currentPickIndex: 0,
        currentPickPlayerId: pickOrder[0],
        picks: [],
        startedAt: undefined,
        completedAt: undefined,
      };

      const draftRef = doc(db, 'rooms', roomId, 'draft', draft.id);
      await setDoc(draftRef, draft);

      return {
        success: true,
        data: draft,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'DRAFT_INIT_FAILED',
          message: err instanceof Error ? err.message : 'Failed to initialize draft',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Generate snake draft pick order
   * For 3 players picking 3 times each:
   * Picks 1-3: [P1, P2, P3]
   * Picks 4-6: [P3, P2, P1]
   * Picks 7-9: [P1, P2, P3]
   */
  private static generateSnakeOrder(playerIds: string[], rounds: number): string[] {
    const order: string[] = [];

    for (let round = 0; round < rounds; round++) {
      if (round % 2 === 0) {
        // Even rounds: normal order
        order.push(...playerIds);
      } else {
        // Odd rounds: reverse order
        order.push(...[...playerIds].reverse());
      }
    }

    return order;
  }

  /**
   * Make a draft pick
   */
  static async makeDraftPick(
    roomId: string,
    draftId: string,
    playerId: string,
    matchPlayerId: string
  ): Promise<ApiResponse<DraftPick>> {
    try {
      const draftRef = doc(db, 'rooms', roomId, 'draft', draftId);
      const draftSnap = await getDoc(draftRef);

      if (!draftSnap.exists()) {
        throw new Error('Draft not found');
      }

      const draft = draftSnap.data() as Draft;

      // Validate it's this player's turn
      if (draft.currentPickPlayerId !== playerId) {
        throw new Error(`It's not ${playerId}'s turn to pick`);
      }

      // Check if match player already picked
      const alreadyPicked = draft.picks.some((p) => p.matchPlayerId === matchPlayerId);
      if (alreadyPicked) {
        throw new Error('This player has already been drafted');
      }

      const pick: DraftPick = {
        id: generateId(),
        roomId,
        playerId,
        matchPlayerId,
        pickNumber: draft.picks.length + 1,
        pickedAt: Date.now(),
      };

      // Add pick to draft
      draft.picks.push(pick);

      // Advance to next pick
      draft.currentPickIndex += 1;
      if (draft.currentPickIndex < draft.pickOrder.length) {
        draft.currentPickPlayerId = draft.pickOrder[draft.currentPickIndex];
        draft.status = 'IN_PROGRESS';
      } else {
        // Draft complete
        draft.status = 'COMPLETED';
        draft.completedAt = Date.now();
        draft.currentPickPlayerId = undefined;
      }

      await updateDoc(draftRef, {
        picks: draft.picks,
        currentPickIndex: draft.currentPickIndex,
        currentPickPlayerId: draft.currentPickPlayerId,
        status: draft.status,
        completedAt: draft.completedAt,
      });

      return {
        success: true,
        data: pick,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'DRAFT_PICK_FAILED',
          message: err instanceof Error ? err.message : 'Failed to make draft pick',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get current draft
   */
  static async getDraft(roomId: string): Promise<ApiResponse<Draft>> {
    try {
      const draftsRef = collection(db, 'rooms', roomId, 'draft');
      const snapshot = await getDocs(draftsRef);

      if (snapshot.empty) {
        throw new Error('No draft found');
      }

      const draft = snapshot.docs[0].data() as Draft;

      return {
        success: true,
        data: draft,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_DRAFT_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get draft',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get player's draft picks
   */
  static async getPlayerDraftPicks(roomId: string, playerId: string): Promise<ApiResponse<DraftPick[]>> {
    try {
      const draftResult = await DraftService.getDraft(roomId);

      if (!draftResult.success || !draftResult.data) {
        throw new Error('Failed to get draft');
      }

      const picks = draftResult.data.picks.filter((p) => p.playerId === playerId);

      return {
        success: true,
        data: picks,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_PICKS_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get draft picks',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Check who is next to pick
   */
  static async getNextPicker(roomId: string): Promise<ApiResponse<string>> {
    try {
      const draftResult = await DraftService.getDraft(roomId);

      if (!draftResult.success || !draftResult.data) {
        throw new Error('Failed to get draft');
      }

      const nextPickerId = draftResult.data.currentPickPlayerId;

      if (!nextPickerId) {
        throw new Error('Draft is complete');
      }

      return {
        success: true,
        data: nextPickerId,
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_NEXT_PICKER_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get next picker',
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Get draft status
   */
  static async getDraftStatus(roomId: string): Promise<
    ApiResponse<{
      status: string;
      picksMade: number;
      totalPicks: number;
      currentPickPlayerId?: string;
    }>
  > {
    try {
      const draftResult = await DraftService.getDraft(roomId);

      if (!draftResult.success || !draftResult.data) {
        throw new Error('Failed to get draft');
      }

      const draft = draftResult.data;

      return {
        success: true,
        data: {
          status: draft.status,
          picksMade: draft.picks.length,
          totalPicks: draft.pickOrder.length,
          currentPickPlayerId: draft.currentPickPlayerId,
        },
        timestamp: Date.now(),
      };
    } catch (err) {
      return {
        success: false,
        error: {
          code: 'GET_STATUS_FAILED',
          message: err instanceof Error ? err.message : 'Failed to get draft status',
        },
        timestamp: Date.now(),
      };
    }
  }
}

