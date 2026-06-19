/**
 * RoomContext Provider
 * Manages room state and player information
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Room, RoomPlayer } from '../types/entities';
import { RoomService } from '../services/roomService';

interface RoomContextType {
  // State
  room: Room | null;
  players: RoomPlayer[];
  currentPlayerId: string | null;
  currentPlayerName: string | null;
  isHost: boolean;
  isLoading: boolean;
  error: string | null;

  // Room management
  createRoom: (name: string, sport: string, gameMode: string) => Promise<string>;
  joinRoom: (roomCode: string, playerName: string) => Promise<void>;
  leaveRoom: () => Promise<void>;
  updateRoomSettings: (settings: Record<string, any>) => Promise<void>;

  // Player management
  setPlayerReady: (ready: boolean) => Promise<void>;
  kickPlayer: (playerId: string) => Promise<void>;
  getPlayerCount: () => number;
  getPlayerByName: (name: string) => RoomPlayer | undefined;

  // Utility
  refreshRoom: () => Promise<void>;
  clearError: () => void;
}

const RoomContext = createContext<RoomContextType | undefined>(undefined);

/**
 * RoomProvider Component
 * Wraps application with room state management
 */
export const RoomProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string | null>(null);
  const [currentPlayerName, setCurrentPlayerName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

  const isHost = room?.hostId === currentPlayerId;

  // Subscribe to room updates
  const subscribeToRoom = useCallback((roomId: string) => {
    const roomRef = doc(db, 'rooms', roomId);
    
    const unsub = onSnapshot(
      roomRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const roomData = docSnap.data() as Room;
          setRoom(roomData);
          setPlayers(roomData.players);
          console.log('Room updated via listener:', roomId);
        }
      },
      (error) => {
        console.error('Error listening to room:', error);
        setError('Failed to sync room data');
      }
    );

    setUnsubscribe(() => unsub);
    return unsub;
  }, []);

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [unsubscribe]);

  const createRoom = async (
    name: string,
    sport: string,
    gameMode: string
  ): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await RoomService.createRoom({
        displayName: name,
        sport,
        gameMode,
        settings: {
          pointsPerCorrection: 10,
          pointsPerWildCard: 5,
          customRules: {},
        },
      });

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to create room');
      }

      setRoom(result.data);
      setPlayers(result.data.players);
      setCurrentPlayerId(result.data.hostId);
      
      // Subscribe to real-time updates
      subscribeToRoom(result.data.id);

      return result.data.id;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomCode: string, playerName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Get room by code
      const getRoomResult = await RoomService.getRoomByCode(roomCode);
      if (!getRoomResult.success || !getRoomResult.data) {
        throw new Error(getRoomResult.error?.message || 'Room not found');
      }

      const roomData = getRoomResult.data;

      // Join room
      const joinResult = await RoomService.joinRoom(roomData.id, {
        playerId: '', // Will be populated by service
        displayName: playerName,
        password: undefined,
      });

      if (!joinResult.success || !joinResult.data) {
        throw new Error(joinResult.error?.message || 'Failed to join room');
      }

      setRoom(joinResult.data);
      setPlayers(joinResult.data.players);
      setCurrentPlayerName(playerName);

      // Subscribe to real-time updates
      subscribeToRoom(joinResult.data.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const leaveRoom = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!room) throw new Error('No room loaded');

      await RoomService.leaveRoom(room.id);

      // Cleanup
      if (unsubscribe) {
        unsubscribe();
      }
      setRoom(null);
      setPlayers([]);
      setCurrentPlayerId(null);
      setCurrentPlayerName(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoomSettings = async (settings: Record<string, any>) => {
    if (!room) throw new Error('No room loaded');
    setIsLoading(true);
    setError(null);
    try {
      const result = await RoomService.updateRoomSettings(room.id, settings);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to update settings');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const setPlayerReady = async (ready: boolean) => {
    if (!room) throw new Error('No room loaded');
    setIsLoading(true);
    setError(null);
    try {
      const result = await RoomService.setPlayerReady(room.id, ready);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to set ready status');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const kickPlayer = async (playerId: string) => {
    if (!room || !isHost) throw new Error('Not authorized');
    setIsLoading(true);
    setError(null);
    try {
      const result = await RoomService.kickPlayer(room.id, playerId);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to kick player');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPlayerCount = () => players.length;

  const getPlayerByName = (name: string) => {
    return players.find((p) => p.displayName === name);
  };

  const refreshRoom = async () => {
    if (!room) return;
    setIsLoading(true);
    try {
      const result = await RoomService.getRoom(room.id);
      if (result.success && result.data) {
        setRoom(result.data);
        setPlayers(result.data.players);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value: RoomContextType = {
    room,
    players,
    currentPlayerId,
    currentPlayerName,
    isHost,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoomSettings,
    setPlayerReady,
    kickPlayer,
    getPlayerCount,
    getPlayerByName,
    refreshRoom,
    clearError,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
};

/**
 * Hook to use RoomContext
 */
export const useRoom = (): RoomContextType => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within RoomProvider');
  }
  return context;
};
