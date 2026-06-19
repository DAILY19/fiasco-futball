import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { ScoreBoard } from './ScoreBoard';
import { FiascoMeter } from './FiascoMeter';
import { EventFeed } from './EventFeed';

const GameBoard: React.FC = () => {
    const { gameState, updateGameState } = useGameState();

    return (
        <div className="game-board">
            <h1>{gameState.matchTitle}</h1>
            <FiascoMeter value={gameState.fiascoMeter} />
            <ScoreBoard scores={gameState.scores} />
            <EventFeed events={gameState.events} />
        </div>
    );
};

export default GameBoard;