/**
 * Results Page - Final Leaderboard and Game Summary
 * Intentionally simple
 */

import React, { useEffect } from 'react';
import { useRoom } from '../contexts/RoomContext';
import { useScoring } from '../contexts/ScoringContext';
import { useGame } from '../contexts/GameContext';
import { FiascoService } from '../services/fiascoService';
import { EventService } from '../services/eventService';
import { eventRegistry } from '../registries/eventRegistry';

interface ResultsPageProps {
  onResetGame: () => void;
}

interface GameSummary {
  totalEvents: number;
  totalPoints: number;
  duration: number;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({ onResetGame }) => {
  const { room, isHost } = useRoom();
  const { leaderboard, getTotalPoints, refreshLeaderboard } = useScoring();
  const { events } = useGame();
  const [summary, setSummary] = React.useState<GameSummary | null>(null);
  const [topEvents, setTopEvents] = React.useState<Record<string, number>>({});

  useEffect(() => {
    const loadSummary = async () => {
      if (!room) return;

      try {
        // Refresh leaderboard to get final scores
        await refreshLeaderboard();

        // Get game summary
        const summaryResult = await FiascoService.getGameSummary(room.id);
        if (summaryResult.success && summaryResult.data) {
          setSummary({
            totalEvents: summaryResult.data.totalEvents,
            totalPoints: summaryResult.data.totalPoints,
            duration: summaryResult.data.duration,
          });
        }

        // Get events statistics
        const statsResult = await EventService.getRoomEvents(room.id);
        if (statsResult.success && statsResult.data) {
          const eventCounts: Record<string, number> = {};
          statsResult.data.forEach((event) => {
            eventCounts[event.eventDefinitionId] = (eventCounts[event.eventDefinitionId] || 0) + 1;
          });
          setTopEvents(eventCounts);
        }
      } catch (err) {
        console.error('Failed to load summary:', err);
      }
    };

    loadSummary();
  }, [room, refreshLeaderboard]);

  if (!room) {
    return <div style={{ padding: '20px' }}>Loading...</div>;
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  // Get top 3 events by frequency
  const topEventsArray = Object.entries(topEvents)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🏆 Final Results</h1>

      <div style={{ marginBottom: '30px', backgroundColor: '#e6ffe6', padding: '20px', borderRadius: '4px' }}>
        <h2>{leaderboard[0]?.displayName} WINS! 🎉</h2>
        <p style={{ fontSize: '18px', marginTop: '10px' }}>
          <strong>{leaderboard[0]?.totalPoints}</strong> points
        </p>
      </div>

      {/* Final Leaderboard */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Final Standings</h3>
        <div
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#f9f9f9',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#eeeeee', borderBottom: '1px solid #ccc' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Place</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Player</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.playerId}
                  style={{
                    borderBottom: '1px solid #ddd',
                    backgroundColor: index === 0 ? '#ffffcc' : 'white',
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                  </td>
                  <td style={{ padding: '12px' }}>{entry.displayName}</td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold', color: '#0066cc' }}>
                    {entry.totalPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Game Summary */}
      {summary && (
        <div style={{ marginBottom: '30px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px' }}>
          <h3>Game Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0' }}>Total Events</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{summary.totalEvents}</p>
            </div>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0' }}>Total Points Awarded</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{summary.totalPoints}</p>
            </div>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0' }}>Match Duration</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>
                {formatDuration(summary.duration)}
              </p>
            </div>
            <div>
              <p style={{ color: '#666', margin: '0 0 5px 0' }}>Players</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0' }}>{room.players.length}</p>
            </div>
          </div>
        </div>
      )}

      {/* Top Events */}
      {topEventsArray.length > 0 && (
        <div style={{ marginBottom: '30px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px' }}>
          <h3>Most Common Events</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
            {topEventsArray.map(([eventId, count]) => {
              const eventDef = eventRegistry[eventId];
              return (
                <div
                  key={eventId}
                  style={{
                    border: '1px solid #ccc',
                    padding: '15px',
                    borderRadius: '4px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '10px' }}>{eventDef?.icon}</div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{eventDef?.displayName}</div>
                  <div style={{ fontSize: '18px', color: '#0066cc', fontWeight: 'bold' }}>{count}x</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Host Controls */}
      {isHost && (
        <div style={{ marginTop: '30px', backgroundColor: '#e6f2ff', padding: '20px', borderRadius: '4px' }}>
          <h3>Host Actions</h3>
          <button
            onClick={onResetGame}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Play Again
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Start a new game with the same room and players.
          </p>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666', backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px' }}>
        <p>
          <strong>Match ID:</strong> {room.id}
        </p>
        <p>
          <strong>Room Code:</strong> {room.roomCode}
        </p>
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          Thanks for playing Fiasco Futball! 🏆
        </p>
      </div>
    </div>
  );
};
