export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface FirestoreDocument {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameRoom extends FirestoreDocument {
  name: string;
  players: FirebaseUser[];
  status: 'waiting' | 'in-progress' | 'finished';
}

export interface GameEvent extends FirestoreDocument {
  type: string;
  description: string;
  timestamp: Date;
}

export interface PlayerScore extends FirestoreDocument {
  playerId: string;
  score: number;
}