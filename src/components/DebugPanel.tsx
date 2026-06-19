/**
 * Debug Developer Panel
 * Shows real-time state for development and testing
 */

import React, { useState } from 'react';
import { useRoom } from '../contexts/RoomContext';
import { useGame } from '../contexts/GameContext';
import { useScoring } from '../contexts/ScoringContext';

export const DebugPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { room, currentPlayerId, isHost } = useRoom();
  const { currentPhase, events, isMatchActive } = useGame();
  const { leaderboard, getTotalPoints } = useScoring();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 12px',
          backgroundColor: '#666',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          zIndex: 9999,
        }}
      >
        Show Debug
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '350px',
        maxHeight: '500px',
        overflowY: 'auto',
        backgroundColor: '#1a1a1a',
        color: '#0f0',
        border: '2px solid #0f0',
        borderRadius: '4px',
        padding: '10px',
        fontFamily: 'monospace',
        fontSize: '11px',
        zIndex: 9999,
      }}
    >
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <strong>🐛 DEBUG PANEL</strong>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            backgroundColor: '#0f0',
            color: '#000',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            padding: '2px 6px',
            fontSize: '11px',
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ borderTop: '1px solid #0f0', paddingTop: '10px', marginBottom: '10px' }}>
        <strong>ROOM STATE</strong>
        <div>Room ID: {room?.id || 'None'}</div>
        <div>Room Code: {room?.roomCode || 'None'}</div>
        <div>Current Player: {currentPlayerId ? currentPlayerId.substring(0, 8) : 'None'}...</div>
        <div>Is Host: {isHost ? '✓' : '✗'}</div>
        <div>Players: {room?.players.length || 0}</div>
      </div>

      <div style={{ borderTop: '1px solid #0f0', paddingTop: '10px', marginBottom: '10px' }}>
        <strong>GAME STATE</strong>
        <div>Phase: {currentPhase}</div>
        <div>Match Active: {isMatchActive() ? '✓' : '✗'}</div>
        <div>Total Events: {events.length}</div>
        <div>Total Points: {getTotalPoints()}</div>
      </div>

      <div style={{ borderTop: '1px solid #0f0', paddingTop: '10px', marginBottom: '10px' }}>
        <strong>LEADERBOARD</strong>
        {leaderboard.slice(0, 3).map((entry) => (
          <div key={entry.playerId}>
            {entry.rank}. {entry.displayName}: {entry.totalPoints}pts
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid #0f0', paddingTop: '10px' }}>
        <strong>RECENT EVENTS</strong>
        {events.slice(0, 3).map((event, idx) => (
          <div key={idx}>{event.eventDefinitionId}</div>
        ))}
        {events.length === 0 && <div>No events</div>}
      </div>

      <div style={{ marginTop: '10px', fontSize: '10px', color: '#888' }}>
        This panel is for development only. Remove before shipping.
      </div>
    </div>
  );
};
