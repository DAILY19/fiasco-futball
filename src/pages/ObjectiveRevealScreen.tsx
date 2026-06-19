/**
 * ObjectiveRevealScreen
 * Shows all assigned objectives before drafting begins
 * Players understand what they need to draft before making picks
 */

import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useRoom } from '../contexts/RoomContext';
import { ObjectiveCard } from '../components/ObjectiveCard';
import { Objective, ObjectiveAssignment } from '../types/entities';

interface ObjectiveRevealScreenProps {
  onReadyToDraft?: () => void;
}

export const ObjectiveRevealScreen: React.FC<ObjectiveRevealScreenProps> = ({ onReadyToDraft }) => {
  const { gameState } = useGame();
  const { room, currentPlayerId } = useRoom();
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [assignments, setAssignments] = useState<Record<string, ObjectiveAssignment>>({});
  const [isReady, setIsReady] = useState(false);

  // TODO: Fetch objectives for current player from Firestore
  // This is a placeholder - actual implementation will fetch from gameState
  useEffect(() => {
    // For now, show empty state
    // In real implementation:
    // 1. Get current player's objective assignments
    // 2. Fetch objective definitions
    // 3. Display them all
  }, [gameState, currentPlayerId]);

  const containerStyle: React.CSSProperties = {
    padding: '16px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.5',
  };

  const objectivesContainerStyle: React.CSSProperties = {
    marginBottom: '24px',
  };

  const objectivesSectionLabelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: '12px',
    letterSpacing: '0.5px',
  };

  const actionContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  };

  const buttonStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: active ? '#1976d2' : '#e0e0e0',
    color: active ? '#fff' : '#666',
    transition: 'all 0.2s ease',
  });

  const infoBoxStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: '#e3f2fd',
    borderLeft: '4px solid #1976d2',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#0d47a1',
    marginBottom: '16px',
    lineHeight: '1.5',
  };

  const handleReadyClick = async () => {
    setIsReady(true);
    onReadyToDraft?.();
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={titleStyle}>📋 Review Your Objectives</div>
        <div style={subtitleStyle}>
          Understand your secret objectives before you start drafting. These objectives determine which players you should recruit.
        </div>
      </div>

      {/* Info Box */}
      <div style={infoBoxStyle}>
        💡 <strong>Pro Tip:</strong> Draft players that match your recommended positions to hit these objectives.
      </div>

      {/* Objectives */}
      <div style={objectivesContainerStyle}>
        <div style={objectivesSectionLabelStyle}>Your Objectives</div>

        {objectives.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              color: '#999',
            }}
          >
            <div style={{ fontSize: '14px', marginBottom: '8px' }}>No objectives assigned yet.</div>
            <div style={{ fontSize: '12px' }}>Wait for the host to start the draft.</div>
          </div>
        ) : (
          objectives.map((obj, idx) => (
            <ObjectiveCard
              key={obj.id}
              objective={obj}
              assignment={assignments[obj.id]}
              variant="reveal"
              showProgress={false}
              showDraftHint={true}
              showRecommendedPositions={true}
            />
          ))
        )}
      </div>

      {/* Action Buttons */}
      <div style={actionContainerStyle}>
        <button
          onClick={handleReadyClick}
          disabled={objectives.length === 0 || isReady}
          style={{
            ...buttonStyle(!isReady && objectives.length > 0),
            opacity: objectives.length === 0 || isReady ? 0.6 : 1,
          }}
        >
          {isReady ? '✓ Ready' : 'Ready to Draft'}
        </button>
      </div>

      {/* Instructions */}
      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
        <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.6' }}>
          <strong>How the Draft Works:</strong>
          <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
            <li>Players take turns drafting from the available pool</li>
            <li>Each draft pick should align with your objectives</li>
            <li>Once all players are drafted, the match begins</li>
            <li>Your score increases as your players perform</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
