/**
 * Room Service
 * Handles room creation, management, and player operations
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { db, getCurrentUserId } from './firebase';
import { Room, RoomPlayer, ApiResponse } from '../types/entities';
import { CreateRoomRequest, JoinRoomRequest } from '../types/api';
import { generateRoomCode, getCurrentTimestamp } from '../utils/codeGen';

const ROOMS_COLLECTION = 'rooms';
const MAX_PLAYERS = 8;

export class RoomService {
  /**
   * Create a new game room
   */
  static async createRoom(request: CreateRoomRequest): Promise<ApiResponse<Room>> {
    try {
      const hostId = getCurrentUserId();
      if (!hostId) throw new Error('User not authenticated');

      const roomCode = generateRoomCode();
      const now = getCurrentTimestamp();

      // Check if room code already exists (very unlikely but check)
      const existingQuery = query(
        collection(db, ROOMS_COLLECTION),
        where('roomCode', '==', roomCode)
      );
      const existingDocs = await getDocs(existingQuery);
      if (!existingDocs.empty) {
        return RoomService.createRoom(request); // Retry with new code
      }

      // Create room document
      const roomRef = doc(collection(db, ROOMS_COLLECTION));
      const newRoom: Room = {
        id: roomRef.id,
        hostId,
        displayName: request.displayName,
        sport: request.sport,
        gameMode: request.gameMode,
        phase: 'LOBBY',
        settings: request.settings,
        roomCode, // Short code for joining
        players: [
          {
            playerId: hostId,
            displayName: `Host ${Math.random().toString(36).substr(2, 5)}`,
            joinedAt: now,
            isReady: false,
            role: 'HOST',
          },
        ],
        createdAt: now,
        updatedAt: now,
        isActive: true,
        maxPlayers: request.maxPlayers || MAX_PLAYERS,
        password: request.password,
      };

      await setDoc(roomRef, newRoom);
      console.log('Room created:', roomRef.id, 'Code:', roomCode);

      return {
        success: true,
        data: newRoom,
        timestamp: now,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'CREATE_ROOM_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get a room by ID
   */
  static async getRoom(roomId: string): Promise<ApiResponse<Room>> {
    try {
      const roomDoc = await getDoc(doc(db, ROOMS_COLLECTION, roomId));
      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      return {
        success: true,
        data: roomDoc.data() as Room,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'GET_ROOM_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Get a room by room code
   */
  static async getRoomByCode(roomCode: string): Promise<ApiResponse<Room>> {
    try {
      const q = query(
        collection(db, ROOMS_COLLECTION),
        where('roomCode', '==', roomCode.toUpperCase())
      );
      const docs = await getDocs(q);

      if (docs.empty) {
        throw new Error('Room not found with that code');
      }

      const room = docs.docs[0].data() as Room;
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
          code: 'GET_ROOM_BY_CODE_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Join an existing room
   */
  static async joinRoom(
    roomId: string,
    request: JoinRoomRequest
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

      // Validation
      if (!room.isActive) {
        throw new Error('Room is not active');
      }

      if (room.players.length >= room.maxPlayers) {
        throw new Error('Room is full');
      }

      if (room.password && room.password !== request.password) {
        throw new Error('Invalid room password');
      }

      // Check if player already in room
      if (room.players.some((p) => p.playerId === playerId)) {
        throw new Error('Player already in room');
      }

      // Add player to room
      const newPlayer: RoomPlayer = {
        playerId,
        displayName: request.displayName,
        joinedAt: getCurrentTimestamp(),
        isReady: false,
        role: 'PLAYER',
      };

      await updateDoc(roomRef, {
        players: arrayUnion(newPlayer),
        updatedAt: getCurrentTimestamp(),
      });

      // Fetch updated room
      const updatedRoom = await getDoc(roomRef);
      console.log('Player joined room:', playerId, roomId);

      return {
        success: true,
        data: updatedRoom.data() as Room,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'JOIN_ROOM_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Remove player from room
   */
  static async leaveRoom(roomId: string): Promise<ApiResponse<void>> {
    try {
      const playerId = getCurrentUserId();
      if (!playerId) throw new Error('User not authenticated');

      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;
      const playerToRemove = room.players.find((p) => p.playerId === playerId);

      if (!playerToRemove) {
        throw new Error('Player not in room');
      }

      // If host leaves, close room
      if (room.hostId === playerId) {
        await deleteDoc(roomRef);
        console.log('Room closed by host leaving');
        return {
          success: true,
          timestamp: getCurrentTimestamp(),
        };
      }

      // Remove player
      await updateDoc(roomRef, {
        players: arrayRemove(playerToRemove),
        updatedAt: getCurrentTimestamp(),
      });

      console.log('Player left room:', playerId, roomId);
      return {
        success: true,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'LEAVE_ROOM_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * List active rooms
   */
  static async listActiveRooms(sport?: string): Promise<ApiResponse<Room[]>> {
    try {
      let q;
      if (sport) {
        q = query(
          collection(db, ROOMS_COLLECTION),
          where('isActive', '==', true),
          where('sport', '==', sport)
        );
      } else {
        q = query(collection(db, ROOMS_COLLECTION), where('isActive', '==', true));
      }

      const docs = await getDocs(q);
      const rooms = docs.docs.map((d) => d.data() as Room);

      return {
        success: true,
        data: rooms,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'LIST_ROOMS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Mark player as ready
   */
  static async setPlayerReady(
    roomId: string,
    isReady: boolean
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
      const playerIndex = room.players.findIndex((p) => p.playerId === playerId);

      if (playerIndex === -1) {
        throw new Error('Player not in room');
      }

      // Update player's ready status
      room.players[playerIndex].isReady = isReady;

      await updateDoc(roomRef, {
        players: room.players,
        updatedAt: getCurrentTimestamp(),
      });

      const updatedDoc = await getDoc(roomRef);
      console.log('Player ready status updated:', playerId, isReady);

      return {
        success: true,
        data: updatedDoc.data() as Room,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'SET_READY_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Update room settings (host only)
   */
  static async updateRoomSettings(
    roomId: string,
    settings: Record<string, any>
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

      if (room.hostId !== playerId) {
        throw new Error('Only host can update settings');
      }

      await updateDoc(roomRef, {
        settings: { ...room.settings, ...settings },
        updatedAt: getCurrentTimestamp(),
      });

      const updatedDoc = await getDoc(roomRef);
      return {
        success: true,
        data: updatedDoc.data() as Room,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'UPDATE_SETTINGS_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Kick player from room (host only)
   */
  static async kickPlayer(
    roomId: string,
    kickedPlayerId: string
  ): Promise<ApiResponse<Room>> {
    try {
      const hostId = getCurrentUserId();
      if (!hostId) throw new Error('User not authenticated');

      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;

      if (room.hostId !== hostId) {
        throw new Error('Only host can kick players');
      }

      const playerToKick = room.players.find((p) => p.playerId === kickedPlayerId);

      if (!playerToKick) {
        throw new Error('Player not in room');
      }

      await updateDoc(roomRef, {
        players: arrayRemove(playerToKick),
        updatedAt: getCurrentTimestamp(),
      });

      const updatedDoc = await getDoc(roomRef);
      return {
        success: true,
        data: updatedDoc.data() as Room,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'KICK_PLAYER_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }

  /**
   * Close room
   */
  static async closeRoom(roomId: string): Promise<ApiResponse<void>> {
    try {
      const playerId = getCurrentUserId();
      if (!playerId) throw new Error('User not authenticated');

      const roomRef = doc(db, ROOMS_COLLECTION, roomId);
      const roomDoc = await getDoc(roomRef);

      if (!roomDoc.exists()) {
        throw new Error('Room not found');
      }

      const room = roomDoc.data() as Room;

      if (room.hostId !== playerId) {
        throw new Error('Only host can close room');
      }

      await updateDoc(roomRef, {
        isActive: false,
        updatedAt: getCurrentTimestamp(),
      });

      return {
        success: true,
        timestamp: getCurrentTimestamp(),
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: {
          code: 'CLOSE_ROOM_FAILED',
          message,
        },
        timestamp: getCurrentTimestamp(),
      };
    }
  }
}
