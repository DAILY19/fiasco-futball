/**
 * Home Page - Create or Join a Room
 * Intentionally simple for functionality-first approach
 */

import React, { useState } from 'react';
import { useRoom } from '../contexts/RoomContext';

export const HomePage: React.FC = () => {
  const { createRoom, joinRoom, error, isLoading, clearError } = useRoom();

  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [roomName, setRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [sport] = useState('FOOTBALL');
  const [gameMode] = useState('CLASSIC');

  const handleCreateRoom = async () => {
    try {
      clearError();
      await createRoom(roomName || 'Fiasco Game', sport, gameMode);
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const handleJoinRoom = async () => {
    try {
      clearError();
      await joinRoom(roomCode, playerName || 'Player');
    } catch (err) {
      console.error('Failed to join room:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Fiasco Futball</h1>

      {error && (
        <div style={{ backgroundColor: '#ffcccc', padding: '10px', marginBottom: '20px', borderRadius: '4px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
        <h2>Select Mode</h2>
        <div>
          <label>
            <input
              type="radio"
              checked={mode === 'create'}
              onChange={() => setMode('create')}
              disabled={isLoading}
            />
            Create Room
          </label>
          <label style={{ marginLeft: '20px' }}>
            <input
              type="radio"
              checked={mode === 'join'}
              onChange={() => setMode('join')}
              disabled={isLoading}
            />
            Join Room
          </label>
        </div>
      </div>

      {mode === 'create' ? (
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px' }}>
          <h3>Create New Room</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Room Name:{' '}
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="e.g., Josh's Game"
                disabled={isLoading}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Sport:{' '}
              <select disabled>
                <option>FOOTBALL</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Mode:{' '}
              <select disabled>
                <option>CLASSIC</option>
              </select>
            </label>
          </div>
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      ) : (
        <div style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '4px' }}>
          <h3>Join Existing Room</h3>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Room Code (4 letters):{' '}
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="e.g., ABCD"
                maxLength={4}
                disabled={isLoading}
              />
            </label>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>
              Your Name:{' '}
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="e.g., John"
                disabled={isLoading}
              />
            </label>
          </div>
          <button
            onClick={handleJoinRoom}
            disabled={isLoading || roomCode.length !== 4 || !playerName}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00aa00',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading || roomCode.length !== 4 || !playerName ? 'not-allowed' : 'pointer',
              opacity: isLoading || roomCode.length !== 4 || !playerName ? 0.6 : 1,
            }}
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </div>
      )}

      <div style={{ marginTop: '30px', fontSize: '12px', color: '#666' }}>
        <p>
          <strong>About Fiasco Futball:</strong> A game where predictions about football match events earn you points.
          Create a room to get started, or join an existing room with a room code.
        </p>
      </div>
    </div>
  );
};
