import { Game, Player, Event } from '../types/game';
import { firestore } from './firebase';

export const startGame = async (gameId: string, players: Player[]): Promise<void> => {
    const game: Game = {
        id: gameId,
        players: players,
        events: [],
        score: {},
        status: 'in-progress',
    };

    await firestore.collection('games').doc(gameId).set(game);
};

export const updateScore = async (gameId: string, playerId: string, points: number): Promise<void> => {
    const gameRef = firestore.collection('games').doc(gameId);
    await gameRef.update({
        [`score.${playerId}`]: firestore.FieldValue.increment(points),
    });
};

export const addEvent = async (gameId: string, event: Event): Promise<void> => {
    const gameRef = firestore.collection('games').doc(gameId);
    await gameRef.update({
        events: firestore.FieldValue.arrayUnion(event),
    });
};

export const endGame = async (gameId: string): Promise<void> => {
    const gameRef = firestore.collection('games').doc(gameId);
    await gameRef.update({
        status: 'finished',
    });
};