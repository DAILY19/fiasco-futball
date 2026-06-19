/**
 * Room Page - Players Ready Up, Host Starts Match
 * Intentionally simple
 */

import React, { useState, useEffect } from 'react';
import { useRoom } from '../contexts/RoomContext';

interface RoomPageProps {
  onMatchStart: () => void;
}

export const RoomPage: React.FC<RoomPageProps> = ({ onMatchStart }) => {
  const { room, players, isHost, setPlayerReady, error, clearError } = useRoom();
  const [isReady, setIsReady] = useState(false);
  const [allReady, setAllReady] = useState(false);

  const handleToggleReady = async () => {
    try {
      clearError();
      await setPlayerReady(!isReady);
      setIsReady(!isReady);
    } catch (err) {
      console.error('Failed to update ready status:', err);
    }
  };

  useEffect(() => {
    // Check if all players are ready
    const _allReady = players.length >= 2 && players.every((p) => p.isReady);
    setAllReady(_allReady);
  }, [players]);

  if (!room) {
    return <div style={{ padding: '20px' }}>Loading room...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Room: {room.displayName}</h1>

      <div style={{ backgroundColor: '#ffffcc', padding: '15px', marginBottom: '20px', borderRadius: '4px' }}>
        <strong>Room Code: {room.roomCode}</strong>
        <p style={{ fontSize: '12px', margin: '5px 0 0 0', color: '#666' }}>
          Share this code with friends to join
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#ffcccc', padding: '10px', marginBottom: '20px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: '30px' }}>
        <h3>Players ({players.length}/{room.maxPlayers})</h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '10px',
          }}
        >
          {players.map((player) => (
            <div
              key={player.playerId}
              style={{
                border: '1px solid #ccc',
                padding: '15px',
                borderRadius: '4px',
                backgroundColor: player.isReady ? '#ccffcc' : '#ffcccc',
              }}
            >
              <div>
                <strong>{player.displayName}</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {player.role === 'HOST' && <span>👑 Host</span>}
              </div>
              <div style={{ fontSize: '14px', marginTop: '5px' }}>
                {player.isReady ? '✅ Ready' : '⏳ Not Ready'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isHost && (
        <div style={{ marginBottom: '30px', backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px' }}>
          <h3>Your Status</h3>
          <button
            onClick={handleToggleReady}
            style={{
              padding: '10px 20px',
              backgroundColor: isReady ? '#00aa00' : '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {isReady ? '✅ Ready' : '⏳ Mark As Ready'}
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Mark yourself as ready. The host can start the game once everyone is ready.
          </p>
        </div>
      )}

      {isHost && (
        <div style={{ marginBottom: '30px', backgroundColor: '#e6f2ff', padding: '20px', borderRadius: '4px' }}>
          <h3>Host Controls</h3>
          <button
            onClick={onMatchStart}
            disabled={!allReady}
            style={{
              padding: '10px 20px',
              backgroundColor: allReady ? '#00aa00' : '#cccccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: allReady ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              opacity: allReady ? 1 : 0.6,
            }}
          >
            Start Match
          </button>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            {!allReady
              ? `⏳ Waiting for all players to be ready (${players.filter((p) => p.isReady).length}/${players.length})`
              : `✅ Ready to start! ${players.length} players ready.`}
          </p>
        </div>
      )}

      <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '4px', fontSize: '12px' }}>
        <strong>Match Settings:</strong>
        <ul>
          <li>Sport: {room.sport}</li>
          <li>Mode: {room.gameMode}</li>
          <li>Phase: {room.phase}</li>
        </ul>
      </div>
    </div>
  );
};
