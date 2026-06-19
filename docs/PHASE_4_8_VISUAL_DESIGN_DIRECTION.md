# Phase 4.8 - Visual Design Direction

## Design Philosophy

**Fiasco Futball should feel like a fun party game designed by soccer fans, not a premium sports simulation.**

The game lives at the intersection of:
- **Watch-party ready** — Easy to follow during live commentary
- **Mobile-first** — Readable at 320px width, fast to tap
- **Slightly chaotic** — Matches the "fiasco" theme; busy but not cluttered
- **Soccer-themed** — Uses sport visuals without pretending to be a professional app
- **Fast and scannable** — Events should be understood in under 5 seconds
- **Fun but not childish** — Appeals to casual adults, not just kids

---

## Core Visual System

### Color Palette

#### Primary Brand Colors
| Color | Hex | Use | 
|-------|-----|-----|
| **Soccer Blue** | `#1976d2` | Headers, primary buttons, accents |
| **Soccer Green** | `#4CAF50` | Success states, progress, objectives completed |
| **Soccer Orange** | `#FF6F00` | Highlights, player spotlights, hot moments |
| **Fiasco Flame** | `#FFC107` | Fiasco bonuses, jackpot moments, alerts |
| **Warning Red** | `#D32F2F` | Red cards, errors, critical alerts |

#### Neutral Colors
| Color | Hex | Use |
|-------|-----|-----|
| **Light Gray** | `#f5f5f5` | Default backgrounds |
| **Medium Gray** | `#999` | Secondary text, disabled states |
| **Dark Gray** | `#333` | Body text, primary content |
| **Divider Gray** | `#e0e0e0` | Lines, borders, subtle dividers |
| **White** | `#fff` | Card backgrounds, text backgrounds |

#### Semantic Colors
| State | Color | Hex |
|-------|-------|-----|
| **Success** | Green | `#4CAF50` |
| **Warning** | Amber | `#FFC107` |
| **Error** | Red | `#D32F2F` |
| **Info** | Blue | `#1976d2` |
| **Neutral** | Gray | `#999` |

---

### Typography

#### Font Stack
```css
font-family: system-ui, -apple-system, 'Segoe UI', 'Roboto', sans-serif;
```

#### Sizing Guidelines
| Usage | Size | Weight | Line Height |
|-------|------|--------|-------------|
| **Screen header** | 24px | 700 | 1.2 |
| **Card title** | 16px | 700 | 1.3 |
| **Body text** | 14px | 400 | 1.5 |
| **Small label** | 12px | 500 | 1.4 |
| **Tiny helper** | 11px | 400 | 1.3 |

#### Accessibility Rules
- Minimum body text: **14px** on mobile
- Never use gray text lighter than **#999** on white backgrounds
- Contrast ratio for all text: **4.5:1 minimum** (WCAG AA)
- Important info (scores, objective points) should be **bold** and **16px+**

---

### Spacing & Layout

#### Spacing Scale
```css
4px   → Tiny gaps within components
8px   → Spacing between related elements
12px  → Spacing between moderate sections
16px  → Standard padding and margins
24px  → Large section gaps
```

#### Mobile-First Rules
- **Min tap target:** 44x44px (iOS) / 48x48px (Android)
- **Safe margins:** 16px padding on left/right (except full-bleed backgrounds)
- **Max content width:** 600px (on tablets, content centered with side margins)
- **Scroll distance:** Minimize vertical scrolling on draft and match screens

---

### Component Styling Framework

#### Card Style (Base for most components)
```css
Background: #fff
Border: 1px solid #e0e0e0
Border-radius: 8px
Padding: 16px (mobile), 20px (tablet)
Box-shadow: 0 2px 4px rgba(0,0,0,0.08)
Margin-bottom: 12px
```

#### Button Style (Primary)
```css
Background: #1976d2
Color: #fff
Padding: 12px 16px
Border-radius: 4px
Font-size: 14px
Font-weight: 600
Min-height: 44px
Border: none
Cursor: pointer
Transition: background 0.2s ease
```

#### Button Style (Secondary)
```css
Background: #f5f5f5
Color: #333
Padding: 12px 16px
Border: 1px solid #ddd
Border-radius: 4px
Font-size: 14px
Font-weight: 500
```

#### Badge/Pill Style
```css
Display: inline-block
Padding: 4px 8px
Border-radius: 12px
Font-size: 11px
Font-weight: 600
Whitespace: nowrap
```

---

## Component-Specific Design Directions

### 1. ObjectiveCard
**Goal:** Make objectives feel exciting, but scannable

**Visual Hierarchy:**
- Objective name: **16px bold**, top left
- Points value: **20px bold**, top right (in gold/highlight box)
- Rarity badge: **12px** with color coding
  - Common: Gray circle with checkmark
  - Rare: Gold star/circle
- Recommended positions: Small pills below name
- Draft hint (if visible): Italicized gray text, 12px
- Progress state: Green left border if completed

