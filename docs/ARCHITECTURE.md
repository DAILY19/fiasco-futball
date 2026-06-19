# Fiasco Futball Architecture

## Overview

Fiasco Futball is a React/TypeScript application built on a **registry-based, data-driven architecture**. This design prioritizes:

1. **Expandability** - New events, categories, and game modes can be added without code changes
2. **Separation of Concerns** - Clear layers: UI, Business Logic, Data Services, Data Persistence
3. **Type Safety** - Full TypeScript coverage prevents runtime errors
4. **Determinism** - State machine ensures predictable game flow
5. **Testability** - Services are mockable, registries are immutable reference data

---

## Architectural Layers

### Layer 1: Registries (Reference Data)
**Location**: `src/registries/`

Static, immutable definitions of the game system. These are the source of truth for all game mechanics.

- **eventRegistry.ts** - All possible events (Yellow Card, Own Goal, etc.)
  - Each event defines: ID, name, icon, base fiasco value, category
  - No events hardcoded anywhere else
  - New events added here, automatically available everywhere

- **categoryRegistry.ts** - All draft categories (Card Collector, Chaos Cup, etc.)
  - Each category defines: name, description, scoring triggers
  - Triggers reference events from eventRegistry
  - New categories automatically appear in draft UI

- **scoringRegistry.ts** - Scoring rules and multipliers
  - Base points for each event type
  - Multipliers for different scenarios
  - All scoring logic centralized

### Benefits
- No magic numbers in component code
- Single source of truth for game mechanics
- Changes propagate automatically
- Easy to add new content (just add to registry)

---

### Layer 2: Types & Interfaces
**Location**: `src/types/`

Complete TypeScript definitions ensuring type safety throughout.

**entities.ts**
- `Room` - Game session container
- `Player` / `RoomPlayer` - Participant data
- `GameState` - Current game state at any moment
- `GameEvent` - Something that happened
- `GamePrediction` - Player prediction about an event
- `LeaderboardEntry` - Standings information
- And more...

**api.ts**
- Request/response types for services
- Ensures consistent API contracts
- Optional: Can be used to generate OpenAPI docs

---

### Layer 3: Services (Business Logic)
**Location**: `src/services/`

Encapsulate all business logic. Services are the bridge between UI and data persistence.

- **roomService.ts**
  - Create room, join room, leave room
  - Manage room settings and player list
  - Handle room lifecycle

- **eventService.ts**
  - Record events during match
  - Verify events
  - Query events by various filters
  - Event management and history

- **draftService.ts**
  - Start/manage draft phase
  - Players select categories
  - Validate draft completeness
  - Track draft history

- **predictionService.ts**
  - Players make predictions
  - Query predictions by filter
  - Calculate prediction accuracy
  - Score predictions when events occur

- **scoreService.ts**
  - Calculate player scores
  - Generate leaderboard
  - Update scores after events
  - Scoring statistics and breakdown

- **fiascoService.ts**
  - Core game orchestration
  - Phase transitions
  - Game state management
  - Game timeline and statistics

### Key Pattern
```typescript
// Services are pure business logic
// They accept data, return results, throw errors if invalid
// No component-specific logic

static async recordEvent(request: RecordEventRequest): Promise<ApiResponse<GameEvent>> {
  // Validate
  // Transform
  // Persist
  // Return result
}
```

---

### Layer 4: Contexts & State Management
**Location**: `src/contexts/`

React Context providers manage application state and provide hooks for UI components.

- **GameContext** - Current game state, phase, events
  - `useGame()` - Access anywhere in app
  - Manages real-time game updates
  - Subscribes to Firestore changes

- **RoomContext** - Room and player information
  - `useRoom()` - Room data, player list, host status
  - Handles room lifecycle operations

- **ScoringContext** - Leaderboard and scoring state
  - `useScoring()` - Leaderboard, player scores, predictions
  - Real-time score updates

### Context Pattern
```typescript
// Each context follows same pattern:
// 1. Define interface with state + functions
// 2. Create context and provider
// 3. Export hook for access

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) throw new Error('Must be within provider');
  return context;
};
```

---

### Layer 5: Components (Presentation)
**Location**: `src/components/`

React components that display data and handle user interaction.

