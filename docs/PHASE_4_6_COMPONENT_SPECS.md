# Phase 4.6 - Reusable Component Specifications

**Purpose:** Define component API contracts, props, state, and reusability patterns for core Fiasco Futball UI components.

---

## Component Hierarchy

```
┌─ ObjectiveCard
│  └─ Shows single objective progress
│
├─ DraftPlayerCard
│  └─ Shows draftable match player
│
├─ PlayerSpotlight
│  ├─ ObjectiveCard[]
│  └─ FiascoBonusPanel
│
├─ FiascoBonusPanel
│  └─ Shows triggered bonuses
│
├─ LeaderboardCard
│  └─ One-per-row leaderboard entry
│
├─ EventFeedItem
│  └─ Single event in event feed
│
└─ Leaderboard
   └─ LeaderboardCard[]
```

---

## 1. ObjectiveCard

**Purpose:** Display single objective with progress tracking  
**Reusability:** Used in PlayerSpotlight, Objective browser, Results breakdown  
**Minimal Styling:** No background, relies on semantic layout

### Props

```typescript
interface ObjectiveCardProps {
  // Objective definition
  objectiveId: string;
  name: string;                       // "Finisher", "Brace Hunter"
  description: string;                // "+3 per Goal", "+10 if 2+ goals"
  rarity: 'COMMON' | 'RARE';          // Visual styling cue
  
  // Progress state
  currentPoints: number;              // Points earned so far
  maxPoints: number;                  // Total points if completed
  progress?: {
    current: number;                  // 1 goal toward Brace Hunter
    target: number;                   // 2 total needed
    percentage: number;               // 0-100 for progress bar
  };
  
  // Status
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: number;               // Timestamp when completed
  
  // Visual
  icon?: string;                      // Emoji: "🎯", "💣", "⏱️"
  color?: 'primary' | 'accent' | 'success' | 'warning' | 'danger';
  
  // Interaction
  showDetails?: boolean;              // Expand to show full description
  onClick?: () => void;
  onExpand?: () => void;
  
  // Layout
  size?: 'compact' | 'default' | 'large';
  orientation?: 'horizontal' | 'vertical'; // Card vs inline
}
```

### Layout Variants

#### Compact (Mobile)
```
🎯 Finisher: 2/2 ✓ (+6 pts)
[████████████] 100%
```

#### Default (Tablet/Desktop)
```
┌────────────────────────────────────┐
│ 🎯 Finisher                        │
│ +3 per goal                        │
│                                    │
│ Progress: 2 goals = 6 points ✓    │
│ [████████████████] 100%            │
│ Status: Completed (12:34 PM)       │
└────────────────────────────────────┘
```

#### Large (Results screen)
```
┌──────────────────────────────────────┐
│ 🎯 FINISHER                          │
│ +3 per goal                          │
│                                      │
│ 2 goals during match = 6 points      │
│                                      │
│ ██████████████████████ 100%          │
│                                      │
│ ✓ Completed at 12:34 PM              │
│ Position: Rare                       │
│ Rarity: Common (2 per player)        │
└──────────────────────────────────────┘
```

### Component States

```typescript
// Pending - Not achieved yet
<ObjectiveCard
  status="PENDING"
  progress={{ current: 0, target: 2, percentage: 0 }}
  currentPoints={0}
/>

// In Progress - Partially achieved
<ObjectiveCard
  status="IN_PROGRESS"
  progress={{ current: 1, target: 2, percentage: 50 }}
  currentPoints={0}
/>

// Completed - Objective met
<ObjectiveCard
  status="COMPLETED"
  progress={{ current: 2, target: 2, percentage: 100 }}
  currentPoints={10}
  completedAt={Date.now()}
/>
```

### Styling Rules