**Styling:**
```css
Common Objective:
  Background: #fff
  Border: 1px solid #ddd
  Border-left: 4px solid #ddd
  
Rare Objective (Draft):
  Background: #fffef0
  Border: 2px solid #FFD700
  Border-left: 4px solid #FFD700
  
Completed Objective:
  Background: #f1f8f4
  Border: 1px solid #4CAF50
  Border-left: 4px solid #4CAF50
```

**Mobile Optimization:**
- No card taller than 140px on mobile (avoid multiple lines of text)
- Font size never below 12px for body text
- Touch targets (clickable area) minimum 44px height

---

### 2. DraftPlayerCard
**Goal:** Make player selection obvious and fast

**Visual Hierarchy:**
- Player name: **16px bold**, left side
- Position: **12px bold**, colored badge (next to name)
- Team: **13px**, gray, below name
- Status indicator: Right side
  - Available: Green checkmark
  - Selected: Blue highlight box
  - Drafted: Gray with strikethrough

**Styling:**
```css
Available Player:
  Background: #fff
  Border: 2px solid #ddd
  Opacity: 1.0
  
Recommended Player:
  Background: #f0f4ff
  Border: 2px solid #4CAF50
  
Selected Player (current user):
  Background: #e3f2fd
  Border: 2px solid #1976d2
  Box-shadow: inset 0 0 0 2px #1976d2
  
Drafted (unavailable):
  Background: #f5f5f5
  Border: 2px solid #ccc
  Opacity: 0.6
  Text-decoration: line-through (name only)
```

**Position Badges:**
```
GK (Goalkeeper): #4CAF50 (green)
DEF (Defender): #2196F3 (blue)
MID (Midfielder): #FF9800 (orange)
FWD (Forward): #F44336 (red)
```

---

### 3. FiascoBonusPanel
**Goal:** Make Fiasco moments feel like jackpot moments

**Visual Hierarchy:**
- Header: 🔥 + "FIASCO BONUSES" (**16px bold**, orange)
- Each bonus item: Name + Points
- Triggered state: Highlighted, slightly larger

**Styling:**
```css
Container:
  Background: #fff8e1
  Border: 2px solid #FFC107
  Border-radius: 8px
  
Non-triggered Bonus:
  Background: #fffde7
  Border: 1px solid #fff59d
  Opacity: 0.65
  
Triggered Bonus (Active):
  Background: #fff59d
  Border: 1px solid #FBC02D
  Box-shadow: 0 2px 8px rgba(255, 193, 7, 0.3)
  Opacity: 1.0
  
Triggered Badge:
  Background: #FFC107
  Color: #333
  Padding: 4px 8px
  Border-radius: 4px
  Font-size: 10px
  Font-weight: 700
```

**Animation (Light):**
- Triggered bonus: Subtle pulse (1 second) when activated
- No heavy animations; performance priority

---

### 4. PlayerSpotlight
**Goal:** Make this component create table talk and engagement

**Visual Hierarchy:**
- Header: 🌟 + "HOT PLAYER" (**16px bold**)
- Player name: **20px bold**, orange
- Owner/drafter: **13px** gray, "Drafted by [Name]"
- Current score: **24px bold**, right side, gold background
- Recent events: List of last 3 events, scrollable
- Triggered objectives: Small green badges

**Styling:**
```css
Container:
  Background: #fff3e0
  Border: 2px solid #FF6F00
  Border-radius: 8px
  
Player Name:
  Color: #E65100
  Font-size: 20px
  Font-weight: bold
  
Score Display:
  Background: #FFD699
  Color: #E65100
  Font-size: 24px
  Font-weight: bold
  Padding: 12px 16px
  Border-radius: 8px
  
Event Item:
  Font-size: 13px
  Padding: 8px
  Border-left: 3px solid #FF6F00
  
Objective Badge:
  Background: #c8e6c9
  Color: #2e7d32
  Padding: 4px 8px
  Border-radius: 4px
  Font-size: 11px
```

**Why It Works:**
- Bright orange stands out on leaderboard
- Score is huge and impossible to miss
- Recent events are scannable
- Triggers conversation ("Who is [Player]?" → "He's on my team!")

---

### 5. LeaderboardCard
**Goal:** Make rank and score crystal clear

**Visual Hierarchy:**
- Rank circle: Left side, gold for top 3, gray for others
- Player name: **14px bold**, main content
- Score: **16px bold**, right side
- Score delta: **12px**, green if positive, gray if neutral

**Styling:**
```css
Row:
  Background: #fff
  Border-left: 4px solid (varies by rank)
  Padding: 12px 16px
  Margin-bottom: 8px
  
Rank 1:
  Rank circle: #FFD700 (gold) with 🥇
  Border-left: 4px solid #FFD700
  
Rank 2:
  Rank circle: #C0C0C0 (silver) with 🥈
  Border-left: 4px solid #C0C0C0
  
Rank 3:
  Rank circle: #CD7F32 (bronze) with 🥉
  Border-left: 4px solid #CD7F32
  
Rank 4+:
  Rank circle: #e0e0e0 (gray)
  Border-left: 4px solid #e0e0e0
  
Highlighted (my team):
  Background: #e8f5e9
  Border-left: 4px solid #4CAF50
  
Score Delta:
  Positive: #4CAF50 (green) + "↑"
  Neutral: #999 (gray) + "–"
```

