import React from 'react';
import GameBoard from '../components/GameBoard';
import { useGameState } from '../hooks/useGameState';

const Game: React.FC = () => {
    const { gameState, startGame } = useGameState();

    React.useEffect(() => {
        startGame();
    }, [startGame]);

    return (
        <div>
            <h1>Fiasco Futball</h1>
            <GameBoard gameState={gameState} />
        </div>
    );
};

export default Game;