export interface Room {
    id: string;
    name: string;
    players: Player[];
    status: 'waiting' | 'in-progress' | 'finished';
}

export interface Player {
    id: string;
    name: string;
    score: number;
}

export interface Event {
    id: string;
    type: string;
    description: string;
    timestamp: number;
}

export interface Category {
    id: string;
    name: string;
}

export interface DraftPick {
    playerId: string;
    round: number;
}

export interface Prediction {
    playerId: string;
    predictedScore: number;
}

export interface MatchState {
    currentRound: number;
    totalRounds: number;
    events: Event[];
}