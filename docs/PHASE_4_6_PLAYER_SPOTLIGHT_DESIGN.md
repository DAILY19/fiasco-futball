# Phase 4.6 - Player Spotlight System Design

**Purpose:** Create a reusable component that highlights key players during match events, enabling social engagement during watch parties.

---

## Overview

The Player Spotlight system provides real-time visibility into individual player performance during matches. It highlights the highest-scoring drafted player, displays objective progress, shows triggered bonuses, and creates shareable moments for social engagement.

### Primary Use Cases
1. **Live Match Viewing** - Real-time player performance display
2. **Watch Parties** - Shareable player moments
3. **Results Analysis** - Post-match player performance breakdown
4. **Mobile Companion** - Side-by-side display with live match

---

## Component Architecture

### Core Component: `PlayerSpotlight`

```typescript
/**
 * PlayerSpotlight Component
 * 
 * Displays comprehensive player performance including:
 * - Drafted player details
 * - Active objectives progress
 * - Triggered fiasco bonuses
 * - Live event feed for that player
 * - Contribution to team score
 */

interface PlayerSpotlightProps {
  // Required: Identifies which player to display
  draftedPlayerId: string;           // Room player who drafted this match player
  matchPlayerId: string;              // The actual match player (athlete)
  roomId: string;
  
  // Display state
  mode: 'LIVE' | 'RESULTS';           // Live during match or post-game results
  isExpanded?: boolean;               // Full view vs. compact card
  
  // Data
  playerDetails: MatchPlayer;         // Name, team, position, jersey
  draftedByPlayer: RoomPlayer;        // Who drafted them
  currentScore: number;               // Points earned so far
  objectives: ObjectiveSpotlight[];   // Objective progress details
  fiascoBonuses: FiascoBonusSummary[]; // Bonuses triggered
  recentEvents: GameEvent[];          // Last 3-5 events for this player
  
  // Callbacks
  onExpand?: () => void;
  onShare?: () => void;
  onCompare?: (matchPlayerId: string) => void;
}

interface ObjectiveSpotlight {
  objectiveId: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE';
  points: number;
  
  // Progress tracking
  progress: {
    current: number;                  // e.g., 1 goal toward 2-goal brace
    target: number;                   // e.g., 2 for brace hunter
    percentage: number;               // 0-100 for UI progress bar
  };
  
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: number;
  
  // Visual
  icon: string;                       // Emoji or icon ID
  color: 'primary' | 'accent' | 'success' | 'warning';
}

interface FiascoBonusSummary {
  id: string;
  name: string;
  eventType: string;
  points: number;
  icon: string;
  timestamp: number;
  description: string;
  
  // Context
  eventDescription: string;           // "Red Card: Dangerous play"
  minute?: number;                    // Match minute
}
```

---

## Visual Structure

### Compact Mode (Card View)
**Height:** 280px | **Width:** 100% (mobile) / 400px (desktop)

```
┌─────────────────────────────────────┐
│ 🔴 LIVE                             │
├─────────────────────────────────────┤
│ #23 Mohamed Salah | Liverpool       │
│ FWD | Drafted by: Player 1          │
├─────────────────────────────────────┤
│ SCORE: 24 pts                       │
│ ┌─────────────────────────────────┐ │
│ │ Finisher: 2 goals = +6 pts ✓    │ │
│ │ Brace Hunter: 1/2 goals 50% ⬜ │ │
│ │ Clutch Player: 0 after 80' ⬜   │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ 🔥 OWN GOAL: +12 pts (minute 34)   │
│                                     │
│ [Details] [Share] [Compare]         │
└─────────────────────────────────────┘
```

### Expanded Mode (Full View)
**Height:** 600px+ | **Width:** 100% / 500px

```
┌─────────────────────────────────────────┐
│ 🔴 LIVE | #23 Mohamed Salah (Liverpool) │
├─────────────────────────────────────────┤
│ CURRENT SCORE: 24 points                │
│ Drafted by: Player 1 (@player1handle)   │
├─────────────────────────────────────────┤
│ OBJECTIVE PROGRESS                      │
│ ┌─────────────────────────────────────┐ │
│ │ 🎯 Finisher (+3 per goal)           │ │
│ │    2 goals scored = 6 points ✓      │ │
│ │    [●●○] Completed                  │ │
│ ├─────────────────────────────────────┤ │
│ │ 🎖️  Brace Hunter (2+ goals +10)    │ │
│ │    1 of 2 goals needed = 50%        │ │
│ │    [●●○○○] 50% Progress            │ │
│ ├─────────────────────────────────────┤ │
│ │ ⏱️  Clutch Player (goal after 80') │ │
│ │    No goals after 80' yet           │ │
│ │    [○○○] Not Started                │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ FIASCO BONUSES TRIGGERED                │
│ ┌─────────────────────────────────────┐ │
│ │ 🔥 Own Goal - 34:23                 │ │
│ │ Salah scored for opponent team      │ │
│ │ +12 points! Shared 234 times        │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ RECENT EVENTS                           │
│ • Goal (minute 34) - vs. Man City       │
│ • Assist (minute 28) - set up Trent    │
│ • Yellow Card (minute 15) - obstruction │
│ • Start - began in starting XI         │
│                                         │
│ [📊 Stats] [📤 Share] [⚖️ Compare] [✕] │
└─────────────────────────────────────────┘
```

