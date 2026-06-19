import React from 'react';
import { Player } from './Player';
import { Team } from './Team';
import { useGameState } from '../hooks/useGameState';
import { GameState } from '../types/game';

const ScoreBoard: React.FC = () => {
    const { players, teams } = useGameState() as GameState;

    return (
        <div className="scoreboard">
            <h2>Scoreboard</h2>
            <div className="teams">
                {teams.map((team) => (
                    <Team key={team.id} team={team} />
                ))}
            </div>
            <div className="players">
                {players.map((player) => (
                    <Player key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};

export default ScoreBoard;