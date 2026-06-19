import React from 'react';

const Settings: React.FC = () => {
    return (
        <div>
            <h1>Game Settings</h1>
            <form>
                <div>
                    <label htmlFor="difficulty">Difficulty Level:</label>
                    <select id="difficulty" name="difficulty">
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="timeLimit">Time Limit (minutes):</label>
                    <input type="number" id="timeLimit" name="timeLimit" min="1" max="60" />
                </div>
                <div>
                    <label htmlFor="maxPlayers">Max Players:</label>
                    <input type="number" id="maxPlayers" name="maxPlayers" min="2" max="10" />
                </div>
                <button type="submit">Save Settings</button>
            </form>
        </div>
    );
};

export default Settings;