---

## State Management

### PlayerSpotlight State Hook

```typescript
/**
 * usePlayerSpotlight Hook
 * 
 * Manages spotlight data for a single drafted player
 * Subscribes to real-time event updates
 * Maintains objective progress calculations
 */

interface UsePlayerSpotlightProps {
  draftedPlayerId: string;
  matchPlayerId: string;
  roomId: string;
  mode: 'LIVE' | 'RESULTS';
}

interface UsePlayerSpotlightReturn {
  playerDetails: MatchPlayer;
  draftedByPlayer: RoomPlayer;
  currentScore: number;
  objectives: ObjectiveSpotlight[];
  fiascoBonuses: FiascoBonusSummary[];
  recentEvents: GameEvent[];
  
  // Methods
  refreshData: () => Promise<void>;
  isLoading: boolean;
  error?: Error;
}

/**
 * Implementation Strategy
 * - Real-time listener on events for matchPlayerId
 * - Recalculate objectives on each new event
 * - Cache recent events (limit to 5)
 * - Debounce objective recalculation (500ms)
 * - Memo objective details to avoid re-renders
 */
```

---

## Objective Progress Tracking

### Progress Calculation Logic

```typescript
/**
 * Calculate objective progress percentage
 * Used for visual progress bars
 */

function calculateObjectiveProgress(
  objective: Objective,
  events: GameEvent[],
  matchPlayerId: string
): ObjectiveSpotlight {
  const relevantEvents = events.filter(
    e => e.matchPlayerId === matchPlayerId && !e.verified
  );

  switch (objective.id) {
    // Single-event objectives (binary)
    case 'WORKHORSE': {
      const hasStarted = relevantEvents.some(e => e.eventDefinitionId === 'STARTER');
      return {
        objectiveId: objective.id,
        name: objective.name,
        description: objective.description,
        rarity: objective.rarity,
        points: objective.points,
        progress: {
          current: hasStarted ? 1 : 0,
          target: 1,
          percentage: hasStarted ? 100 : 0,
        },
        status: hasStarted ? 'COMPLETED' : 'PENDING',
        icon: '⚽',
        color: hasStarted ? 'success' : 'primary',
      };
    }

    // Cumulative objectives (progress toward total)
    case 'FINISHER': {
      const goalCount = relevantEvents.filter(
        e => e.eventDefinitionId === 'GOAL'
      ).length;
      const isCompleted = goalCount > 0;
      return {
        objectiveId: objective.id,
        name: objective.name,
        description: objective.description,
        rarity: objective.rarity,
        points: objective.points * goalCount,
        progress: {
          current: goalCount,
          target: 1, // At least 1 goal
          percentage: isCompleted ? 100 : 0,
        },
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        icon: '⚽',
        color: 'primary',
      };
    }

    // Threshold objectives (need N events)
    case 'BRACE_HUNTER': {
      const goalCount = relevantEvents.filter(
        e => e.eventDefinitionId === 'GOAL'
      ).length;
      const isCompleted = goalCount >= 2;
      return {
        objectiveId: objective.id,
        name: objective.name,
        description: objective.description,
        rarity: objective.rarity,
        points: isCompleted ? objective.points : 0,
        progress: {
          current: goalCount,
          target: 2,
          percentage: Math.min((goalCount / 2) * 100, 100),
        },
        status: isCompleted ? 'COMPLETED' : goalCount > 0 ? 'IN_PROGRESS' : 'PENDING',
        icon: '💣',
        color: isCompleted ? 'success' : 'warning',
      };
    }

    // Time-based objectives
    case 'CLUTCH_PLAYER': {
      const lateGoals = relevantEvents.filter(
        e => e.eventDefinitionId === 'GOAL' && (e.matchMinute || 0) >= 80
      ).length;
      const isCompleted = lateGoals > 0;
      const matchStarted = relevantEvents.some(e => e.matchMinute !== undefined);
      const estimatedMinute = relevantEvents[0]?.matchMinute || 0;
      
      return {
        objectiveId: objective.id,
        name: objective.name,
        description: objective.description,
        rarity: objective.rarity,
        points: isCompleted ? objective.points : 0,
        progress: {
          current: Math.max(0, (estimatedMinute - 0) / (80 - 0)), // Time-based progress
          target: 80,
          percentage: matchStarted ? Math.min((estimatedMinute / 80) * 100, 100) : 0,
        },
        status: isCompleted ? 'COMPLETED' : 'IN_PROGRESS',
        icon: '⏱️',
        color: matchStarted ? 'warning' : 'primary',
      };
    }

    default:
      return {
        objectiveId: objective.id,
        name: objective.name,
        description: objective.description,
        rarity: objective.rarity,
        points: objective.points,
        progress: { current: 0, target: 1, percentage: 0 },
        status: 'PENDING',
        icon: '?',
        color: 'primary',
      };
  }
}
```