- **Text:** Black on white (system colors)
- **Progress bar:** Green (#4CAF50) when completed, Blue (#2196F3) in progress
- **Rarity indicator:** COMMON = gray, RARE = gold/amber
- **No background required:** Use padding/spacing instead
- **Icons:** Emoji for simplicity (no image assets)

### Reusable Logic

```typescript
/**
 * useObjectiveProgress Hook
 * Encapsulates progress calculation logic
 */
interface UseObjectiveProgressProps {
  objectiveId: string;
  events: GameEvent[];
  matchPlayerId: string;
}

interface UseObjectiveProgressReturn {
  currentPoints: number;
  progress: { current: number; target: number; percentage: number };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: number;
}

/**
 * Export progress calculation for use in tests
 */
export function calculateObjectiveProgress(
  objective: Objective,
  events: GameEvent[]
): UseObjectiveProgressReturn {
  // Encapsulate logic from ObjectiveService.checkObjectiveCompletion
}
```

---

## 2. DraftPlayerCard

**Purpose:** Display draftable match player during draft phase  
**Reusability:** Draft board, player browser, player search  
**Minimal Styling:** Clean, functional layout

### Props

```typescript
interface DraftPlayerCardProps {
  // Player data
  matchPlayerId: string;
  name: string;                       // "Mohamed Salah"
  position: string;                   // "FWD", "MID", "DEF", "GK"
  team: string;                       // "Liverpool"
  number?: number;                    // Jersey number
  
  // Metadata
  form?: 'excellent' | 'good' | 'average' | 'poor'; // Visual indicator
  recentGoals?: number;               // Last 5 games
  recentAssists?: number;
  averageRating?: number;             // 7.2 out of 10
  
  // Draft state
  isDrafted?: boolean;                // Already selected
  draftedBy?: string;                 // Username if drafted
  pickNumber?: number;                // Which pick (1, 2, 3...)
  
  // Selection state
  isSelected?: boolean;               // Highlighted for current player
  isHovering?: boolean;               // Hover state
  
  // Actions
  onClick?: () => void;
  onPreview?: () => void;             // Show player stats/history
  onDraft?: () => void;               // Make selection
  onCompare?: () => void;             // Compare with another player
  
  // Layout
  variant?: 'compact' | 'default' | 'detailed';
  showStats?: boolean;
  showTeamLogo?: boolean;
  
  // Disabled state
  isDisabled?: boolean;
  disabledReason?: string;            // "Already drafted", "Not available"
}
```

### Layout Variants

#### Compact (Mobile draft list)
```
┌──────────────────────────┐
│ #23 | Salah | FWD |      │
│ Liverpool | Form: Excellent
│ [Draft]                  │
└──────────────────────────┘
```

#### Default (Draft board)
```
┌────────────────────────────────┐
│ Mohamed Salah #23              │
│ Liverpool | Forward            │
│                                │
│ Form: ⭐⭐⭐⭐⭐ (Excellent)  │
│ Recent: 3 goals, 2 assists    │
│                                │
│ [Draft Me]  [Stats]            │
└────────────────────────────────┘
```

#### Detailed (Player preview popup)
```
┌───────────────────────────────────┐
│ Mohamed Salah #23                 │
│ Liverpool | Forward               │
│                                   │
│ ⭐⭐⭐⭐⭐ Excellent Form        │
│ Avg Rating: 7.8/10                │
│ Last 5: 3G 2A                     │
│ Status: Active                    │
│                                   │
│ DRAFTED BY: Player 1 (Pick #2)    │
│                                   │
│ Projected Objectives:             │
│ • Finisher (+3/goal)              │
│ • Brace Hunter (2+)               │
│ • Clutch Player (goal 80+)        │
│                                   │
│ [Draft]  [Compare]  [×]           │
└───────────────────────────────────┘
```

### Component States

```typescript
// Available - Can be drafted
<DraftPlayerCard
  name="Salah"
  isDrafted={false}
  isSelected={true}
  onClick={handleSelect}
/>

// Drafted - Already taken
<DraftPlayerCard
  name="Haaland"
  isDrafted={true}
  draftedBy="Player 2"
  pickNumber={1}
  isDisabled={true}
/>

// Disabled - Not available
<DraftPlayerCard
  name="Injured Player"
  isDisabled={true}
  disabledReason="Injured - Out for 2 weeks"
/>
```

### Styling Rules

- **Background:** Light gray when drafted, white when available
- **Text:** Black (#333) on white/gray
- **Position indicator:** Color-coded (FWD=red, MID=yellow, DEF=blue, GK=green)
- **Form rating:** 1-5 stars
- **Selected state:** Border highlight, shadow effect
- **Disabled state:** Opacity 0.6, strikethrough if possible

---

## 3. FiascoBonusPanel

**Purpose:** Display triggered fiasco bonuses  
**Reusability:** Player spotlight, event feed, results screen  
**Emphasis:** Draw attention to high-impact moments

### Props

```typescript
interface FiascoBonusPanelProps {
  // Bonus data
  bonusId: string;
  name: string;                       // "Own Goal", "Red Card"
  eventType: string;                  // "OWN_GOAL", "RED_CARD"
  points: number;                     // +12, +15, +10
  icon: string;                       // "🔥", "🔴", "⚽"
  
  // Context
  playerName: string;                 // Player who triggered bonus
  matchPlayerId?: string;             // Player ID
  timestamp: number;                  // When it happened
  minute?: number;                    // Match minute (34')
  
  // Event details
  eventDescription: string;           // "Red card: dangerous play"
  draftedBy?: string;                 // Username of player who drafted them
  
  // Interaction
  onClick?: () => void;
  onShare?: () => void;               // Share to social
  
  // Visual
  variant?: 'alert' | 'achievement' | 'notification';
  size?: 'compact' | 'default' | 'prominent';
  showAnimation?: boolean;             // Alert animation on appearance
}
```

### Layout Variants

#### Compact (Event feed)
```
🔥 OWN GOAL (Salah) - 34:12 | +12 pts
```

#### Default (Player spotlight)
```
┌──────────────────────────┐
│ 🔥 OWN GOAL              │
│                          │
│ Mohamed Salah            │
│ Scored for opponent      │
│                          │
│ Minute: 34:12            │
│ Points: +12              │
│                          │
│ [Share] [Details]        │
└──────────────────────────┘
```

#### Prominent (Notification)
```
╔══════════════════════════════════╗
║ 🔥 FIASCO BONUS! OWN GOAL! 🔥  ║
║                                  ║
║ Mohamed Salah (Liverpool)        ║
║ Scored for Manchester City!      ║
║                                  ║
║ +12 POINTS!                      ║
║                                  ║
║ [Share to Twitter] [×]           ║
╚══════════════════════════════════╝
```

### Component States

```typescript
// Alert state (just happened)
<FiascoBonusPanel
  variant="alert"
  showAnimation={true}
  points={15}
/>

// Achievement state (collected in results)
<FiascoBonusPanel
  variant="achievement"
  showAnimation={false}
/>

// Notification state (in feed)
<FiascoBonusPanel
  variant="notification"
  size="compact"
/>
```

### Styling Rules

- **Background:** Red/orange gradient (#FF5722 to #FF8A65)
- **Text:** White text for contrast
- **Icon:** Large emoji (32px+) for prominence
- **Animation:** Slide-in + pulse effect for "alert" variant
- **Border:** Thick border (3px) in darker red
- **Points highlight:** Bold, large text, gold color

---

## 4. LeaderboardCard

**Purpose:** Display single leaderboard entry  
**Reusability:** Leaderboard table, player standings, results screen  
**Minimal Styling:** Row-based layout

### Props

```typescript
interface LeaderboardCardProps {
  // Player info
  playerId: string;
  displayName: string;
  avatar?: string;
  
  // Standings
  rank: number;                       // 1st, 2nd, 3rd...
  totalPoints: number;                // Total score
  
  // Breakdown
  objectiveScore?: number;            // From objectives
  fiascoScore?: number;               // From fiasco bonuses
  correctPredictions?: number;        // Prediction accuracy
  totalPredictions?: number;
  
  // Visual
  position?: 'TOP' | 'MIDDLE' | 'BOTTOM'; // Ranking tier
  isDraft?: boolean;                  // This is a drafted player
  
  // Interaction
  onClick?: () => void;               // Show player details
  onCompare?: () => void;
  
  // Layout
  variant?: 'inline' | 'card' | 'detailed';
  showBreakdown?: boolean;            // Show score components
  showAccuracy?: boolean;             // Show prediction accuracy
}
```

### Layout Variants

#### Inline (Mobile leaderboard)
```
1. Salah                  24 pts ⭐
2. Haaland                19 pts
3. De Bruyne              17 pts
```

#### Card (Desktop leaderboard row)
```
┌─────────────────────────────────────────┐
│ 1  🏆  Salah  [Avatar]  24 points        │
│     Objectives: 12 pts | Fiascos: 12 pts │
│     Predictions: 6/8 (75% accuracy)      │
│     [View Details] [Compare]             │
└─────────────────────────────────────────┘
```

#### Detailed (Player results card)
```
┌────────────────────────────────────────┐
│ 1ST PLACE                              │
├────────────────────────────────────────┤
│ 🏆 Salah (@user)                       │
│ [Avatar Image]                         │
│                                        │
│ TOTAL SCORE: 24 pts                    │
│                                        │
│ Score Breakdown:                       │
│  • Objective Score: 12 pts             │
│    - Finisher (2 goals): +6 pts        │
│    - Brace Hunter (2+ goals): +10 pts  │
│    - Clutch Player (goal 80+): 0 pts   │
│                                        │
│  • Fiasco Bonuses: 12 pts              │
│    - Own Goal: +12 pts                 │
│                                        │
│  • Prediction Accuracy: 6/8 (75%)      │
│    - +3 points                         │
│                                        │
│ [Achievements] [Share Results] [×]    │
└────────────────────────────────────────┘
```

### Component States

```typescript
// Top scorer - highlighted
<LeaderboardCard
  rank={1}
  position="TOP"
  totalPoints={24}
/>

// Middle rank - neutral
<LeaderboardCard
  rank={4}
  position="MIDDLE"
  totalPoints={10}
/>

// Last place - subtle
<LeaderboardCard
  rank={8}
  position="BOTTOM"
  totalPoints={3}
/>
```

### Styling Rules

- **Top 3:** Gold, silver, bronze backgrounds
- **Rank number:** Bold, large (18px+)
- **Trophy icon:** Only for rank 1-3
- **Score:** Prominently displayed, bold
- **Breakdown:** Smaller text, secondary color
- **No external borders:** Use background color for tier indication

---

## 5. EventFeedItem

**Purpose:** Display single match event in feed  
**Reusability:** Event feed, player timeline, match recap  
**Minimal Styling:** Timeline-style layout

### Props

```typescript
interface EventFeedItemProps {
  // Event data
  eventId: string;
  eventType: string;                  // "GOAL", "YELLOW_CARD", etc.
  eventDefinitionId: string;          // Registry reference
  
  // Context
  matchPlayerId: string;              // Player who triggered event
  playerName: string;                 // "Mohamed Salah"
  playerTeam?: string;                // "Liverpool"
  playerPosition?: string;            // For context
  
  // Timing
  timestamp: number;
  matchMinute?: number;               // 0-90+
  
  // Details
  description: string;                // "Scored a goal vs Man City"
  eventDetails?: Record<string, any>; // Extra data
  
  // Visual
  icon?: string;                      // Emoji or icon ID
  severity?: 'positive' | 'neutral' | 'negative';
  
  // State
  isVerified?: boolean;               // Event confirmed
  verifiedBy?: string;                // Who verified it
  
  // Interaction
  onClick?: () => void;
  onDismiss?: () => void;
  onReact?: (reaction: string) => void; // Emoji reactions
  
  // Layout
  variant?: 'timeline' | 'feed' | 'compact';
  showPlayer?: boolean;
  showMinute?: boolean;
}
```

### Layout Variants

#### Timeline (Match timeline)
```
34' ⚽ Goal         Salah scored vs Man City
28' 🎯 Assist       Salah set up TAA
15' 🟡 Yellow Card  Salah - obstruction
```

#### Feed (Scrolling event feed)
```
┌────────────────────────────────────┐
│ 34:12  ⚽                          │
│ GOAL                               │
│                                    │
│ Mohamed Salah (Liverpool) scored   │
│ vs Manchester City                 │
│                                    │
│ [Details]  [React]                 │
└────────────────────────────────────┘
```

#### Compact (Mobile feed)
```
34' ⚽ Salah GOAL
28' 🎯 Salah ASSIST
```

### Component States

```typescript
// Positive event (goal, assist)
<EventFeedItem
  eventType="GOAL"
  severity="positive"
  icon="⚽"
/>

// Neutral event (start)
<EventFeedItem
  eventType="STARTER"
  severity="neutral"
  icon="📋"
/>

// Negative event (card, foul)
<EventFeedItem
  eventType="YELLOW_CARD"
  severity="negative"
  icon="🟡"
/>

// Unverified event
<EventFeedItem
  isVerified={false}
  description="Pending verification..."
/>
```

### Styling Rules

- **Positive events:** Green text/icon (#4CAF50)
- **Neutral events:** Gray text/icon (#999)
- **Negative events:** Red text/icon (#F44336)
- **Timestamp:** Small, secondary color
- **Icon:** Consistent size with text (16-20px)
- **Player name:** Bold
- **Unverified:** Italic, slightly faded

---

## 6. LeaderboardTable

**Purpose:** Container for multiple LeaderboardCard entries  
**Reusability:** Results screen, match progress, standings page  
**Minimal Styling:** List layout, no fancy styling

### Props

```typescript
interface LeaderboardTableProps {
  // Data
  entries: LeaderboardEntry[];        // Sorted by rank
  
  // Configuration
  maxEntries?: number;                // Limit displayed (e.g., top 10)
  showBreakdown?: boolean;            // Show score components
  showAccuracy?: boolean;             // Show prediction accuracy
  
  // Sorting
  sortBy?: 'POINTS' | 'RANK' | 'ACCURACY';
  sortOrder?: 'ASC' | 'DESC';
  
  // Interaction
  onSelectPlayer?: (playerId: string) => void;
  onCompare?: (playerIds: string[]) => void;
  
  // State
  isLoading?: boolean;
  error?: string;
  
  // Layout
  variant?: 'compact' | 'default' | 'detailed';
  showPodium?: boolean;               // Top 3 highlighted
  highlightPlayerId?: string;         // Highlight current user
}
```

### Layout

#### Compact (Mobile)
```
┌──────────────────────────┐
│ LEADERBOARD              │
├──────────────────────────┤
│ 1  Salah        24 pts   │
│ 2  Haaland      19 pts   │
│ 3  De Bruyne    17 pts   │
│ 4  Mane         15 pts   │
│ 5  You          12 pts ← │
└──────────────────────────┘
```

#### Default (Desktop)
```
┌─────────────────────────────────────────┐
│ FINAL LEADERBOARD                       │
├─────────────────────────────────────────┤
│ 🥇 1   Salah          24 pts            │
│ 🥈 2   Haaland        19 pts            │
│ 🥉 3   De Bruyne      17 pts            │
│ ─ 4    Mane           15 pts            │
│ → 5    You            12 pts [Details]  │
│ ─ 6    Firmino        10 pts            │
│ ─ 7    Diaz            8 pts            │
│ ─ 8    Trent           5 pts            │
└─────────────────────────────────────────┘
```

#### Detailed (Results screen)
```
[Same as Default but with additional breakdown columns]
```

---

## 7. EventFeed

**Purpose:** Container for multiple EventFeedItem entries  
**Reusability:** Match timeline, player timeline, event history  
**Minimal Styling:** Scrollable list

### Props

```typescript
interface EventFeedProps {
  // Data
  events: GameEvent[];
  
  // Filtering
  filterBy?: {
    eventType?: string;               // Only show specific event types
    matchPlayerId?: string;           // Only show events for player
    severity?: string[];              // positive, neutral, negative
  };
  
  // Sorting
  sortOrder?: 'ASC' | 'DESC';         // Newest first or oldest first
  
  // Pagination
  maxItems?: number;
  showLoadMore?: boolean;
  
  // Interaction
  onEventClick?: (event: GameEvent) => void;
  onReact?: (eventId: string, reaction: string) => void;
  
  // State
  isLoading?: boolean;
  isEmpty?: boolean;
  
  // Layout
  variant?: 'compact' | 'default' | 'detailed';
  direction?: 'vertical' | 'timeline';
}
```

---

## Summary Table

| Component | Purpose | Reusability | Complexity |
|-----------|---------|-------------|-----------|
| ObjectiveCard | Objective progress | High (6+ screens) | Medium |
| DraftPlayerCard | Draftable player | High (4+ screens) | Low |
| FiascoBonusPanel | Triggered bonuses | Medium (3+ screens) | Low |
| LeaderboardCard | Standings entry | High (3+ screens) | Low |
| EventFeedItem | Match event | High (4+ screens) | Low |
| LeaderboardTable | Standings container | Medium (2+ screens) | Low |
| EventFeed | Event container | Medium (2+ screens) | Low |
| PlayerSpotlight | Player performance | Medium (2 screens) | High |

---

## Styling Philosophy

### Principles
1. **Semantic HTML first** - Rely on structure, not styling
2. **Minimal colors** - Use system colors (white, black, gray)
3. **Icons over images** - Use emoji for universal support
4. **Progressive disclosure** - Show key info, details on demand
5. **No animations required** - Add smoothing as enhancement
6. **Accessible by default** - Color + text + icons (not color-only)

### Color Palette
```
Primary:    #2196F3 (Blue)     - Actions, progress
Success:    #4CAF50 (Green)    - Positive events, completion
Warning:    #FF9800 (Orange)   - In-progress, caution
Danger:     #F44336 (Red)      - Negative events, errors
Accent:     #E91E63 (Pink)     - Highlights, emphasis
Neutral:    #999999 (Gray)     - Disabled, secondary

Backgrounds:
White:      #FFFFFF           - Main background
Light:      #F5F5F5           - Cards, sections
Dark:       #333333           - Text
```

### Typography
- **Headings:** Bold, 18-24px
- **Body:** Regular, 14-16px
- **Secondary:** Regular, 12px, gray
- **Monospace:** For numbers/scores (14-16px)

---

## State Management Pattern

All components follow this pattern:

```typescript
interface ComponentState {
  // Display state
  isExpanded: boolean;
  isLoading: boolean;
  error?: string;
  
  // Selection state (if applicable)
  isSelected: boolean;
  isHovering: boolean;
  
  // Data state
  data: ComponentData;
}

// Props are mostly data-driven
// State is managed by parent or hook
// Component renders based on props + minimal local state
```

---

## Testing Strategy

Each component should have:
1. **Snapshot tests** - Verify layout stability
2. **Props tests** - Verify all prop combinations work
3. **State tests** - Verify state transitions
4. **A11y tests** - Verify keyboard nav, screen reader support
5. **Visual regression tests** - Catch styling regressions

---

## Future Enhancements

### Component Composition
- Could combine ObjectiveCard + FiascoBonusPanel into ScoreBreakdownCard
- Could create PlayerCard wrapper combining multiple sub-components

### Animation
- Add smooth transitions to progress bars
- Add pulse animation to new fiasco bonuses
- Add slide-in animation to event feed items

### Variants
- Add dark mode variants (if needed)
- Add print-friendly variants (for sharing)

---

**Document Complete:** Reusable Component Specifications  
**Status:** Ready for Component Implementation
