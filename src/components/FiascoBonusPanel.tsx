/**
 * FiascoBonusPanel Component
 * Shows all Fiasco Bonuses and triggered state
 * Persistent on live match screen
 * 
 * Visual polish for Phase 4.8:
 * - Visually distinct from normal objectives (jackpot area)
 * - Triggered Fiascos stand out clearly
 * - Exciting, energetic styling
 * - Flame emoji reinforces "chaotic moment" concept
 * - Clear separation of triggered vs pending
 */

import React from 'react';
import { FiascoBonus, FiascoBonusAwarded } from '../types/entities';

interface FiascoBonusPanelProps {
  bonuses: FiascoBonus[];
  awardedBonuses?: FiascoBonusAwarded[];
  compact?: boolean;
}

export const FiascoBonusPanel: React.FC<FiascoBonusPanelProps> = ({
  bonuses,
  awardedBonuses = [],
  compact = false,
}) => {
  const triggeredIds = new Set(awardedBonuses.map((ab) => ab.fiascoBonusId));

  const containerStyle: React.CSSProperties = {
    padding: compact ? '12px' : '14px 16px',
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
    fontSize: compact ? '13px' : '15px',
    fontWeight: '700',
    marginBottom: compact ? '10px' : '12px',
    color: '#E65100',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const bonusListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: compact ? '8px' : '10px',
  };

  // Triggered Fiasco bonus: stand out clearly
  const bonusItemStyle = (isTriggered: boolean): React.CSSProperties => ({
    padding: compact ? '10px 12px' : '12px 14px',
    backgroundColor: isTriggered ? '#FFE082' : '#FFF8E1',
    border: isTriggered ? '2px solid #FBC02D' : '1px solid #FFE0B2',
    borderRadius: '6px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    opacity: 1,
    boxShadow: isTriggered ? '0 3px 8px rgba(255, 193, 7, 0.3)' : 'none',
    transition: 'all 0.3s ease',
    transform: isTriggered ? 'scale(1.02)' : 'scale(1)',
  });

  const bonusNameStyle = (isTriggered: boolean): React.CSSProperties => ({
    fontSize: compact ? '13px' : '14px',
    fontWeight: isTriggered ? '700' : '600',
    flex: 1,
    color: isTriggered ? '#E65100' : '#666',
  });

  const bonusPointsStyle = (isTriggered: boolean): React.CSSProperties => ({
    fontSize: compact ? '13px' : '14px',
    fontWeight: '700',
    color: isTriggered ? '#D32F2F' : '#999',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  });

  const triggeredBadgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#D32F2F',
    borderRadius: '4px',
    fontSize: '10px',
    fontWeight: '700',
    color: '#fff',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={{ fontSize: '18px' }}>🔥</span>
        <span>{compact ? 'FIASCO!' : 'FIASCO BONUSES'}</span>
      </div>

      <div style={bonusListStyle}>
        {bonuses.length === 0 ? (
          <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', padding: '8px', fontStyle: 'italic' }}>
            No fiasco bonuses this match
          </div>
        ) : (
          bonuses.map((bonus) => {
            const isTriggered = triggeredIds.has(bonus.id);
            return (
              <div key={bonus.id} style={bonusItemStyle(isTriggered)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '18px' }}>
                    {isTriggered ? '⚡' : bonus.icon || '💣'}
                  </span>
                  <div style={bonusNameStyle(isTriggered)}>
                    {bonus.name}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <div style={bonusPointsStyle(isTriggered)}>
                    +{bonus.points}
                  </div>
                  {isTriggered && (
                    <div style={triggeredBadgeStyle}>
                      ✓ HIT
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
