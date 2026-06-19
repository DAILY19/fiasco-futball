import React from 'react';

interface PlayerProps {
    name: string;
    score: number;
}

const Player: React.FC<PlayerProps> = ({ name, score }) => {
    return (
        <div className="player">
            <h3>{name}</h3>
            <p>Score: {score}</p>
        </div>
    );
};

export default Player;