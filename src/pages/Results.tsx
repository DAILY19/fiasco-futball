import React from 'react';
import { useGameState } from '../hooks/useGameState';
import { ScoreBoard } from '../components/ScoreBoard';

const Results: React.FC = () => {
    const { finalScores } = useGameState();

    return (
        <div className="results-container">
            <h1>Final Results</h1>
            <ScoreBoard scores={finalScores} />
            <p>Thank you for playing Fiasco Futball!</p>
        </div>
    );
};

export default Results;