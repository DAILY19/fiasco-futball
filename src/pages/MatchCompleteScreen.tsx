/**
 * MatchCompleteScreen
 * Final results and scoring breakdown
 * Shows winner, final leaderboard, objective completions
 */

import React, { useMemo } from 'react';
import { useGame } from '../contexts/GameContext';
import { useRoom } from '../contexts/RoomContext';
import { LeaderboardCard } from '../components/LeaderboardCard';
import { ObjectiveCard } from '../components/ObjectiveCard';
import { LeaderboardEntry } from '../types/entities';

interface MatchCompleteScreenProps {
  onResetGame?: () => void;
}

export const MatchCompleteScreen: React.FC<MatchCompleteScreenProps> = ({ onResetGame }) => {
  const { gameState } = useGame();
  const { room, currentPlayerId } = useRoom();

  // TODO: Connect to actual game state
  const leaderboard: LeaderboardEntry[] = [];
  const currentPlayerScore = 0;
  const completedObjectives = [];

  const winner = useMemo(() => leaderboard[0], [leaderboard]);

  const containerStyle: React.CSSProperties = {
    padding: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '32px',
    paddingBottom: '24px',
    borderBottom: '3px solid #FFD700',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
  };

  const winnerCardStyle: React.CSSProperties = {
    padding: '24px',
    backgroundColor: '#fff3e0',
    border: '3px solid #FFD700',
    borderRadius: '12px',
    textAlign: 'center',
    marginBottom: '24px',
  };

  const winnerIconStyle: React.CSSProperties = {
    fontSize: '48px',
    marginBottom: '12px',
  };

  const winnerNameStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: '4px',
  };

  const winnerScoreStyle: React.CSSProperties = {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#FFD700',
  };

  const sectionStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: '12px',
    letterSpacing: '0.5px',
  };

  const leaderboardStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const objectivesStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const summaryBoxStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '6px',
    marginBottom: '12px',
  };

  const summaryTitleStyle: React.CSSProperties = {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '4px',
    textTransform: 'uppercase',
  };

  const summaryValueStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  };

  const actionStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  };

  const buttonStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: variant === 'primary' ? '#1976d2' : '#e0e0e0',
    color: variant === 'primary' ? '#fff' : '#666',
  });

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  };

  return (
    <div style={containerStyle}>
      {/* Winner Header */}
      {winner && (
        <div style={headerStyle}>
          <div style={titleStyle}>🎉 Match Complete!</div>
          <div style={subtitleStyle}>Great game, everyone!</div>
        </div>
      )}

      {/* Winner Card */}
      {winner && (
        <div style={winnerCardStyle}>
          <div style={winnerIconStyle}>🥇</div>
          <div style={winnerNameStyle}>{winner.playerName}</div>
          <div style={{ ...subtitleStyle, marginBottom: '12px' }}>
            Final Score
          </div>
          <div style={winnerScoreStyle}>{winner.score}</div>
        </div>
      )}

      {/* Final Leaderboard */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Final Standings</div>
        <div style={leaderboardStyle}>
          {leaderboard.map((entry, idx) => (
            <LeaderboardCard
              key={entry.playerName}
              entry={entry}
              rank={idx + 1}
              variant="final"
              highlight={entry.playerName === winner?.playerName}
            />
          ))}
        </div>
      </div>

      {/* Your Score Breakdown */}
      {currentPlayerId && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Your Score: {currentPlayerScore}</div>
          <div style={statsGridStyle}>
            <div style={summaryBoxStyle}>
              <div style={summaryTitleStyle}>Objectives</div>
              <div style={summaryValueStyle}>{completedObjectives.length}/3</div>
            </div>
            <div style={summaryBoxStyle}>
              <div style={summaryTitleStyle}>Fiasco Bonuses</div>
              <div style={summaryValueStyle}>0</div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Objectives */}
      {completedObjectives.length > 0 && (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Completed Objectives</div>
          <div style={objectivesStyle}>
            {completedObjectives.map((obj) => (
              <ObjectiveCard
                key={obj.id}
                objective={obj}
                variant="summary"
                compact={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Key Stats */}
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Match Summary</div>
        <div style={statsGridStyle}>
          <div style={summaryBoxStyle}>
            <div style={summaryTitleStyle}>Total Events</div>
            <div style={summaryValueStyle}>0</div>
          </div>
          <div style={summaryBoxStyle}>
            <div style={summaryTitleStyle}>Highest Score</div>
            <div style={summaryValueStyle}>{winner?.score ?? 0}</div>
          </div>
          <div style={summaryBoxStyle}>
            <div style={summaryTitleStyle}>Average Score</div>
            <div style={summaryValueStyle}>
              {leaderboard.length > 0
                ? Math.round(
                    leaderboard.reduce((sum, e) => sum + e.score, 0) /
                      leaderboard.length
                  )
                : 0}
            </div>
          </div>
          <div style={summaryBoxStyle}>
            <div style={summaryTitleStyle}>Match Duration</div>
            <div style={summaryValueStyle}>90'</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={actionStyle}>
        <button
          style={buttonStyle('secondary')}
          onClick={() => {
            // Share or replay
          }}
        >
          Share
        </button>
        <button
          style={buttonStyle('primary')}
          onClick={onResetGame}
        >
          New Game
        </button>
      </div>
    </div>
  );
};
