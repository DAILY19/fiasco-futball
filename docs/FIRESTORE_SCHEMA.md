# Firestore Schema Design

## Collection Structure

```
/rooms/{roomId}
  /events/{eventId}
  /predictions/{predictionId}
  /scores/{scoringEntry}

/players/{playerId}

/matches/{matchId}
  (archive of completed games)
```

---

## Collection: `rooms`

Stores active game rooms.

### Document: `rooms/{roomId}`

```typescript
{
  // Identifiers
  id: string;                    // Document ID
  hostId: string;               // Reference to host player
  
  // Configuration
  displayName: string;           // "Josh's Game", etc.
  sport: string;                // "FOOTBALL", "BASKETBALL"
  gameMode: string;             // Game variant/type
  
  // State
  phase: GamePhase;             // LOBBY | DRAFT | PREDICTIONS | MATCH | RESULTS
  isActive: boolean;            // Can players join?
  settings: {
    pointsPerCorrection: number;
    pointsPerWildCard: number;
    customRules: Record<string, any>;
    houseName?: string;
    venue?: string;
    homeTeam?: string;
    awayTeam?: string;
    expectedKickoff?: number;
  };
  
  // Players
  players: {
    playerId: string;
    displayName: string;
    joinedAt: number;           // Timestamp
    isReady: boolean;
    role: "ADMIN" | "HOST" | "PLAYER";
    draftPicks?: string[];      // Category IDs
    predictions?: string[];     // Prediction document IDs
    finalScore?: number;
  }[];
  maxPlayers: number;
  password?: string;            // Optional for private rooms
  
  // Metadata
  createdAt: number;            // Timestamp
  updatedAt: number;            // Timestamp
  startedAt?: number;           // Match start time
  endedAt?: number;             // Match end time
}
```

### Indexes Needed
- `isActive` (query active rooms)
- `sport` + `isActive` (filter by sport)
- `createdAt` (sort recent)
- `phase` (query rooms in specific phase)

---

## Subcollection: `rooms/{roomId}/events`

Records all events during the match.

### Document: `rooms/{roomId}/events/{eventId}`

```typescript
{
  id: string;                      // Document ID
  roomId: string;                  // Parent reference
  
  // Event definition
  eventDefinitionId: string;       // Reference to eventRegistry
  timestamp: number;               // When it happened (match time)
  recordedAt: number;              // When it was entered
  
  // Details
  affectedPlayers: string[];       // Player IDs involved
  description: string;             // Human readable
  data?: Record<string, any>;      // Event-specific data
  
  // Verification
  verified: boolean;               // Official confirmation
  verifiedBy?: string;             // Admin/host who verified
  verifiedAt?: number;             // Verification timestamp
  
  // Scoring
  pointsAwarded?: Record<string, number>;  // playerId -> points
}
```

### Indexes Needed
- `roomId` + `timestamp` (get match events)
- `roomId` + `verified` (find unverified)
- `affectedPlayers` array (query by player)

---

## Subcollection: `rooms/{roomId}/predictions`

Stores player predictions.

### Document: `rooms/{roomId}/predictions/{predictionId}`

```typescript
{
  id: string;
  roomId: string;
  
  // Who and what
  playerId: string;              // Player making prediction
  categoryId: string;            // Drafted category
  eventId: string;               // Predicted event ID
  
  // Metadata
  predictedAt: number;           // Timestamp prediction created
  confidence?: number;           // 0-100 confidence level
  
  // Scoring
  result?: "CORRECT" | "INCORRECT" | "PENDING";
  pointsAwarded?: number;        // Points for correct prediction
  
  // Related events
  triggeringEventId?: string;    // Event ID that triggered this prediction
}
```

### Indexes Needed
- `roomId` + `playerId` (get player predictions)
- `roomId` + `categoryId` (get predictions for category)
- `roomId` + `result` (query by outcome)
- `roomId` + `eventId` (find predictions of event)

---

## Subcollection: `rooms/{roomId}/scores`

Pre-calculated scores (denormalized for performance).

### Document: `rooms/{roomId}/scores/{playerId}`

```typescript
{
  playerId: string;
  totalPoints: number;
  
  breakdown: {
    fromPredictions: number;
    fromDraftedCategories: number;
    bonuses: number;
  };
  
  stats: {
    correctPredictions: number;
    totalPredictions: number;
    accuracy: number;           // Percentage
  };
  
  draftedCategories: string[];  // Category IDs
  
  // Leaderboard
  rank: number;                 // Current position
  
  lastUpdated: number;          // Timestamp
}
```