**Two-way Flow**:
- **Receive**: Data from contexts
- **Display**: Render information
- **Send**: User actions to services via contexts

**Rule**: Components NEVER contain business logic
- No scoring calculations in components
- No event validation in components
- No state mutations in components

```typescript
// ✅ GOOD: Component displays data
function Leaderboard() {
  const { leaderboard } = useScoring();
  return <div>{leaderboard.map(entry => ...)}</div>;
}

// ❌ BAD: Business logic in component
function Leaderboard() {
  const [scores, setScores] = useState({});
  // Scoring calculation in component = wrong!
}
```

---

## Data Flow

### Event Recording Flow

```
UI Component
    ↓ (user clicks "Record Yellow Card")
Service Method (EventService.recordEvent)
    ↓ (validate using registry)
Firebase (save to events collection)
    ↓ (document created)
Listener (real-time update)
    ↓
Context (GameContext updates)
    ↓ (score service recalculates)
Leaderboard Updates
    ↓
UI Re-renders (from ScoringContext)
```

### Key Principle
**Unidirectional Data Flow**:
1. User interaction triggers service call
2. Service validates using registries
3. Service persists to Firebase
4. Firebase listeners notify contexts
5. Contexts trigger React re-renders
6. Components display new state

---

## Phase State Machine

```
    ┌─────────────────────────────────────┐
    │          LOBBY                      │
    │  • Room created                     │
    │  • Players joining                  │
    │  • Settings configurable            │
    └──────────────┬──────────────────────┘
                   │ (all ready)
                   ↓
    ┌─────────────────────────────────────┐
    │          DRAFT                      │
    │  • Players select categories        │
    │  • Settings locked                  │
    │  • Real-time visibility (optional)  │
    └──────────────┬──────────────────────┘
                   │ (all drafted)
                   ↓
    ┌─────────────────────────────────────┐
    │       PREDICTIONS                   │
    │  • Pre-match window open            │
    │  • Players predict events           │
    │  • Can update/revoke predictions    │
    └──────────────┬──────────────────────┘
                   │ (match starts)
                   ↓
    ┌─────────────────────────────────────┐
    │         MATCH                       │
    │  • Events recorded live             │
    │  • Predictions locked               │
    │  • Scores updating                  │
    └──────────────┬──────────────────────┘
                   │ (match ends)
                   ↓
    ┌─────────────────────────────────────┐
    │        RESULTS                      │
    │  • Final scores calculated          │
    │  • Leaderboard finalized            │
    │  • Results displayed                │
    │  • Game can be archived             │
    └──────────────┬──────────────────────┘
                   │ (reset room)
                   ↓
            (back to LOBBY)
```

---

## Expandability Design

### Adding a New Event Type

1. **Register the event**
   ```typescript
   // eventRegistry.ts
   eventRegistry['NEW_EVENT'] = {
     id: 'NEW_EVENT',
     displayName: 'New Event',
     icon: '🆕',
     fiascoValue: 10,
     category: 'EVENTS'
   };
   ```

2. **Define scoring**
   ```typescript
   // scoringRegistry.ts
   scoringRegistry['NEW_EVENT'] = {
     id: 'NEW_EVENT',
     basePoints: 10
   };
   ```

3. **Add to category triggers** (if relevant)
   ```typescript
   // categoryRegistry.ts
   SOME_CATEGORY.scoringTriggers.push({
     eventId: 'NEW_EVENT',
     basePoints: 10
   });
   ```

4. **Done!** - Event now available everywhere:
   - Event selection in UI
   - Scoring calculations
   - Predictions
   - Leaderboard
   - No component changes needed

### Adding a New Category

1. **Register the category**
   ```typescript
   categoryRegistry['NEW_CATEGORY'] = {
     id: 'NEW_CATEGORY',
     name: 'Category Name',
     scoringTriggers: [...]
   };
   ```

2. **Done!** - Category appears in draft immediately

### Adding a New Game Mode

1. **Create service methods** for game mode-specific logic
2. **Store configuration** in MatchSettings
3. **Create phase transitions** if needed
4. **No changes to existing code** - new mode is parallel

---

## Technology Stack

### Frontend
- **React 18+** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling (planned)

### Backend/Data
- **Firebase Firestore** - Real-time database
- **Firebase Auth** - Authentication (planned)
- **Firebase Cloud Functions** - Backend logic (planned)

