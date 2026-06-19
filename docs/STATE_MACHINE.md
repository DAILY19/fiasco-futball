# Game State Machine Design

## Overview
The Fiasco Futball game follows a strict state machine with five well-defined phases. This prevents undefined behavior and makes the game logic deterministic and testable.

## Phases

### 1. LOBBY
**Entry Point**: Game creation  
**Exit**: All players ready + host starts draft

**What happens**:
- Room is created with host
- Players join the room
- Host configures game settings (points per event, custom rules, etc.)
- Players can see each other
- Players ready up (host must be ready)
- Cannot transition until all players are ready and have joined

**Validations**:
- Minimum players reached (1 minimum, recommended 2+)
- Host has confirmed ready status
- Settings are valid

**Data locked**: None yet

**→ Next Phase**: DRAFT

---

### 2. DRAFT
**Entry Point**: Transitioned from LOBBY  
**Exit**: All players have selected their categories

**What happens**:
- Categories are presented to players
- Each player selects categories from the registry (typically 1-3)
- Categories selected become locked to that player
- Players cannot change selections once locked (or undo limit enforced)
- Real-time visibility of what others drafted (optional)

**Validations**:
- All players have drafted required number of categories
- Each category can only be drafted by one player (or limited selections)
- Cannot proceed without all players drafting

**Data locked**:
- Room settings become immutable
- Player list becomes immutable

**→ Next Phase**: PREDICTIONS

---

### 3. PREDICTIONS
**Entry Point**: Transitioned from DRAFT  
**Exit**: Match starts (manual trigger by host or automatic at kickoff time)

**What happens**:
- Match hasn't started yet (pre-match window)
- Players make predictions about which events they think will occur
- Players predict based on their drafted categories
- A prediction is: "Event X will happen in Category Y"
- Players can update/revoke predictions before match starts
- Confidence levels can be assigned (optional)

**Validations**:
- Player can only predict events in their drafted categories
- Cannot predict same event multiple times in one category
- Timestamp validation ensures predictions are pre-match

**Data locked**:
- Draft selections are locked
- Categories and events registries are read-only

**→ Next Phase**: MATCH

---

### 4. MATCH
**Entry Point**: Manual start by host or automatic at scheduled time  
**Exit**: Manual end by host or automatic at scheduled end time

**What happens**:
- Match is live
- Real-time event recording by host/commentator
- Events are recorded with timestamp and affected players
- Predictions are locked (no new predictions allowed)
- Score updates begin as events are verified
- Leaderboard updates in real-time

**Validations**:
- Events must be from eventRegistry
- Timestamps must be within match window
- Only valid phases for new events

**Data locked**:
- All predictions are locked
- No new predictions accepted
- Registry definitions are immutable

**→ Next Phase**: RESULTS

---

### 5. RESULTS
**Entry Point**: Match ends (manual or automatic)  
**Exit**: Room can be archived or reset

**What happens**:
- Final scoring calculated
- Leaderboard finalized
- Match statistics generated
- Results are displayed
- Match can be saved/archived
- Room can be reset to LOBBY for another game

**Validations**:
- All pending events must be resolved
- Final scores calculated correctly

**Data locked**:
- Everything is finalized and read-only

**→ Next Phase**: Can return to LOBBY for new game or close room

---

## Phase Transitions

```
LOBBY → DRAFT → PREDICTIONS → MATCH → RESULTS
  ↑                                        ↓
  └────────────────────── (reset only) ──┘
```

### Transition Rules

| From | To | Requirements | Side Effects |
|------|----|--------------| -------------|
| LOBBY | DRAFT | All players ready, host confirms | Lock settings, initialize draft state |
| DRAFT | PREDICTIONS | All players drafted | Lock draft selections |
| PREDICTIONS | MATCH | Host starts or time reached | Lock predictions, start event recording |
| MATCH | RESULTS | Host ends or time reached | Calculate final scores, finalize results |
| RESULTS | LOBBY | Host resets room | Clear all game data, reset room |

---

## Key Principles

### No Scattered State
- Single source of truth: `GameState.phase`
- No boolean flags like `isDrafting`, `isMatchStarted`, etc.
- All phase-dependent logic checks the phase variable

### Atomic Transitions
- Phase changes are atomic operations
- All side effects execute as single transaction
- No partial state transitions

### Data Immutability by Phase
Each phase locks certain data:

```
LOBBY:       Room joinable, settings editable
DRAFT:       Settings locked, draft state tracked
PREDICTIONS: Draft locked, predictions tracked
MATCH:       Predictions locked, events recorded
RESULTS:     Everything locked and finalized
```

### Forward-Only (Mostly)
- Normal progression is forward only
- Rollback requires admin action (audit logged)
- Prevents accidental history corruption

---

## Implementation Pattern

```typescript
// Example: Transition to DRAFT phase
async transitionPhase(roomId: string, newPhase: GamePhase) {
  const currentRoom = await getRoom(roomId);
  
  // Validate transition
  validateTransition(currentRoom.phase, newPhase);
  
  // Execute phase-specific setup
  switch(newPhase) {
    case 'DRAFT':
      await initializeDraft(roomId);
      break;
    case 'PREDICTIONS':
      await closeDraft(roomId);
      break;
    // ...
  }
  
  // Atomic phase update
  await updatePhase(roomId, newPhase);
  
  // Record transition history
  await recordPhaseTransition(roomId, currentRoom.phase, newPhase);
}
```

---

## Error Handling

If transition fails:
- Rollback all changes
- Log error with context
- Notify players
- Room remains in previous phase

Invalid transitions:
- Cannot skip phases
- Cannot go backward (except admin rollback)
- Cannot transition if validations fail