### Why Denormalized?
- Leaderboard queries are expensive if calculated on-demand
- Store pre-calculated scores for fast retrieval
- Update on every event verification
- Rebuild periodically for consistency

---

## Collection: `players`

User profile data.

### Document: `players/{playerId}`

```typescript
{
  id: string;
  displayName: string;
  avatar?: string;
  
  stats: {
    gamesPlayed: number;
    totalPoints: number;
    avgPointsPerGame: number;
    bestRank?: number;
  };
  
  // Preferences
  settings: {
    theme?: string;
    notifications?: boolean;
  };
  
  // Metadata
  createdAt: number;
  lastSeen: number;
}
```

---

## Collection: `matches` (Archive)

Completed games stored for history/analysis.

### Document: `matches/{matchId}`

```typescript
{
  id: string;
  roomId: string;              // Reference to original room
  
  // Summary
  displayName: string;
  sport: string;
  date: number;
  duration: number;            // milliseconds
  
  // Participants
  participants: {
    playerId: string;
    displayName: string;
    finalRank: number;
    finalScore: number;
  }[];
  
  // Statistics
  totalEventsRecorded: number;
  totalPredictionsMade: number;
  correctPredictions: number;
  totalPointsAwarded: number;
  
  // Full data references
  eventIdsSnapshot: string[];      // For reconstruction
  predictionIdsSnapshot: string[];
  
  // Metadata
  archivedAt: number;
}
```

---

## Security Rules Strategy

### Room Access
```
- Host: Full read/write on room
- Players: Read room, limited write to own data
- Viewers: Read-only public data
```

### Event Recording
```
- Only host/admin can create events
- Only host/admin can verify events
- Anyone can read events
```

### Predictions
```
- Players can create predictions on their own account
- Cannot create for other players
- Can update/delete own predictions before match
```

### Scoring
```
- Calculated by backend service
- Read-only for clients
- Updated on event verification
```

---

## Data Flow

### Event Recording Flow
```
1. Host records event
   → Create event document in room.events
   → marked verified=false
   
2. Event is verified (auto-verify or manual)
   → Update event.verified=true
   → Query matching predictions
   → Calculate points for predictions
   → Update prediction.result & points
   → Update scores subcollection
   → Broadcast leaderboard update
```

### Prediction Scoring Flow
```
1. Player makes prediction
   → Create prediction document
   → result=PENDING
   
2. Matching event recorded & verified
   → Find all predictions for this event
   → Set result=CORRECT or INCORRECT
   → Look up points from scoring registry
   → Apply multipliers
   → Update prediction.pointsAwarded
   → Update scores
```

### Leaderboard Update Flow
```
On any score change:
   → Recalculate player scores
   → Rank all players
   → Update scores subcollection
   → Publish to active listeners
```

---

## Query Patterns

### Get Active Rooms
```
Query rooms where isActive=true order by createdAt desc
```

### Get Room Events
```
Query rooms/{roomId}/events where timestamp order by timestamp asc
```

### Get Player Predictions
```
Query rooms/{roomId}/predictions where playerId
```

### Get Unverified Events
```
Query rooms/{roomId}/events where verified=false
```

### Get Leaderboard
```
Query rooms/{roomId}/scores order by rank asc
```

### Get Event Timeline
```
Query rooms/{roomId}/events order by timestamp desc limit 20
```

---

## Performance Considerations

### Denormalization
- Scores stored in separate subcollection (denormalized)
- Rebuilt on every significant change
- Enables fast leaderboard queries

### Subcollections vs Root Collections
- Events/Predictions stored in room subcollections
- Keeps related data together
- Simplifies access control

### Real-time Listeners
- Subscribe to room phase for updates
- Subscribe to scores for leaderboard
- Subscribe to events for timeline
- Listeners should be scoped to necessary data

### Batch Operations
- Multiple event creation should use batch writes
- Score recalculation should use transaction
- Prevents partial updates

---

## Migration Strategy

When adding features:
1. Add new fields with defaults
2. Update new rooms immediately
3. Gradually migrate existing rooms
4. Keep backward compatibility in queries
5. Eventually clean up old fields
