import { useState, useEffect } from 'react';
import { GameState, MatchState } from '../types/game';

const useGameState = () => {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [matchState, setMatchState] = useState<MatchState>('waiting');

    useEffect(() => {
        // Initialize game state and set up listeners for game events
        const initializeGame = () => {
            // Logic to initialize game state
        };

        initializeGame();

        // Cleanup function to remove listeners
        return () => {
            // Logic to clean up listeners
        };
    }, []);

    const startGame = () => {
        setMatchState('inProgress');
        // Additional logic to start the game
    };

    const endGame = () => {
        setMatchState('finished');
        // Additional logic to end the game
    };

    return {
        gameState,
        matchState,
        startGame,
        endGame,
    };
};

export default useGameState;