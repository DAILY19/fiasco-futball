/**
 * LeaderboardCard Component
 * Single row in the leaderboard
 * Displays rank, player, score, and delta
 * 
 * Visual polish for Phase 4.8:
 * - Current rank is clear (medal emoji for top 3, number for rest)
 * - Score is prominent and easy to scan
 * - Recent score delta is visible and color-coded
 * - Winner state feels rewarding
 * - Bottom players remain readable, not shamed
 */

import React from 'react';
import { LeaderboardEntry } from '../types/entities';

interface LeaderboardCardProps {
  entry: LeaderboardEntry;
  rank: number;
  scoreDelta?: number;
  variant?: 'live' | 'compact' | 'final';
  highlight?: boolean;
}

export const LeaderboardCard: React.FC<LeaderboardCardProps> = ({
  entry,
  rank,
  scoreDelta,
  variant = 'live',
  highlight = false,
}) => {
  // Top 3 get gold/silver/bronze, others get neutral
  const getRankColors = (rank: number) => {
    switch (rank) {
      case 1:
        return { bg: '#FFD700', text: '#333', border: '#FFC107' };
      case 2:
        return { bg: '#E8E8E8', text: '#333', border: '#B0B0B0' };
      case 3:
        return { bg: '#E8D7C3', text: '#6D4C41', border: '#D2B48C' };
      default:
        return { bg: '#f5f5f5', text: '#999', border: '#e0e0e0' };
    }
  };

  const rankColors = getRankColors(rank);

  const baseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: variant === 'compact' ? '10px 12px' : '12px 16px',
    backgroundColor: highlight ? '#e8f5e9' : '#fff',
    borderLeft: highlight ? '4px solid #4CAF50' : `4px solid ${rankColors.border}`,
    borderRadius: '4px',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
    minHeight: variant === 'compact' ? '44px' : '48px',
    boxShadow: rank <= 3 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
  };

  const rankStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: variant === 'compact' ? '32px' : '40px',
    height: variant === 'compact' ? '32px' : '40px',
    borderRadius: '50%',
    backgroundColor: rankColors.bg,
    fontSize: variant === 'compact' ? '14px' : '16px',
    fontWeight: '700',
    color: rankColors.text,
    flexShrink: 0,
    border: `2px solid ${rankColors.border}`,
    boxShadow: rank <= 3 ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
  };

  const playerInfoStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const playerNameStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '13px' : '14px',
    fontWeight: '700',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: '#333',
    marginBottom: '2px',
  };

  const playerSubtextStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '10px' : '11px',
    color: '#999',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };

  const scoreStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
    flexShrink: 0,
    minWidth: 'max-content',
  };

  const scoreNumberStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '14px' : '16px',
    fontWeight: '700',
    color: '#333',
  };

  const scoreDeltaStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '10px' : '11px',
    fontWeight: '600',
    color: (scoreDelta ?? 0) > 0 ? '#4CAF50' : (scoreDelta ?? 0) < 0 ? '#D32F2F' : '#999',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  };

  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return rank;
    }
  };

  const getDeltaIndicator = (delta: number) => {
    if (delta > 0) return '↑';
    if (delta < 0) return '↓';
    return '–';
  };

  const getPlayerSubtext = () => {
    if (entry.draftedPlayers?.length === 0) return 'No players drafted';
    const playerCount = entry.draftedPlayers?.length ?? 0;
    return `${playerCount} player${playerCount !== 1 ? 's' : ''}`;
  };

  return (
    <div style={baseStyle}>
      {/* Rank Circle */}
      <div style={rankStyle}>
        {getMedalEmoji(rank)}
      </div>

      {/* Player Info */}
      <div style={playerInfoStyle}>
        <div style={playerNameStyle}>{entry.playerName}</div>
        {variant !== 'compact' && (
          <div style={playerSubtextStyle}>
            {variant === 'final' && entry.activeObjectives && (
              <>
                {entry.activeObjectives.length} active objective
                {entry.activeObjectives.length !== 1 ? 's' : ''}
              </>
            )}
            {variant === 'live' && getPlayerSubtext()}
          </div>
        )}
      </div>

      {/* Score with Delta */}
      <div style={scoreStyle}>
        <div style={scoreNumberStyle}>{entry.score}</div>
        {variant === 'live' && scoreDelta !== undefined && (
          <div style={scoreDeltaStyle}>
            <span>{getDeltaIndicator(scoreDelta)}</span>
            <span>{Math.abs(scoreDelta)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
