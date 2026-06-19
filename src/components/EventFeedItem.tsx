/**
 * EventFeedItem Component
 * Displays a single event in the event feed
 * Shows what happened, who did it, and what was triggered
 * 
 * Visual polish for Phase 4.8:
 * - Event type is immediately recognizable (icon + color)
 * - Player is clear and prominent
 * - Points awarded are obvious
 * - Triggered objectives/Fiascos are visible
 * - Recent high-value events feel exciting
 * - Icons help with quick scanning
 */

import React from 'react';
import { GameEvent } from '../types/entities';

interface EventFeedItemProps {
  event: GameEvent;
  playerName?: string;
  pointsAwarded?: number;
  triggeredObjectives?: Array<{ name: string; points: number }>;
  triggeredFiascoBonuses?: Array<{ name: string; points: number }>;
  variant?: 'feed' | 'compact' | 'scoringDetail';
  showTimestamp?: boolean;
  eventType?: string; // 'goal' | 'assist' | 'card' | 'save' | 'owngoal' | 'missedpenalty'
}

// Get event icon and color based on type
const getEventStyle = (eventType?: string): { icon: string; color: string; bgColor: string } => {
  switch (eventType?.toLowerCase()) {
    case 'goal':
      return { icon: '⚽', color: '#4CAF50', bgColor: '#e8f5e9' };
    case 'assist':
      return { icon: '🎯', color: '#2196F3', bgColor: '#e3f2fd' };
    case 'yellowcard':
      return { icon: '🟨', color: '#FBC02D', bgColor: '#fff9e6' };
    case 'redcard':
      return { icon: '🟥', color: '#D32F2F', bgColor: '#ffebee' };
    case 'save':
      return { icon: '🧤', color: '#FF9800', bgColor: '#fff3e0' };
    case 'owngoal':
      return { icon: '💣', color: '#D32F2F', bgColor: '#ffebee' };
    case 'missedpenalty':
      return { icon: '❌', color: '#D32F2F', bgColor: '#ffebee' };
    default:
      return { icon: '•', color: '#999', bgColor: '#f5f5f5' };
  }
};

