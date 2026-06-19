export interface Player {
    id: string;
    name: string;
    score: number;
    teamId: string;
}

export interface PlayerStats {
    playerId: string;
    goals: number;
    assists: number;
    fouls: number;
}