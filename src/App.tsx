/**
 * Main App Component
 * Orchestrates Firebase initialization and page routing
 */

import React, { useEffect, useState } from 'react';
import { initializeAuth } from './services/firebase';
import { RoomProvider, useRoom } from './contexts/RoomContext';
import { GameProvider, useGame } from './contexts/GameContext';
import { ScoringProvider, useScoring } from './contexts/ScoringContext';
import { HomePage } from './pages/HomePage';
import { RoomPage } from './pages/RoomPage';
import { ObjectiveRevealScreen } from './pages/ObjectiveRevealScreen';
import { DraftScreen } from './pages/DraftScreen';
import { LiveMatchScreen } from './pages/LiveMatchScreen';
import { MatchCompleteScreen } from './pages/MatchCompleteScreen';
import { MatchPage } from './pages/MatchPage';
import { ResultsPage } from './pages/ResultsPage';
import { DebugPanel } from './components/DebugPanel';
import { FiascoService } from './services/fiascoService';

/**
 * Main router component (after Firebase is initialized)
 */
const GameRouter: React.FC = () => {
  const { room } = useRoom();
  const { currentPhase } = useGame();
  const { refreshLeaderboard } = useScoring();

  const handleStartMatch = async () => {
    if (!room) return;
    try {
      await FiascoService.transitionPhase(room.id, 'MATCH');
      setTimeout(() => refreshLeaderboard(), 500);
    } catch (err) {
      console.error('Failed to start match:', err);
    }
  };

  const handleEndMatch = async () => {
    if (!room) return;
    try {
      await FiascoService.transitionPhase(room.id, 'RESULTS');
      setTimeout(() => refreshLeaderboard(), 500);
    } catch (err) {
      console.error('Failed to end match:', err);
    }
  };

  const handleResetGame = async () => {
    if (!room) return;
    try {
      await FiascoService.transitionPhase(room.id, 'LOBBY');
      setTimeout(() => refreshLeaderboard(), 500);
    } catch (err) {
      console.error('Failed to reset game:', err);
    }
  };

  const handleRevealComplete = async () => {
    if (!room) return;
    try {
      await FiascoService.transitionPhase(room.id, 'DRAFT');
    } catch (err) {
      console.error('Failed to transition to draft:', err);
    }
  };

  const handleDraftComplete = async () => {
    if (!room) return;
    try {
      await FiascoService.transitionPhase(room.id, 'MATCH');
    } catch (err) {
      console.error('Failed to transition to match:', err);
    }
  };

  const handleMatchComplete = async () => {
    if (!room) return;
    try {
      await FiascoService.transitionPhase(room.id, 'RESULTS');
      setTimeout(() => refreshLeaderboard(), 500);
    } catch (err) {
      console.error('Failed to transition to results:', err);
    }
  };

  if (!room) {
    return <HomePage />;
  }

  switch (currentPhase) {
    case 'LOBBY':
      return <RoomPage onMatchStart={handleStartMatch} />;
    case 'OBJECTIVES_REVEAL':
      return <ObjectiveRevealScreen onReadyToDraft={handleRevealComplete} />;
    case 'DRAFT':
      return <DraftScreen onDraftComplete={handleDraftComplete} />;
    case 'PREDICTIONS':
      return <RoomPage onMatchStart={handleStartMatch} />;
    case 'MATCH':
      return <LiveMatchScreen onMatchEnd={handleMatchComplete} />;
    case 'RESULTS':
      return <MatchCompleteScreen onResetGame={handleResetGame} />;
    default:
      return <HomePage />;
  }
};

const GameRouterWithRoom: React.FC = () => {
  const { room } = useRoom();

  if (!room) {
    return <GameRouter />;
  }

  return (
    <GameProvider roomId={room.id}>
      <ScoringProvider roomId={room.id}>
        <GameRouter />
      </ScoringProvider>
    </GameProvider>
  );
};

const AppWithProviders: React.FC = () => {
  return (
    <RoomProvider>
      <GameProvider roomId={''}>
        <ScoringProvider roomId={''}>
          <GameRouterWithRoom />
          <DebugPanel />
        </ScoringProvider>
      </GameProvider>
    </RoomProvider>
  );
};

export function App() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log('Initializing Firebase...');
        await initializeAuth();
        console.log('Firebase initialized successfully');
        setIsInitialized(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initialize Firebase';
        console.error('Initialization error:', message);
        setError(message);
      }
    };

    initApp();
  }, []);

  if (error) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          fontFamily: 'monospace',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h1>Initialization Error</h1>
        <div style={{ backgroundColor: '#ffcccc', padding: '20px', borderRadius: '4px', marginBottom: '20px' }}>
          <p>
            <strong>Error:</strong> {error}
          </p>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            Please check that Firebase is properly configured in your environment variables.
          </p>
        </div>
        <details style={{ marginTop: '20px', textAlign: 'left', fontSize: '12px' }}>
          <summary style={{ cursor: 'pointer' }}>Setup Instructions</summary>
          <div style={{ marginTop: '10px', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
            <ol>
              <li>Copy .env.example to .env.local</li>
              <li>Fill in your Firebase project credentials</li>
              <li>Reload the page</li>
            </ol>
          </div>
        </details>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1>Loading Fiasco Futball...</h1>
          <p>Initializing Firebase</p>
        </div>
      </div>
    );
  }

  return <AppWithProviders />;
}

export default App;