### Architecture Patterns
- **Registry Pattern** - Immutable reference data
- **Service Pattern** - Business logic encapsulation
- **Context Pattern** - Application state management
- **State Machine** - Game phase control

---

## Project Structure

```
src/
├── app/                    # Application entry (App.tsx, main.tsx)
├── components/             # React components
│   ├── GameBoard.tsx
│   ├── Player.tsx
│   ├── ScoreBoard.tsx
│   └── ui/                 # Reusable UI components
├── pages/                  # Page-level components
│   ├── Game.tsx
│   ├── Home.tsx
│   ├── Results.tsx
│   └── Settings.tsx
├── contexts/               # React Context providers
│   ├── GameContext.tsx
│   ├── RoomContext.tsx
│   └── ScoringContext.tsx
├── services/               # Business logic layer
│   ├── roomService.ts
│   ├── eventService.ts
│   ├── draftService.ts
│   ├── predictionService.ts
│   ├── scoreService.ts
│   └── fiascoService.ts
├── registries/             # Immutable reference data
│   ├── eventRegistry.ts
│   ├── categoryRegistry.ts
│   └── scoringRegistry.ts
├── types/                  # TypeScript definitions
│   ├── entities.ts
│   └── api.ts
├── hooks/                  # Custom React hooks
│   ├── useAuth.ts
│   ├── useFirebase.ts
│   └── useGameState.ts
├── utils/                  # Utility functions
│   ├── constants.ts
│   └── helpers.ts
├── styles/                 # CSS files
│   ├── globals.css
│   ├── mobile.css
│   └── theme.css
└── assets/                 # Images, icons, etc.

docs/
├── STATE_MACHINE.md        # Phase transition documentation
└── FIRESTORE_SCHEMA.md     # Database schema design
```

---

## Implementation Roadmap

### Phase 1: Foundation (Current) ✅
- [x] Type definitions
- [x] Registries (events, categories, scoring)
- [x] Service skeletons
- [x] Context setup
- [x] State machine design
- [x] Firestore schema design

### Phase 2: Services Implementation
- [ ] Implement all service methods
- [ ] Firebase Firestore integration
- [ ] Real-time listeners
- [ ] Error handling

### Phase 3: UI Components
- [ ] Build game screens
- [ ] Connect contexts to components
- [ ] User interaction handlers
- [ ] Visual feedback

### Phase 4: Polish & Testing
- [ ] Unit tests for services
- [ ] Integration tests
- [ ] E2E testing
- [ ] Performance optimization
- [ ] UI refinement

---

## Design Principles

### 1. Single Responsibility
Each module does one thing well:
- Services handle business logic
- Components handle display
- Registries define content
- Contexts manage state

### 2. Open/Closed Principle
Open for extension, closed for modification:
- Add new events without changing existing code
- Add new categories without refactoring
- Extend with new game modes without breaking existing ones

### 3. Dependency Inversion
Components depend on abstractions (contexts), not concrete implementations

### 4. DRY (Don't Repeat Yourself)
- Registry pattern prevents duplicate definitions
- Shared types across all layers
- Centralized scoring logic

### 5. Fail Fast, Fail Loud
- Validate inputs immediately
- Throw errors with context
- Log for debugging

---

## Next Steps

1. **Implement Services**
   - Connect to Firebase
   - Implement each service method
   - Add error handling

2. **Build Real-time Listeners**
   - Subscribe to room changes
   - Subscribe to event updates
   - Subscribe to score changes

3. **Create UI Components**
   - Lobby screen
   - Draft screen
   - Predictions screen
   - Game board
   - Leaderboard/Results

4. **Test & Refine**
   - End-to-end testing
   - Performance optimization
   - User feedback iteration

---

## File Reference

- **Type Definitions**: [src/types/entities.ts](../src/types/entities.ts), [src/types/api.ts](../src/types/api.ts)
- **Registries**: [src/registries/](../src/registries/)
- **Services**: [src/services/](../src/services/)
- **Contexts**: [src/contexts/](../src/contexts/)
- **State Machine**: [docs/STATE_MACHINE.md](./STATE_MACHINE.md)
- **Database Schema**: [docs/FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md)
