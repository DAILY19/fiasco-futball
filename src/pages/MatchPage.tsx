/**
 * Match Page - Recording Events and Tracking Scores
 * Intentionally simple - functionality first
 */

import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { useRoom } from '../contexts/RoomContext';
import { useScoring } from '../contexts/ScoringContext';
import { eventRegistry } from '../registries/eventRegistry';
import { getCurrentTimestamp } from '../utils/codeGen';

interface MatchPageProps {
  onMatchEnd: () => void;
}

export const MatchPage: React.FC<MatchPageProps> = ({ onMatchEnd }) => {
  const { recordEvent, events, error: gameError, clearError: clearGameError, isMatchActive } = useGame();
  const { room, isHost } = useRoom();
  const { leaderboard, refreshLeaderboard, getTotalPoints } = useScoring();

  // Refresh leaderboard every 2 seconds during match
  useEffect(() => {
    const interval = setInterval(() => {
      refreshLeaderboard();
    }, 2000);

    return () => clearInterval(interval);
  }, [refreshLeaderboard]);

  const handleRecordEvent = async (eventId: string) => {
    try {
      clearGameError();
      await recordEvent(eventId, getCurrentTimestamp());
      // Refresh leaderboard after event
      setTimeout(() => refreshLeaderboard(), 500);
    } catch (err) {
      console.error('Failed to record event:', err);
    }
  };

  const handleEndMatch = async () => {
    onMatchEnd();
  };

  if (!room) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  // Core event types for vertical slice
  const coreEvents = [
    'YELLOW_CARD',
    'RED_CARD',
    'VAR_REVIEW',
    'OWN_GOAL',
    'HIT_POST',
    'LATE_GOAL',
  ];

  const activeEvents = coreEvents.map((id) => eventRegistry[id]).filter(Boolean);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>{room.displayName} - LIVE</h1>

      {gameError && (
        <div style={{ backgroundColor: '#ffcccc', padding: '10px', marginBottom: '20px', borderRadius: '4px' }}>
          <strong>Error:</strong> {gameError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Events Section */}
        <div>
          <h3>Record Events</h3>
          {isHost ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: '10px',
              }}
            >
              {activeEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => handleRecordEvent(event.id)}
                  style={{
                    padding: '15px',
                    backgroundColor: '#0066cc',
                    color: 'white',
                    border: '1px solid #004499',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '5px' }}>{event.icon}</div>
                  {event.displayName}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: '#ffffcc', padding: '10px', borderRadius: '4px' }}>
              <p>Only the host can record events.</p>
            </div>
          )}
        </div>

        {/* Leaderboard Section */}
        <div>
          <h3>Leaderboard</h3>
          <div
            style={{
              border: '1px solid #ccc',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#f9f9f9',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#eeeeee', borderBottom: '1px solid #ccc' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Rank</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Player</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: '10px', textAlign: 'center', color: '#999' }}>
                      No scores yet
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry) => (
                    <tr key={entry.playerId} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>#{entry.rank}</td>
                      <td style={{ padding: '8px' }}>{entry.displayName}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold', color: '#0066cc' }}>
                        {entry.totalPoints}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Total points awarded: {getTotalPoints()}
          </p>
        </div>
      </div>

      {/* Events Timeline */}
      <div style={{ marginTop: '30px' }}>
        <h3>Event Timeline ({events.length} events)</h3>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: '#f9f9f9',
          }}
        >
          {events.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              No events recorded yet
            </div>
          ) : (
            <div>
              {events.map((event, index) => {
                const eventDef = eventRegistry[event.eventDefinitionId];
                return (
                  <div
                    key={event.id}
                    style={{
                      padding: '10px 15px',
                      borderBottom: '1px solid #ddd',
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr',
                      gap: '10px',
                    }}
                  >
                    <div style={{ fontSize: '16px' }}>{eventDef?.icon || '⚽'}</div>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{eventDef?.displayName || event.eventDefinitionId}</div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {event.affectedPlayers.length > 0 ? `Players: ${event.affectedPlayers.join(', ')}` : 'Match event'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Host Controls */}
      {isHost && (
        <div style={{ marginTop: '30px', backgroundColor: '#ffe6e6', padding: '20px', borderRadius: '4px' }}>
          <button
            onClick={handleEndMatch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dd0000',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            End Match
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Click to end the match and go to results.
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
        <p><strong>Phase:</strong> {room.phase}</p>
        <p><strong>Status:</strong> {isMatchActive() ? '🟢 Match is LIVE' : '🔴 Match inactive'}</p>
      </div>
    </div>
  );
};