export const EventFeedItem: React.FC<EventFeedItemProps> = ({
  event,
  playerName = 'Unknown',
  pointsAwarded = 0,
  triggeredObjectives = [],
  triggeredFiascoBonuses = [],
  variant = 'feed',
  showTimestamp = true,
  eventType,
}) => {
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatMatchMinute = (minute?: number) => {
    if (!minute) return '';
    return `${minute}'`;
  };

  const eventStyle = getEventStyle(eventType);

  // High-value events get extra visual emphasis
  const isHighValue = pointsAwarded > 20;
  const hasTriggered = triggeredObjectives.length > 0 || triggeredFiascoBonuses.length > 0;

  const baseStyle: React.CSSProperties = {
    padding: variant === 'compact' ? '10px 12px' : '12px 14px',
    borderRadius: '6px',
    border: `2px solid ${isHighValue ? eventStyle.color : '#e0e0e0'}`,
    backgroundColor: eventStyle.bgColor,
    marginBottom: '8px',
    boxShadow: isHighValue ? `0 2px 8px ${eventStyle.color}20` : '0 1px 2px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease',
  };

  const compactStyle: React.CSSProperties = {
    ...baseStyle,
    padding: '8px 12px',
    fontSize: '12px',
  };

  const feedStyle: React.CSSProperties = {
    ...baseStyle,
    padding: '12px 14px',
    fontSize: '13px',
  };

  const detailStyle: React.CSSProperties = {
    ...baseStyle,
    padding: '16px',
    fontSize: '14px',
    backgroundColor: eventStyle.bgColor,
  };

  const getCurrentStyle = () => {
    switch (variant) {
      case 'compact':
        return compactStyle;
      case 'scoringDetail':
        return detailStyle;
      default:
        return feedStyle;
    }
  };

  const iconStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '16px' : '18px',
    marginRight: '8px',
    display: 'inline-block',
    minWidth: '20px',
    textAlign: 'center',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '8px',
    marginBottom: variant === 'feed' && hasTriggered ? '10px' : '0',
  };

  const eventDescriptionStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '12px' : '13px',
    fontWeight: isHighValue ? '700' : '600',
    flex: 1,
    color: '#333',
  };

  const playerNameStyle: React.CSSProperties = {
    fontWeight: '700',
    color: eventStyle.color,
  };

  const timeStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '10px' : '11px',
    color: '#999',
    whiteSpace: 'nowrap',
    opacity: 0.8,
  };

  const pointsBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 10px',
    backgroundColor: isHighValue ? eventStyle.color : '#e0e0e0',
    color: isHighValue ? '#fff' : '#666',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  };

  const triggeredBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#c8e6c9',
    color: '#2e7d32',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  };

  const fiascoBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#FFE082',
    color: '#E65100',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  };

  const listStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '10px',
    paddingLeft: '12px',
    borderLeft: `3px solid ${eventStyle.color}`,
  };

  const itemStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#333',
    fontWeight: '500',
  };

  if (variant === 'compact') {
    return (
      <div style={getCurrentStyle()}>
        <div style={headerStyle}>
          <div style={eventDescriptionStyle}>
            <span style={iconStyle}>{eventStyle.icon}</span>
            <span style={playerNameStyle}>{playerName}</span>
            <span> {event.description}</span>
          </div>
          {showTimestamp && <div style={timeStyle}>{formatMatchMinute(event.matchMinute)}</div>}
        </div>
        {pointsAwarded > 0 && (
          <div style={{ marginTop: '6px' }}>
            <span style={pointsBadgeStyle}>+{pointsAwarded}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={getCurrentStyle()}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={eventDescriptionStyle}>
          <span style={iconStyle}>{eventStyle.icon}</span>
          <span style={playerNameStyle}>{playerName}</span> {event.description}
          {event.matchMinute && <span style={{ color: '#999', marginLeft: '4px', fontSize: '12px' }}>({formatMatchMinute(event.matchMinute)})</span>}
        </div>
        {showTimestamp && <div style={timeStyle}>{formatTime(event.timestamp)}</div>}
      </div>

      {/* Points and Triggers */}
      {variant === 'feed' && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: hasTriggered ? '10px' : '0' }}>
          {pointsAwarded > 0 && (
            <span style={pointsBadgeStyle}>+{pointsAwarded}</span>
          )}
          {triggeredObjectives.length > 0 && (
            <span style={triggeredBadgeStyle}>
              ✓ {triggeredObjectives.length} objective
              {triggeredObjectives.length !== 1 ? 's' : ''}
            </span>
          )}
          {triggeredFiascoBonuses.length > 0 && (
            <span style={fiascoBadgeStyle}>
              🔥 {triggeredFiascoBonuses.length} fiasco
              {triggeredFiascoBonuses.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      {/* Detail View */}
      {variant === 'scoringDetail' && (
        <>
          {pointsAwarded > 0 && (
            <div style={{ marginTop: '12px' }}>
              <span style={pointsBadgeStyle}>Total: +{pointsAwarded}</span>
            </div>
          )}

          {triggeredObjectives.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontWeight: '700', marginBottom: '8px', color: '#333', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>✓ Objectives Triggered:</div>
              <div style={listStyle}>
                {triggeredObjectives.map((obj, idx) => (
                  <div key={idx} style={itemStyle}>
                    {obj.name} <span style={{ fontWeight: '700', color: '#4CAF50' }}>+{obj.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {triggeredFiascoBonuses.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <div style={{ fontWeight: '700', marginBottom: '8px', color: '#333', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>🔥 Fiasco Bonuses:</div>
              <div style={listStyle}>
                {triggeredFiascoBonuses.map((bonus, idx) => (
                  <div key={idx} style={itemStyle}>
                    {bonus.name} <span style={{ fontWeight: '700', color: '#E65100' }}>+{bonus.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
