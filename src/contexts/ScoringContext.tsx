/**
 * ScoringContext Provider
 * Manages scoring state and leaderboard
 */

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { LeaderboardEntry, GamePrediction } from '../types/entities';
import { ScoreService } from '../services/scoreService';

interface ScoringContextType {
  // State
  leaderboard: LeaderboardEntry[];
  playerScores: Record<string, number>;
  predictions: GamePrediction[];
  isLoading: boolean;
  error: string | null;

  // Score management
  getPlayerScore: (playerId: string) => number;
  getPlayerRank: (playerId: string) => number;
  getLeaderboard: () => LeaderboardEntry[];
  getPlayerPredictions: (playerId: string) => GamePrediction[];

  // Stats
  getTopPlayer: () => LeaderboardEntry | undefined;
  getAccuracy: (playerId: string) => number;
  getTotalPoints: () => number;

  // Updates
  refreshLeaderboard: () => Promise<void>;
  refreshPredictions: (roomId: string) => Promise<void>;

  // Utility
  clearError: () => void;
}

const ScoringContext = createContext<ScoringContextType | undefined>(undefined);

/**
 * ScoringProvider Component
 * Wraps application with scoring state management
 */
export const ScoringProvider: React.FC<{ children: ReactNode; roomId: string }> = ({
  children,
  roomId,
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerScores, setPlayerScores] = useState<Record<string, number>>({});
  const [predictions, setPredictions] = useState<GamePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPlayerScore = (playerId: string): number => {
    return playerScores[playerId] || 0;
  };

  const getPlayerRank = (playerId: string): number => {
    const entry = leaderboard.find((e) => e.playerId === playerId);
    return entry ? entry.rank : 0;
  };

  const getLeaderboard = (): LeaderboardEntry[] => {
    return [...leaderboard].sort((a, b) => a.rank - b.rank);
  };

  const getPlayerPredictions = (playerId: string): GamePrediction[] => {
    return predictions.filter((p) => p.playerId === playerId);
  };

  const getTopPlayer = (): LeaderboardEntry | undefined => {
    return leaderboard.length > 0 ? leaderboard[0] : undefined;
  };

  const getAccuracy = (playerId: string): number => {
    const entry = leaderboard.find((e) => e.playerId === playerId);
    return entry ? entry.accuracy : 0;
  };

  const getTotalPoints = (): number => {
    return Object.values(playerScores).reduce((sum, score) => sum + score, 0);
  };

  const refreshLeaderboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await ScoreService.generateLeaderboard(roomId);
      if (result.success && result.data) {
        setLeaderboard(result.data);
        // Build player scores map
        const scores: Record<string, number> = {};
        result.data.forEach((entry) => {
          scores[entry.playerId] = entry.totalPoints;
        });
        setPlayerScores(scores);
      } else {
        throw new Error(result.error?.message || 'Failed to generate leaderboard');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);

  const refreshPredictions = async (roomId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Call PredictionService.getRoomPredictions()
      // For now, predictions are empty in vertical slice
      setPredictions([]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Refresh leaderboard on mount
  useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);

  const value: ScoringContextType = {
    leaderboard,
    playerScores,
    predictions,
    isLoading,
    error,
    getPlayerScore,
    getPlayerRank,
    getLeaderboard,
    getPlayerPredictions,
    getTopPlayer,
    getAccuracy,
    getTotalPoints,
    refreshLeaderboard,
    refreshPredictions,
    clearError,
  };

  return <ScoringContext.Provider value={value}>{children}</ScoringContext.Provider>;
};

/**
 * Hook to use ScoringContext
 */
export const useScoring = (): ScoringContextType => {
  const context = useContext(ScoringContext);
  if (!context) {
    throw new Error('useScoring must be used within ScoringProvider');
  }
  return context;
};
