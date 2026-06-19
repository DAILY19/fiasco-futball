import React from 'react';

const Home: React.FC = () => {
    return (
        <div className="home">
            <h1>Welcome to Fiasco Futball</h1>
            <p>Create or join a room to start playing!</p>
            <button>Create Room</button>
            <button>Join Room</button>
        </div>
    );
};

export default Home;