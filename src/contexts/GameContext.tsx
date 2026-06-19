/**
 * GameContext Provider
 * Manages the current game state and phase
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { GameState, GamePhase, GameEvent } from '../types/entities';
import { FiascoService } from '../services/fiascoService';
import { EventService } from '../services/eventService';

interface GameContextType {
  // State
  gameState: Partial<GameState> | null;
  currentPhase: GamePhase;
  isLoading: boolean;
  error: string | null;
  events: GameEvent[];

  // Phase management
  transitionPhase: (newPhase: GamePhase) => Promise<void>;
  startMatch: () => Promise<void>;
  endMatch: () => Promise<void>;

  // Event management
  recordEvent: (eventId: string, timestamp: number, affectedPlayers?: string[]) => Promise<void>;
  getEventTimeline: () => GameEvent[];

  // Utility
  refreshGameState: () => Promise<void>;
  clearError: () => void;
  isMatchActive: () => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * GameProvider Component
 * Wraps application with game state management
 */
export const GameProvider: React.FC<{ children: ReactNode; roomId: string }> = ({
  children,
  roomId,
}) => {
  const [gameState, setGameState] = useState<Partial<GameState> | null>(null);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('LOBBY');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<GameEvent[]>([]);
  const [unsubscribeEvents, setUnsubscribeEvents] = useState<(() => void) | null>(null);

  // Subscribe to events
  const subscribeToEvents = useCallback(() => {
    try {
      const eventsRef = collection(db, 'rooms', roomId, 'events');
      const q = query(eventsRef, orderBy('timestamp', 'desc'));

      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const eventsData = snapshot.docs.map((d) => d.data() as GameEvent);
          setEvents(eventsData);
          console.log('Events updated:', eventsData.length);
        },
        (error) => {
          console.error('Error listening to events:', error);
          setError('Failed to sync events');
        }
      );

      setUnsubscribeEvents(() => unsub);
    } catch (err) {
      console.error('Failed to subscribe to events:', err);
    }
  }, [roomId]);

  // Initial load
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const result = await FiascoService.getGameState(roomId);
        if (result.success && result.data) {
          setGameState(result.data);
          setCurrentPhase(result.data.phase || 'LOBBY');
        }
      } catch (err) {
        console.error('Failed to load game state:', err);
      }
    };

    loadInitialState();
    subscribeToEvents();

    return () => {
      if (unsubscribeEvents) {
        unsubscribeEvents();
      }
    };
  }, [roomId, subscribeToEvents, unsubscribeEvents]);

  const transitionPhase = async (newPhase: GamePhase) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await FiascoService.transitionPhase(roomId, newPhase);
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to transition phase');
      }
      setCurrentPhase(newPhase);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const startMatch = async () => {
    await transitionPhase('MATCH');
  };

  const endMatch = async () => {
    await transitionPhase('RESULTS');
  };

  const recordEvent = async (
    eventId: string,
    timestamp: number,
    affectedPlayers?: string[]
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await EventService.recordEvent({
        roomId,
        eventDefinitionId: eventId,
        timestamp,
        affectedPlayers,
      });

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to record event');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getEventTimeline = () => {
    return events;
  };

  const refreshGameState = async () => {
    setIsLoading(true);
    try {
      const result = await FiascoService.getGameState(roomId);
      if (result.success && result.data) {
        setGameState(result.data);
        setCurrentPhase(result.data.phase || 'LOBBY');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const isMatchActive = () => currentPhase === 'MATCH';

  const value: GameContextType = {
    gameState,
    currentPhase,
    isLoading,
    error,
    events,
    transitionPhase,
    startMatch,
    endMatch,
    recordEvent,
    getEventTimeline,
    refreshGameState,
    clearError,
    isMatchActive,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

/**
 * Hook to use GameContext
 */
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