---

## Fiasco Bonus Integration

### Fiasco Bonus Display

```typescript
interface FiascoBonusSummary {
  id: string;
  name: string;                     // "Own Goal", "Red Card"
  eventType: string;                // "OWN_GOAL", "RED_CARD", "MISSED_PENALTY"
  points: number;                   // +12, +15, +10
  icon: string;                     // '🔥', '🔴', '⚽'
  timestamp: number;                // When it happened
  description: string;              // "Scored against own team"
  eventDescription: string;         // "Dangerous play (minute 34)"
  minute?: number;                  // Match minute when bonus triggered
}

/**
 * Extract fiasco bonuses triggered by a specific player
 */
function extractPlayerFiascoBonuses(
  events: GameEvent[],
  matchPlayerId: string
): FiascoBonusSummary[] {
  const fiascoEvents = events.filter(
    e => e.matchPlayerId === matchPlayerId && isFiascoBonus(e.eventDefinitionId)
  );

  return fiascoEvents.map(event => {
    const bonus = getFiascoBonus(event.eventDefinitionId);
    return {
      id: event.id,
      name: bonus?.name || 'Unknown',
      eventType: event.eventDefinitionId,
      points: bonus?.points || 0,
      icon: bonus?.icon || '❓',
      timestamp: event.timestamp,
      description: bonus?.description || 'Special event triggered',
      eventDescription: event.description,
      minute: event.matchMinute,
    };
  });
}
```

---

## Mobile Optimizations

### Compact Display Modes

#### Mobile Portrait (< 400px width)
```
┌──────────────────────────┐
│ 🔴 LIVE                  │
├──────────────────────────┤
│ Salah #23 Liverpool FWD  │
├──────────────────────────┤
│ SCORE: 24 pts            │
│ Finisher: 2/2 ✓          │
│ Brace H.: 1/2 50%        │
│ Clutch: 0/1              │
├──────────────────────────┤
│ 🔥 Own Goal +12 (34')   │
│                          │
│ [More] [Share] [×]       │
└──────────────────────────┘
```

#### Mobile Landscape (400-800px)
Side-by-side with match feed

```
┌──────────────────────────────────────┐
│ Salah #23 (24 pts)  │  Match Feed    │
│ ┌──────────────────┐ │ ┌────────────┐ │
│ │ Finisher: 2/2 ✓ │ │ │ 34' GOAL   │ │
│ │ Brace H.: 1/2  │ │ │ 28' ASSIST │ │
│ │ Clutch: 0/1    │ │ │ 15' YELLOW │ │
│ └──────────────────┘ │ │ Start: XI  │ │
│ 🔥 OWN GOAL +12      │ │            │ │
│ [Share]              │ │ [Details]  │ │
└──────────────────────────────────────┘
```

---

## Social Engagement Features

### Share Functionality

```typescript
interface SpotlightShareData {
  playerName: string;
  teamName: string;
  position: string;
  currentScore: number;
  momentType: 'OBJECTIVE_COMPLETE' | 'FIASCO_BONUS' | 'TOP_SCORER';
  
  // Formatted text for sharing
  shareText: string;              // "Mohamed Salah scored a BRACE!"
  shareHashtags: string[];        // ["#FiascoFutball", "#Salah"]
  shareImage?: string;            // Screenshot or generated card
}

/**
 * Share text generation
 * Examples:
 * - "🎯 Mohamed Salah completed Brace Hunter! 2 goals = +10 points!"
 * - "🔥 OWN GOAL! Salah scores for the other team: +12 points!"
 * - "⭐ Mohamed Salah is the Top Scorer with 24 points!"
 */
```