---

### 6. EventFeedItem
**Goal:** Make what happened instantly scannable

**Visual Hierarchy:**
- Event icon: Left (20px), soccer ball / card / flame
- Event description: **14px**, "Player Name scored Goal"
- Points awarded: **14px bold**, right side, color coded
- Triggered bonus: Inline badge or below
- Time: **11px gray**, top right

**Styling:**
```css
Item:
  Background: #fff
  Border: 1px solid #e0e0e0
  Border-left: 3px solid (varies by event type)
  Padding: 12px
  Margin-bottom: 8px
  
Event Icon:
  Size: 20px
  Left padding: 8px
  
Goal/Assist:
  Border-left: 3px solid #4CAF50
  
Card (Yellow/Red):
  Border-left: 3px solid #FFC107 or #D32F2F
  
Fiasco Event:
  Border-left: 3px solid #FFC107
  Background: #fffde7
  
Points Badge:
  Positive: #c8e6c9 background, #2e7d32 text
  Zero: #e0e0e0 background, #999 text
  
Time:
  Font-size: 11px
  Color: #999
  Opacity: 0.7
```

---

## Screen-Specific Layouts

### LobbyScreen / RoomPage
- **Background:** Light gray `#f5f5f5`
- **Header:** Blue `#1976d2` with white text
- **Card content:** White with subtle shadows
- **Join action:** Large primary button, 48px height

### ObjectiveRevealScreen
- **Background:** White or very light gray
- **Objectives:** Arranged in grid or list, cards should not overflow on mobile
- **Rarity distinction:** Visual (color/icon), not just text
- **Draft hint:** Subtle, under or beside objective

### DraftScreen
- **Background:** Light gray `#f5f5f5`
- **Sticky header:** Shows pick progress (X/Y picks)
- **Objectives sidebar:** Visible but not prominent
- **Player cards:** Large, touch-friendly, no more than 2 columns on mobile
- **Search bar:** Always visible, fast to type in

### LiveMatchScreen
- **Header:** Blue with match time, sticky
- **Fiasco panel:** Always visible top (before leaderboard)
- **Player spotlight:** Prominent, orange/gold accent
- **Leaderboard:** Scrollable list
- **Event feed:** Scrollable list, newest first
- **Event entry buttons:** Row of large buttons, bottom (with sticky positioning)

### MatchCompleteScreen
- **Winner hero:** Large trophy or celebration visual, center, top
- **Winner name:** **24px bold**, center, with medal emoji
- **Final score:** **20px**, center
- **Leaderboard:** Ranked list with medals
- **Top moments:** Cards showing high-value events
- **Share button:** Optional, secondary position

---

## Mobile-Specific Adaptations

### 320px Width Constraints
- **No horizontal scrolling** of core content
- **Font sizes:** 14px minimum for body, 16px for headers
- **Padding:** 12px minimum gutters
- **Cards:** Single column, full width minus 16px margins
- **Buttons:** Minimum 44px height, full width or side-by-side if 2 buttons

### Touch & Interaction
- **Button tap targets:** 48x48px minimum
- **Spacing between buttons:** 8px minimum
- **Long lists:** Scrollable, not paginated
- **Text input:** Large, 16px minimum font (prevents mobile zoom)

### Performance
- **Initial load:** < 3 seconds on 4G
- **Screen transitions:** < 100ms
- **Button press response:** Immediate visual feedback

---

## Accessibility Requirements

### Contrast
- **Text:** Minimum 4.5:1 contrast ratio (WCAG AA)
- **Icons:** If icons replace text, contrast requirement applies
- **Backgrounds:** Avoid very light grays behind important text

### Keyboard Navigation
- **All buttons:** Tab-focusable
- **Focus indicator:** Visible (outline or highlight)
- **Enter key:** Activates focused button
- **Escape key:** Closes modals/dialogs if present

### Screen Readers
- **Buttons:** Descriptive text (not just icon)
- **Score changes:** Announced via ARIA live regions if interactive updates
- **State changes:** Announced ("Drafted" when unavailable)

### Reduced Motion
- **Animations:** Disabled if user has `prefers-reduced-motion` set
- **Transitions:** Kept under 200ms if present
- **No autoplay:** Of animations or videos

---

## Visual Debt & Known Limitations

1. **No custom font:** Using system fonts (faster, better mobile performance)
2. **Minimal shadows:** Using only 2-4px shadows, subtle
3. **No gradients:** Solid colors only (better performance, easier maintenance)
4. **No heavy animations:** Transitions only on hover/state changes
5. **No video or auto-play:** Keeps load time and bundle size low

---

## Design System Implementation Checklist

- [ ] All components using color palette
- [ ] All text respecting font sizing guidelines
- [ ] All touch targets 44px minimum
- [ ] No text below 12px in normal use
- [ ] Card spacing consistent (16px padding, 12px margins)
- [ ] Color contrast tested (4.5:1 minimum)
- [ ] Mobile screens tested at 320px width
- [ ] Reduced motion respected in all animations
- [ ] Focus indicators visible on all buttons
- [ ] No layout shifts during loading

