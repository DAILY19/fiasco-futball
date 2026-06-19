/**
 * PlayerSpotlight Component
 * Highlights the most interesting active player
 * Shows player, score, triggered objectives and fiascos
 * Reusable for live match and social sharing
 * 
 * Visual polish for Phase 4.8:
 * - Make hot player obvious (bright orange, large score)
 * - Owner is obvious (drafted by section)
 * - Score is prominent and easy to scan
 * - Triggered objectives are easy to read
 * - Recent events are scannable
 * - Creates table talk ("Who is [Player]?" → engagement)
 */

import React from 'react';
import { MatchPlayer } from '../types/entities';
import { ObjectiveCard } from './ObjectiveCard';
import { FiascoBonusPanel } from './FiascoBonusPanel';

interface PlayerSpotlightProps {
  player: MatchPlayer;
  draftedBy: string;
  currentScore: number;
  recentEvents?: Array<{
    description: string;
    points: number;
  }>;
  triggeredObjectives?: Array<{
    id: string;
    name: string;
    points: number;
  }>;
  triggeredFiascoBonuses?: Array<{
    id: string;
    name: string;
    points: number;
  }>;
  compact?: boolean;
}

export const PlayerSpotlight: React.FC<PlayerSpotlightProps> = ({
  player,
  draftedBy,
  currentScore,
  recentEvents = [],
  triggeredObjectives = [],
  triggeredFiascoBonuses = [],
  compact = false,
}) => {
  const containerStyle: React.CSSProperties = {
    padding: compact ? '12px' : '16px',
    backgroundColor: '#fff3e0',
    border: '3px solid #FF6F00',
    borderRadius: '8px',
    marginBottom: '16px',
    boxShadow: '0 4px 12px rgba(255, 111, 0, 0.15)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: compact ? '13px' : '14px',
    fontWeight: '700',
    marginBottom: compact ? '10px' : '12px',
    color: '#E65100',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const playerHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
    paddingBottom: compact ? '10px' : '14px',
    borderBottom: '2px solid #FFD699',
    marginBottom: compact ? '10px' : '14px',
  };

  const playerInfoStyle: React.CSSProperties = {
    flex: 1,
  };

  const playerNameStyle: React.CSSProperties = {
    fontSize: compact ? '18px' : '24px',
    fontWeight: '700',
    color: '#E65100',
    marginBottom: '4px',
    lineHeight: '1.2',
  };

  const playerMetaStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    fontSize: compact ? '11px' : '12px',
    marginBottom: compact ? '6px' : '8px',
  };

  // Position-specific color coding for meta badges
  const getPositionColor = (position: string): { bg: string; text: string } => {
    const colors: Record<string, { bg: string; text: string }> = {
      'GK': { bg: '#c8e6c9', text: '#2e7d32' },
      'DEF': { bg: '#bbdefb', text: '#1565c0' },
      'MID': { bg: '#ffe0b2', text: '#e65100' },
      'FWD': { bg: '#ffcdd2', text: '#c62828' },
    };
    return colors[position] || { bg: '#e0e0e0', text: '#666' };
  };

  const metaBadgeStyle = (position?: string): React.CSSProperties => {
    const posColor = position ? getPositionColor(position) : { bg: '#FFE0B2', text: '#E65100' };
    return {
      display: 'inline-block',
      padding: '3px 8px',
      backgroundColor: posColor.bg,
      color: posColor.text,
      borderRadius: '4px',
      fontWeight: '600',
      fontSize: compact ? '10px' : '11px',
    };
  };

  const ownedByStyle: React.CSSProperties = {
    fontSize: compact ? '11px' : '12px',
    color: '#999',
    marginTop: '4px',
    fontStyle: 'italic',
  };

  const scoreDisplayStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '2px',
    backgroundColor: '#FFD699',
    borderRadius: '8px',
    padding: compact ? '12px' : '16px',
    minWidth: compact ? '60px' : '80px',
    boxShadow: '0 2px 8px rgba(255, 111, 0, 0.2)',
  };

  const scoreValueStyle: React.CSSProperties = {
    fontSize: compact ? '20px' : '32px',
    fontWeight: '700',
    color: '#E65100',
    lineHeight: '1',
  };

  const scoreTextStyle: React.CSSProperties = {
    fontSize: compact ? '10px' : '11px',
    color: '#D84315',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  };

  const contentSectionStyle: React.CSSProperties = {
    marginBottom: compact ? '10px' : '14px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: compact ? '11px' : '12px',
    fontWeight: '700',
    color: '#D84315',
    marginBottom: compact ? '6px' : '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  };

  const eventListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? '6px' : '8px',
  };

  const eventItemStyle: React.CSSProperties = {
    padding: compact ? '6px 10px' : '8px 12px',
    backgroundColor: '#FFF8E1',
    borderLeft: '3px solid #FF6F00',
    fontSize: compact ? '12px' : '13px',
    color: '#333',
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const eventNameStyle: React.CSSProperties = {
    flex: 1,
  };

  const eventPointsStyle: React.CSSProperties = {
    fontWeight: '700',
    color: '#E65100',
    whiteSpace: 'nowrap',
    marginLeft: '8px',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <span style={{ fontSize: '18px' }}>⭐</span>
        <span>HOT PLAYER</span>
      </div>

      {/* Player Info with Score */}
      <div style={playerHeaderStyle}>
        <div style={playerInfoStyle}>
          <div style={playerNameStyle}>{player.name}</div>
          <div style={playerMetaStyle}>
            {player.team && (
              <span style={metaBadgeStyle()}>{player.team}</span>
            )}
            {player.position && (
              <span style={metaBadgeStyle(player.position)}>{player.position}</span>
            )}
            {player.number && (
              <span style={metaBadgeStyle()}>#{player.number}</span>
            )}
          </div>
          <div style={ownedByStyle}>
            👤 {draftedBy}
          </div>
        </div>
        <div style={scoreDisplayStyle}>
          <div style={scoreValueStyle}>{currentScore}</div>
          <div style={scoreTextStyle}>PTS</div>
        </div>
      </div>

      {/* Triggered Objectives */}
      {triggeredObjectives.length > 0 && (
        <div style={contentSectionStyle}>
          <div style={sectionTitleStyle}>✓ Triggered Objectives</div>
          <div style={eventListStyle}>
            {triggeredObjectives.map((obj) => (
              <div key={obj.id} style={eventItemStyle}>
                <span style={eventNameStyle}>{obj.name}</span>
                <span style={eventPointsStyle}>+{obj.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Triggered Fiasco Bonuses */}
      {triggeredFiascoBonuses.length > 0 && (
        <div style={contentSectionStyle}>
          <div style={sectionTitleStyle}>🔥 Fiasco Bonuses</div>
          <div style={eventListStyle}>
            {triggeredFiascoBonuses.map((bonus) => (
              <div key={bonus.id} style={eventItemStyle}>
                <span style={eventNameStyle}>{bonus.name}</span>
                <span style={eventPointsStyle}>+{bonus.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && !compact && (
        <div style={contentSectionStyle}>
          <div style={sectionTitleStyle}>Recent Events</div>
          <div style={eventListStyle}>
            {recentEvents.slice(0, 3).map((event, idx) => (
              <div key={idx} style={eventItemStyle}>
                <span style={eventNameStyle}>{event.description}</span>
                <span style={eventPointsStyle}>+{event.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
