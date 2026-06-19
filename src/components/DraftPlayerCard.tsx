/**
 * DraftPlayerCard Component
 * Displays draftable match player with selection state
 * Large touch-friendly for mobile
 * 
 * Visual polish for Phase 4.8:
 * - Better position color coding (GK/DEF/MID/FWD have distinct colors)
 * - Improved recommended player indication
 * - Clearer drafted/unavailable state
 * - Better visual hierarchy (name > position > team)
 * - Minimum 48px touch target height
 */

import React from 'react';
import { MatchPlayer } from '../types/entities';

interface DraftPlayerCardProps {
  player: MatchPlayer;
  isSelected?: boolean;
  isRecommended?: boolean;
  isDrafted?: boolean;
  draftedBy?: string;
  onSelect?: () => void;
  variant?: 'available' | 'selected' | 'drafted' | 'compact';
}

// Position-specific color coding
const getPositionColor = (position: string): { bg: string; text: string } => {
  const colors: Record<string, { bg: string; text: string }> = {
    'GK': { bg: '#c8e6c9', text: '#2e7d32' },
    'DEF': { bg: '#bbdefb', text: '#1565c0' },
    'MID': { bg: '#ffe0b2', text: '#e65100' },
    'FWD': { bg: '#ffcdd2', text: '#c62828' },
  };
  return colors[position] || { bg: '#e0e0e0', text: '#666' };
};

export const DraftPlayerCard: React.FC<DraftPlayerCardProps> = ({
  player,
  isSelected = false,
  isRecommended = false,
  isDrafted = false,
  draftedBy,
  onSelect,
  variant = 'available',
}) => {
  // Calculate colors based on state
  const getBackgroundColor = () => {
    if (isDrafted) return '#fafafa';
    if (isSelected) return '#e3f2fd';
    if (isRecommended) return '#f0f4ff';
    return '#fff';
  };

  const getBorderColor = () => {
    if (isDrafted) return '#d0d0d0';
    if (isSelected) return '#1976d2';
    if (isRecommended) return '#4CAF50';
    return '#e0e0e0';
  };

  const getBorderWidth = () => {
    if (isDrafted || isSelected || isRecommended) return '2px';
    return '1px';
  };

  const getOpacity = () => {
    if (isDrafted) return 0.7;
    return 1;
  };

  const baseStyle: React.CSSProperties = {
    padding: variant === 'compact' ? '12px' : '14px 16px',
    border: `${getBorderWidth()} solid ${getBorderColor()}`,
    borderRadius: '8px',
    backgroundColor: getBackgroundColor(),
    cursor: isDrafted ? 'not-allowed' : onSelect ? 'pointer' : 'default',
    userSelect: 'none',
    minHeight: variant === 'compact' ? '44px' : '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    opacity: getOpacity(),
    transition: 'all 0.2s ease',
    position: 'relative',
    boxShadow: isSelected ? '0 2px 8px rgba(25, 118, 210, 0.15)' : '0 1px 2px rgba(0,0,0,0.05)',
  };

  const leftSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
    minWidth: 0,
  };

  const playerNameStyle: React.CSSProperties = {
    fontSize: variant === 'compact' ? '14px' : '16px',
    fontWeight: '700',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: isDrafted ? '#999' : '#333',
    textDecoration: isDrafted ? 'line-through' : 'none',
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    fontSize: variant === 'compact' ? '11px' : '12px',
    color: isDrafted ? '#bbb' : '#999',
    alignItems: 'center',
  };

  // Position badge with color coding
  const positionBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '3px 8px',
    backgroundColor: getPositionColor(player.position).bg,
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: getPositionColor(player.position).text,
    whiteSpace: 'nowrap',
  };

  const teamBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 6px',
    backgroundColor: '#f0f0f0',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: '500',
    color: '#666',
    whiteSpace: 'nowrap',
  };

  const recommendedBadgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#c8e6c9',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '600',
    color: '#2e7d32',
    whiteSpace: 'nowrap',
  };

  const rightSectionStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  };

  const statusIndicatorStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
    flexShrink: 0,
  };

  const getStatusIndicator = () => {
    if (isDrafted) {
      return (
        <div 
          style={{ 
            ...statusIndicatorStyle, 
            backgroundColor: '#e0e0e0', 
            color: '#999',
            border: '1px solid #bbb'
          }}
        >
          ✓
        </div>
      );
    }
    if (isSelected) {
      return (
        <div 
          style={{ 
            ...statusIndicatorStyle, 
            backgroundColor: '#1976d2', 
            color: '#fff',
            boxShadow: '0 2px 4px rgba(25, 118, 210, 0.3)'
          }}
        >
          ✓
        </div>
      );
    }
    return null;
  };

  if (variant === 'compact') {
    return (
      <div style={baseStyle} onClick={isDrafted ? undefined : onSelect}>
        <div style={leftSectionStyle}>
          <div>
            <div style={playerNameStyle}>{player.name}</div>
            <div style={metaStyle}>
              <span style={positionBadgeStyle}>{player.position}</span>
              {player.number && <span style={teamBadgeStyle}>#{player.number}</span>}
            </div>
          </div>
        </div>
        {getStatusIndicator()}
      </div>
    );
  }

  return (
    <div style={baseStyle} onClick={isDrafted ? undefined : onSelect}>
      <div style={leftSectionStyle}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={playerNameStyle}>{player.name}</div>
          <div style={metaStyle}>
            <span style={teamBadgeStyle}>{player.team}</span>
            <span style={positionBadgeStyle}>{player.position}</span>
            {player.number && <span style={teamBadgeStyle}>#{player.number}</span>}
          </div>
        </div>
      </div>

      <div style={rightSectionStyle}>
        {isRecommended && !isDrafted && (
          <div style={recommendedBadgeStyle}>✨ Recommended</div>
        )}

        {isDrafted && draftedBy && (
          <div
            style={{
              padding: '4px 8px',
              backgroundColor: '#e0e0e0',
              borderRadius: '4px',
              fontSize: '11px',
              fontWeight: '500',
              color: '#666',
              whiteSpace: 'nowrap',
            }}
          >
            Drafted by {draftedBy}
          </div>
        )}

        {getStatusIndicator()}
      </div>
    </div>
  );
};
