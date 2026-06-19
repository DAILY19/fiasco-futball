/**
 * ObjectiveCard Component
 * Displays a single objective with progress and draft hints
 * Reusable across reveal, draft, match, and summary screens
 * 
 * Visual polish for Phase 4.8:
 * - Better rarity distinction (rare objectives feel more exciting)
 * - Improved visual hierarchy (points, name, positions)
 * - Better mobile optimization (no cards taller than 140px)
 * - Clear state transitions (pending → completed)
 * - Accessible color coding and sizing
 */

import React from 'react';
import { Objective, ObjectiveAssignment } from '../types/entities';

interface ObjectiveCardProps {
  objective: Objective;
  assignment?: ObjectiveAssignment;
  variant?: 'reveal' | 'draft' | 'match' | 'summary';
  showProgress?: boolean;
  showDraftHint?: boolean;
  showRecommendedPositions?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  assignment,
  variant = 'reveal',
  showProgress = true,
  showDraftHint = true,
  showRecommendedPositions = true,
  compact = false,
  onClick,
}) => {
  const isCompleted = assignment?.completed ?? false;
  const pointsEarned = assignment?.pointsEarned ?? 0;
  const isRare = objective.rarity === 'RARE';

  // Improve visual hierarchy: make rare objectives feel special
  const baseStyle: React.CSSProperties = {
    padding: compact ? '12px' : '16px',
    border: isCompleted 
      ? '2px solid #4CAF50' 
      : isRare 
        ? '2px solid #FFD700'
        : '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: isCompleted 
      ? '#f1f8f4'
      : isRare
        ? '#fffef0'
        : '#fff',
    cursor: onClick ? 'pointer' : 'default',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
    boxShadow: isRare 
      ? '0 0 12px rgba(255, 215, 0, 0.3)' 
      : '0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '8px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: compact ? '14px' : '16px',
    fontWeight: '700',
    flex: 1,
    lineHeight: '1.3',
    color: '#333',
  };

  // Points badge: prominent, color-coded for rarity
  const pointsBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '52px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: isCompleted ? '#4CAF50' : isRare ? '#FFD700' : '#e8eaf6',
    fontSize: compact ? '13px' : '14px',
    fontWeight: '700',
    color: isCompleted ? '#fff' : isRare ? '#333' : '#1976d2',
    textAlign: 'center',
    flexShrink: 0,
    boxShadow: isRare ? '0 2px 4px rgba(255, 215, 0, 0.2)' : 'none',
  };

  // Rarity indicator: simple, clear
  const rarityIndicatorStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '2px 6px',
    fontSize: '11px',
    fontWeight: '600',
    borderRadius: '3px',
    backgroundColor: isRare ? '#FFD700' : '#e8eaf6',
    color: '#666',
    marginBottom: compact ? '8px' : '10px',
    lineHeight: '1.4',
  };

  const positionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: '6px',
    marginBottom: compact ? '8px' : '10px',
    flexWrap: 'wrap',
  };

  // Position badges: color-coded by position
  const positionBadgeStyle = (position: string): React.CSSProperties => {
    const positionColors: Record<string, { bg: string; text: string }> = {
      'GK': { bg: '#c8e6c9', text: '#2e7d32' },
      'DEF': { bg: '#bbdefb', text: '#1565c0' },
      'MID': { bg: '#ffe0b2', text: '#e65100' },
      'FWD': { bg: '#ffcdd2', text: '#c62828' },
    };
    const colors = positionColors[position] || { bg: '#e0e0e0', text: '#666' };
    return {
      display: 'inline-block',
      padding: '3px 8px',
      backgroundColor: colors.bg,
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: '600',
      color: colors.text,
    };
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.4',
    marginBottom: '8px',
  };

  const hintStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#999',
    fontStyle: 'italic',
    marginBottom: '8px',
    paddingLeft: '8px',
    borderLeft: '3px solid #FFC107',
    backgroundColor: '#fffef0',
    paddingTop: '6px',
    paddingBottom: '6px',
  };

  const progressBarStyle: React.CSSProperties = {
    height: '4px',
    backgroundColor: '#e0e0e0',
    borderRadius: '2px',
    overflow: 'hidden',
    marginTop: '8px',
  };

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#4CAF50',
    width: isCompleted ? '100%' : '0%',
    transition: 'width 0.3s ease',
  };

  return (
    <div style={baseStyle} onClick={onClick}>
      {/* Header with Points Badge on right */}
      <div style={headerStyle}>
        <div style={{ flex: 1 }}>
          <div style={titleStyle}>{objective.name}</div>
          {showRecommendedPositions && objective.recommendedPositions.length > 0 && (
            <div style={positionsStyle}>
              {objective.recommendedPositions.map((pos) => (
                <div key={pos} style={positionBadgeStyle(pos)}>
                  {pos}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={pointsBadgeStyle}>
          {isCompleted ? `✓ +${pointsEarned}` : `+${objective.points}`}
        </div>
      </div>

      {/* Description */}
      {objective.description && (
        <div style={descriptionStyle}>{objective.description}</div>
      )}

      {/* Rarity indicator and draft hint */}
      <div style={{ marginBottom: '10px' }}>
        <div style={rarityIndicatorStyle}>
          {isRare ? '⭐ Rare' : 'Common'}
        </div>
        {showDraftHint && objective.draftHint && (
          <div style={hintStyle}>
            💡 {objective.draftHint}
          </div>
        )}
      </div>

      {/* Progress bar for completed objectives */}
      {showProgress && (
        <div style={progressBarStyle}>
          <div style={progressFillStyle} />
        </div>
      )}
    </div>
  );
};
