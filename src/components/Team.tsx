import React from 'react';
import { Player } from './Player';
import { PlayerType } from '../types/player';

interface TeamProps {
    teamName: string;
    players: PlayerType[];
}

const Team: React.FC<TeamProps> = ({ teamName, players }) => {
    return (
        <div className="team">
            <h2>{teamName}</h2>
            <div className="players">
                {players.map((player) => (
                    <Player key={player.id} name={player.name} score={player.score} />
                ))}
            </div>
        </div>
    );
};

export default Team;