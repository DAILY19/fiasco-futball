# Quick Start Guide - Phase 2 Foundation

## What Was Built

You now have the complete foundation for Fiasco Futball with **zero gameplay implemented yet**. This is intentional - the architecture is in place to support all future features without rewriting systems.

## Key Files to Know

### 1. Type Definitions
**Start here to understand the data model**

- [src/types/entities.ts](../src/types/entities.ts) - All core entities (Player, Room, GameEvent, etc.)
- [src/types/api.ts](../src/types/api.ts) - Request/response types

### 2. Reference Data (Registries)
**All game mechanics defined here - nowhere else**

- [src/registries/eventRegistry.ts](../src/registries/eventRegistry.ts) - 20+ events with icons and point values
- [src/registries/categoryRegistry.ts](../src/registries/categoryRegistry.ts) - 8 draft categories with scoring rules
- [src/registries/scoringRegistry.ts](../src/registries/scoringRegistry.ts) - Centralized point values and multipliers

### 3. Business Logic (Services)
**Where all game logic lives - not in components**

- [src/services/roomService.ts](../src/services/roomService.ts) - Room creation and management
- [src/services/eventService.ts](../src/services/eventService.ts) - Event recording and verification
- [src/services/draftService.ts](../src/services/draftService.ts) - Draft phase logic
- [src/services/predictionService.ts](../src/services/predictionService.ts) - Prediction handling
- [src/services/scoreService.ts](../src/services/scoreService.ts) - Scoring and leaderboard
- [src/services/fiascoService.ts](../src/services/fiascoService.ts) - Core game orchestration

### 4. State Management (Contexts)
**How components access data**

- [src/contexts/GameContext.tsx](../src/contexts/GameContext.tsx) - Game state and phase
- [src/contexts/RoomContext.tsx](../src/contexts/RoomContext.tsx) - Room and player data
- [src/contexts/ScoringContext.tsx](../src/contexts/ScoringContext.tsx) - Leaderboard and predictions

### 5. Design Documentation
**Read these to understand the system**

- [docs/ARCHITECTURE.md](./ARCHITECTURE.md) - Complete architecture overview
- [docs/STATE_MACHINE.md](./STATE_MACHINE.md) - Game phase flow and transitions
- [docs/FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) - Database structure and queries

---

## Adding New Content

### To Add a New Event
Edit [src/registries/eventRegistry.ts](../src/registries/eventRegistry.ts):

```typescript
AWESOME_EVENT: {
  id: 'AWESOME_EVENT',
  displayName: 'Awesome Event',
  icon: '🎉',
  fiascoValue: 20,
  category: 'EVENTS'
}
```

That's it! The event is now available everywhere.

### To Add a New Category
Edit [src/registries/categoryRegistry.ts](../src/registries/categoryRegistry.ts):

```typescript
AWESOME_CATEGORY: {
  id: 'AWESOME_CATEGORY',
  name: 'Awesome Category',
  description: 'Players predict awesome things',
  scoringTriggers: [
    { eventId: 'AWESOME_EVENT', basePoints: 20 }
  ]
}
```

### To Add a New Game Mode
- Extend `MatchSettings` in [src/types/entities.ts](../src/types/entities.ts)
- Add configuration to registry
- Create service methods if needed
- No existing code needs changes

---

## Design Principles

### ✅ DO
- Put all game mechanics in registries
- Put all logic in services
- Use contexts to pass data to components
- Use TypeScript interfaces everywhere
- Keep components simple (UI only)

### ❌ DON'T
- Hardcode events or categories anywhere
- Put business logic in components
- Create magic numbers (use registries/services)
- Skip type definitions
- Mutate state directly

---

## Phase Machine at a Glance

```
LOBBY → DRAFT → PREDICTIONS → MATCH → RESULTS
```

Each phase:
- Has specific allowed actions
- Locks certain data
- Triggers phase-specific logic
- Cannot be skipped or reversed (except admin rollback)

See [docs/STATE_MACHINE.md](./STATE_MACHINE.md) for details.

---

## Next Implementation Steps

1. **Implement Services** (Connect to Firebase)
   - Each service method currently throws "Not implemented"
   - Add Firebase calls
   - Add error handling

2. **Create Real-time Listeners**
   - Subscribe to room changes in contexts
   - Subscribe to event updates
   - Subscribe to score changes

3. **Build UI Components**
   - Create Lobby screen (room creation/joining)
   - Create Draft screen (category selection)
   - Create Predictions screen (prediction input)
   - Create Game Board (event recording)
   - Create Leaderboard (results)

4. **Wire Components to Contexts**
   - Components use `useGame()`, `useRoom()`, `useScoring()`
   - Display data from contexts
   - Call service methods on user actions

---

## Expandability Check

### Multiple Sports?
✅ **Covered** - `Sport` type, sport filtering in registries, MatchSettings supports any sport

### Additional Game Modes?
✅ **Covered** - MatchSettings is extensible, services are generic, registries support sport/mode filtering

### Additional Event Types?
✅ **Covered** - Add to eventRegistry, automatically available everywhere

### Additional Categories?
✅ **Covered** - Add to categoryRegistry, appears in draft automatically

### AI Event Suggestions?
✅ **Ready for** - Service layer can call external AI APIs, results feed into normal event flow

### Seasonal Modes?
✅ **Ready for** - Create seasonal registry, extend MatchSettings with season field

### Custom House Rules?
✅ **Ready for** - MatchSettings.customRules stores arbitrary data, services can apply rules

---

## Code Organization

```
INPUT (User Action)
  ↓
COMPONENT (src/components/)
  ↓ calls
SERVICE (src/services/)
  ↓ validates using
REGISTRY (src/registries/)
  ↓ persists to
FIREBASE (Firestore)
  ↓ real-time update
CONTEXT (src/contexts/)
  ↓ triggers re-render
COMPONENT (displays new state)
```

This flow is consistent throughout the entire application.

---

## File Size Summary

- **Type Definitions**: ~280 lines (entities.ts, api.ts)
- **Registries**: ~400 lines (3 files)
- **Services**: ~500 lines (6 skeleton files)
- **Contexts**: ~400 lines (3 skeleton files)
- **Documentation**: ~1000 lines (3 files)

**Total Foundation**: ~2500 lines of well-structured, documented, ready-to-extend code

---

## Common Questions

**Q: Why so much structure for no gameplay?**
A: Because this structure prevents the chaos that comes later. Adding features now is one line per registry. Without this, you'll be refactoring constantly.

**Q: Can I change the phase machine?**
A: It's designed to be unchangeable once gaming starts. If needed, you can add sub-phases or parallel states, but the core 5 phases should remain.

**Q: What if I need a new field on Room?**
A: Add to the `Room` interface in entities.ts, add to Firestore schema, update related services. Type safety ensures nothing breaks.

**Q: How do I add player authentication?**
A: Extend services with auth logic, add AuthContext provider, integrate Firebase Auth. The structure supports it.

---

## Ready to Implement?

Start here:

1. **Pick a service** (start with RoomService - it's foundational)
2. **Follow the TODO comments** in each service method
3. **Connect to Firebase** using the schema from FIRESTORE_SCHEMA.md
4. **Test with Firestore emulator**
5. **Move to next service**
6. **Then build contexts** (connect services to real-time listeners)
7. **Finally build components** (wire up contexts)

The architecture is your guide - follow it and everything clicks into place.
