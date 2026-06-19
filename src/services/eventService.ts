/**
 * Event Service
 * Handles recording, retrieval, and verification of game events
 */

import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  orderBy,
} from 'firebase/firestore';
import { db, getCurrentUserId } from './firebase';
import { GameEvent, ApiResponse } from '../types/entities';
import { RecordEventRequest, BatchEventRequest, VerifyEventRequest } from '../types/api';
import { getEvent } from '../registries/eventRegistry';
import { getCurrentTimestamp, generateId } from '../utils/codeGen';

const ROOMS_COLLECTION = 'rooms';
const EVENTS_COLLECTION = 'events';

export class EventService {
  /**
   * Record a single event during the match
   */
  static async recordEvent(request: RecordEventRequest): Promise<ApiResponse<GameEvent>> {
    try {
      const eventDef = getEvent(request.eventDefinitionId);
      if (!eventDef) {
        throw new Error(`Event definition not found: ${request.eventDefinitionId}`);
      }

      const eventId = generateId();
      const now = getCurrentTimestamp();

      const gameEvent: GameEvent = {
        id: eventId,
        roomId: request.roomId,
        eventDefinitionId: request.eventDefinitionId,
        timestamp: request.timestamp,
        affectedPlayers: request.affectedPlayers || [],
        description: eventDef.displayName,
        data: request.data,
        verified: false,
        // Phase 4 additions
        matchPlayerId: request.matchPlayerId,
        matchMinute: request.matchMinute,
      };

      // Store in Firestore
      const eventsRef = collection(db, ROOMS_COLLECTION, request.roomId, EVENTS_COLLECTION);
      await setDoc(doc(eventsRef, eventId), gameEvent);

      // Add to room's event list
      const roomRef = doc(db, ROOMS_COLLECTION, request.roomId);
      await updateDoc(roomRef, {
        updatedAt: now,
      });

      console.log('Event recorded:', eventId, request.eventDefinitionId);

      return {
        success: true,
        data: gameEvent,
        timestamp: now,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'RECORD_EVENT_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Record multiple events in batch
   */
  static async recordBatchEvents(request: BatchEventRequest): Promise<ApiResponse<GameEvent[]>> {
    try {
      const events: GameEvent[] = [];

      for (const eventReq of request.events) {
        const result = await EventService.recordEvent({
          roomId: request.roomId,
          eventDefinitionId: eventReq.eventDefinitionId,
          timestamp: eventReq.timestamp,
          affectedPlayers: eventReq.affectedPlayers,
          data: eventReq.data,
        });

        if (result.success && result.data) {
          events.push(result.data);
        }
      }

      return {
        success: true,
        data: events,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'BATCH_EVENTS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get all events for a room
   */
  static async getRoomEvents(roomId: string): Promise<ApiResponse<GameEvent[]>> {
    try {
      const eventsRef = collection(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION);
      const q = query(eventsRef, orderBy('timestamp', 'asc'));
      const docs = await getDocs(q);
      const events = docs.docs.map((d) => d.data() as GameEvent);

      return {
        success: true,
        data: events,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_ROOM_EVENTS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get events affecting a specific player
   */
  static async getPlayerEvents(
    roomId: string,
    playerId: string
  ): Promise<ApiResponse<GameEvent[]>> {
    try {
      const eventsRef = collection(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION);
      const q = query(eventsRef, where('affectedPlayers', 'array-contains', playerId));
      const docs = await getDocs(q);
      const events = docs.docs.map((d) => d.data() as GameEvent);

      return {
        success: true,
        data: events,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_PLAYER_EVENTS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Verify an event
   */
  static async verifyEvent(request: VerifyEventRequest): Promise<ApiResponse<GameEvent>> {
    try {
      // In vertical slice, we don't store roomId with event, so we'll search
      // This is a limitation of the current schema - in production we'd have eventId -> roomId mapping
      throw new Error('Event verification requires roomId - use verifyEventInRoom instead');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'VERIFY_EVENT_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Verify an event (with roomId)
   */
  static async verifyEventInRoom(
    roomId: string,
    eventId: string,
    verified: boolean
  ): Promise<ApiResponse<GameEvent>> {
    try {
      const eventRef = doc(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION, eventId);
      const eventData = await (await import('firebase/firestore')).getDoc(eventRef);

      if (!eventData.exists()) {
        throw new Error('Event not found');
      }

      await updateDoc(eventRef, {
        verified,
        verifiedBy: getCurrentUserId(),
        verifiedAt: getCurrentTimestamp(),
      });

      const updated = await (await import('firebase/firestore')).getDoc(eventRef);
      return {
        success: true,
        data: updated.data() as GameEvent,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'VERIFY_EVENT_IN_ROOM_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get unverified events
   */
  static async getUnverifiedEvents(roomId: string): Promise<ApiResponse<GameEvent[]>> {
    try {
      const eventsRef = collection(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION);
      const q = query(eventsRef, where('verified', '==', false));
      const docs = await getDocs(q);
      const events = docs.docs.map((d) => d.data() as GameEvent);

      return {
        success: true,
        data: events,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_UNVERIFIED_EVENTS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get event timeline (most recent first)
   */
  static async getEventTimeline(roomId: string, limit = 20): Promise<ApiResponse<GameEvent[]>> {
    try {
      const eventsRef = collection(db, ROOMS_COLLECTION, roomId, EVENTS_COLLECTION);
      const q = query(eventsRef, orderBy('timestamp', 'desc'));
      const docs = await getDocs(q);
      const events = docs.docs.map((d) => d.data() as GameEvent).slice(0, limit);

      return {
        success: true,
        data: events,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_EVENT_TIMELINE_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }
}