### Comparison Feature

```typescript
/**
 * Compare multiple PlayerSpotlight cards side-by-side
 * Shows performance ranking during match
 */

interface ComparisonMode {
  primary: PlayerSpotlight;        // User's drafted player
  comparing: PlayerSpotlight[];    // 1-3 other players to compare
  metric: 'SCORE' | 'OBJECTIVES' | 'BONUSES';
  
  // Example display:
  // [Salah 24pts | Mane 18pts | Firmino 12pts]
}
```

---

## Integration Points

### With GameContext
```typescript
// Real-time event subscription
const gameContext = useGameContext();

useEffect(() => {
  // Listen for new events affecting this match player
  const unsubscribe = gameContext.subscribeToPlayerEvents(
    matchPlayerId,
    (newEvent: GameEvent) => {
      // Recalculate objectives
      // Update fiasco bonuses
      // Refresh score
    }
  );
  
  return () => unsubscribe();
}, [matchPlayerId]);
```

### With Firebase
```typescript
// Real-time listener setup
collection(db, 'rooms', roomId, 'events')
  .where('matchPlayerId', '==', matchPlayerId)
  .orderBy('timestamp', 'desc')
  .limit(100)
  .onSnapshot(snapshot => {
    // Update component state
  });
```

---

## TypeScript Interfaces Summary

```typescript
// Main component props
type PlayerSpotlightProps = {
  draftedPlayerId: string;
  matchPlayerId: string;
  roomId: string;
  mode: 'LIVE' | 'RESULTS';
  isExpanded?: boolean;
  playerDetails: MatchPlayer;
  draftedByPlayer: RoomPlayer;
  currentScore: number;
  objectives: ObjectiveSpotlight[];
  fiascoBonuses: FiascoBonusSummary[];
  recentEvents: GameEvent[];
  onExpand?: () => void;
  onShare?: () => void;
  onCompare?: (matchPlayerId: string) => void;
};

// Objective progress tracking
type ObjectiveSpotlight = {
  objectiveId: string;
  name: string;
  description: string;
  rarity: 'COMMON' | 'RARE';
  points: number;
  progress: { current: number; target: number; percentage: number };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: number;
  icon: string;
  color: 'primary' | 'accent' | 'success' | 'warning';
};

// Bonus tracking
type FiascoBonusSummary = {
  id: string;
  name: string;
  eventType: string;
  points: number;
  icon: string;
  timestamp: number;
  description: string;
  eventDescription: string;
  minute?: number;
};

// Hook return type
type UsePlayerSpotlightReturn = {
  playerDetails: MatchPlayer;
  draftedByPlayer: RoomPlayer;
  currentScore: number;
  objectives: ObjectiveSpotlight[];
  fiascoBonuses: FiascoBonusSummary[];
  recentEvents: GameEvent[];
  refreshData: () => Promise<void>;
  isLoading: boolean;
  error?: Error;
};
```

---

## Implementation Roadmap

### Phase 4.6 (Current)
- [x] Design component specifications
- [x] Define TypeScript interfaces
- [x] Plan mobile optimizations
- [x] Design social integration

### Phase 4.7 (Next)
- [ ] Build `PlayerSpotlight` component (compact mode)
- [ ] Implement `usePlayerSpotlight` hook
- [ ] Wire up real-time event listeners
- [ ] Create progress calculation utilities

### Phase 4.8
- [ ] Build expanded mode UI
- [ ] Add social share functionality
- [ ] Implement comparison feature
- [ ] Mobile testing and optimization

---

## Accessibility Considerations

- **Color Contrast:** Use color + icon + text (not color-only indicators)
- **Progress Bars:** Include percentage text alongside visual bar
- **Keyboard Navigation:** Support Tab/Enter for expand/share/compare
- **Screen Readers:** Label objectives with aria-label, announce score updates
- **Touch Targets:** Buttons ≥ 44x44px on mobile

---

## Performance Considerations

- **Memoization:** Memo objective array to prevent unnecessary recalculations
- **Debouncing:** Debounce event listener callbacks (500ms)
- **Virtualization:** If displaying 10+ players, use windowing
- **Lazy Loading:** Load expanded view content on-demand
- **Real-time Updates:** Use Firebase `onSnapshot` with efficient queries

---

**Document Complete:** Player Spotlight System Design  
**Status:** Ready for Implementation
