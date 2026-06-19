# Phase 4.8 - Microcopy & Clarity Guide

## Overview
This document standardizes user-facing text to make Fiasco Futball easier for casual players. 

**Core Principle:** Explain the game through the UI, not through a manual.

---

## General Writing Rules

### Use Simple Language
| Instead of... | Use... |
|---|---|
| Recommended Positions | Best players to draft |
| Objective Progress | Your scoring chances |
| Event Submitted | Goal recorded / Save recorded |
| Triggered | Unlocked |
| Active Objectives | Players you're watching |
| Fiasco Bonuses | Chaos Moments |
| Match Minute | Game Time |

### Be Specific, Not Vague
| Vague | Better |
|---|---|
| "Point adjustment" | "+5 from Goal by Salah" |
| "Status updated" | "Salah just scored!" |
| "Error" | "Player already drafted" |
| "Pending" | "Waiting for commissioner" |

### Use Emojis for Instant Recognition
- ⚽ Goal
- 🎯 Assist
- 🟨 Yellow Card
- 🟥 Red Card
- 🔥 Fiasco Bonus / Chaos
- 🥇 🥈 🥉 Top 3 players
- ✓ Completed / Triggered
- ⭐ Rare / Special

---

## Screen-by-Screen Microcopy

### LobbyScreen / RoomPage

**Heading:**
```
Current: "Join Game"
Better:  "Join the Party"
```

**Join Button:**
```
Current: "Enter Room Code"
Better:  "Join a Game"
```

**Room Code Placeholder:**
```
Current: "Room ID"
Better:  "Ask your friend for the code"
```

**Error Messages:**
```
Current: "Invalid room"
Better:  "This game code isn't active. Check with your friends."
```

**Host Actions:**
```
Current: "Start Match"
Better:  "Start Drafting" (before draft)
         "Start Live Match" (after draft)
         "End Match" (during match)
```

**Empty State:**
```
Current: "No active games"
Better:  "No games yet. Create one to start playing!"
         [+ Create Game Button]
```

---

### ObjectiveRevealScreen

**Heading:**
```
Current: "Objective Reveal"
Better:  "Pick Your Scoring Chances"
```

**Instruction:**
```
Current: "Study objectives, then draft players"
Better:  "⭐ These are your scoring chances. 
          Pick players who can make them happen."
```

**Objective Card - Title:**
```
Current: "Objective: [Name]"
Better:  Just [Name]
```

**Objective Card - Description:**
```
Current: "Recommended Positions: [List]"
Better:  "Best players: [Position List]
          💡 Draft these positions to unlock this!"
```

**Rarity Badge:**
```
Current: "COMMON"
Better:  "Common" (or just ✓)

Current: "RARE"  
Better:  "⭐ Rare — Worth more!"
```

**Point Value:**
```
Current: "+20 points"
Better:  "+20 pts" (saves space on mobile)
```

**Ready Button:**
```
Current: "Objectives Understood"
Better:  "Got It, Let's Draft"
```

---

### DraftScreen

**Heading:**
```
Current: "Player Draft"
Better:  "Pick Your Team"
```

**Pick Counter:**
```
Current: "Pick 1 of 3"
Better:  "Your 1st pick of 3"
```

**Objectives Sidebar:**
```
Current: "Active Scoring Chances"
Better:  "(optional label hidden on mobile)
          Just show the objectives visually"
```

**Player Card - Drafted State:**
```
Current: "Drafted by [Player]"
Better:  "Already picked by [Friend Name]"
```

**Player Card - Recommended:**
```
Current: "Recommended"
Better:  "✨ Perfect for your goals!"
```

**Search Placeholder:**
```
Current: "Search players..."
Better:  "Type name or team"
```

**Position Filter:**
```
Current: "Filter by Position"
Better:  (Just show buttons: GK | DEF | MID | FWD)
          No label needed
```

**Empty Search Results:**
```
Current: "No players found"
Better:  "No players match. Try another search."
```

**Draft Complete Button:**
```
Current: "Confirm Picks"
Better:  "I'm Ready to Play"
```

**Undo Button:**
```
Current: "Undo"
Better:  "Take that back"
```

---

### LiveMatchScreen

**Header:**
```
Current: "Live Match"
Better:  [Team A] vs [Team B] · 42:30
```

**Fiasco Bonus Panel:**
```
Current: "FIASCO BONUSES"
Better:  "🔥 CHAOS MOMENTS
          Rare scoring events worth big points!"
          (tooltip or collapsible if space limited)
```

**Fiasco Bonus Item - Not Triggered:**
```
Current: "Red Card - 15 pts"
Better:  Same (but lighter, 60% opacity)
```

**Fiasco Bonus Item - Triggered:**
```
Current: "Red Card - 15 pts ✓ HIT"
Better:  "⚡ Red Card - 15 pts — UNLOCKED!"
```

**Player Spotlight:**
```
Current: "🔥 HOT PLAYER"
Better:  "⭐ HOT PLAYER
          
          [Player Name]
          [Team] · [Position]
          👤 [Drafted by Name]"
```

**Spotlight Score:**
```
Current: "24 points"
Better:  "24 PTS" (smaller, matches leaderboard)
```

**Recent Events:**
```
Current: "Recent Events"
Better:  "Just Happened" (if <30 seconds old)
         "This Half" (if <45 minutes)
```

**Leaderboard:**
```
Current: "Leaderboard"
Better:  (No label if obvious or scrollable section)
```

**Event Entry Buttons:**
```
Current: "Goal" "Assist" "Yellow Card" "Red Card" "Save" "Own Goal" "Missed Penalty"
Better:  [Keep this but make sure buttons are 48px+ height]
```

**Event Entry Instructions:**
```
Current: "Record an event"
Better:  "(Just show the button row at bottom)"
```

**"No events yet" state:**
```
Current: "Waiting for events..."
Better:  "Nothing recorded yet. 
          Tap a button below to get started!"
```

---

### Event Entry Workflow

#### Step 1: Event Type
```
Current: "Select Event Type"
Better:  "What happened?"
          
          ⚽ Goal    🎯 Assist   🟨 Yellow   🟥 Red
          🧤 Save    💣 Own Goal   ❌ Missed Penalty
```

#### Step 2: Player Selection
```
Current: "Select Player"
Better:  "Who made the [Event]?"
          
          Search box: "Type player name"
          (Show recently used players first)
```

#### Step 3: Confirm

**If common event (Goal, Assist, etc):**
```
Goal recorded!
[Player Name] +[Points]

[Undo] [Add Another]
```

**If Fiasco/special event:**
```
🔥 CHAOS MOMENT RECORDED!

[Player Name] triggered [Fiasco Name]!
+[Points] + [Additional Points]

This is huge! 🎉
[Undo] [Add Another]
```

---

### MatchCompleteScreen

**Heading:**
```
Current: "Match Complete"
Better:  "Game Over! 🏆"
```

**Winner Section:**
```
Current: "Winner: [Player]"
Better:  "🥇 [Player Name] Wins!
          Final Score: [XX] pts"
```

**Final Standings:**
```
Current: "Final Leaderboard"
Better:  "Final Standings"
         (Same layout but labeled)
```

**Top Plays:**
```
Current: "Top Plays"
Better:  "Biggest Moments"
         (Shows: event + points in chronological order)
```

**Objectives Summary:**
```
Current: "Completed Objectives"
Better:  "Unlocked Scoring Chances"
         (Shows which objectives were hit and by whom)
```

**Share Button:**
```
Current: "Share Result"
Better:  "Share Score" or "Share on..."
         (Only if easily screenshot-able)
```

**Play Again:**
```
Current: "New Match"
Better:  "Play Another?"
```

---

## Empty State & Error Messages

### Helpful Empty States

**No Objectives Loaded:**
```
❓ No objectives yet.
Commissioner is setting up the match.
```

**No Players Available:**
```
⏳ Players loading...
Tap to refresh if it takes too long.
```

**Draft Unavailable:**
```
📋 Draft hasn't started yet.
Host will let you know when to pick.
```

**Match Not Started:**
```
⏱️ Waiting for live match to start.
Click "Start Match" when ready.
```

### Helpful Error Messages

**Network Error:**
```
❌ Lost connection.
Tap to retry.
Offline changes will sync when you're back online.
```

**Room Closed:**
```
🚪 This game ended.
Ask your friends to start a new one!
```

**Insufficient Players:**
```
👥 Not enough players yet.
Waiting for [X] more people to join.
```

**Invalid Draft Pick:**
```
❌ That player was already picked.
Choose someone else.
```

**Event Entry Rejected:**
```
❌ Player not on the field for that event.
Double-check the player name.
```

---

## Confirmation Messages

**After Event Entry:**
```
✓ Recorded!
[Player] [Event] · +[Points]

(Auto-dismiss after 2 seconds OR tap to continue)
```

**After Draft Complete:**
```
✓ Your picks are locked in!
[Player 1] · [Player 2] · [Player 3]

Let the match begin!
```

**After Match Ends:**
```
🏆 Final Score Recorded
Your team score: [XX] pts
Waiting for all teams before showing results...
```

---

## Accessibility Considerations

### Screen Reader Labels
- Button: "Record Goal for [Player Name]"
- Not: "Goal Button"

- Badge: "This player is available"
- Not: "Green Badge"

- Section: "Fiasco Bonuses, 2 active, 1 triggered"
- Not: "🔥 FIASCO BONUSES"

### Color-Coded Information
Never use color alone to convey information:
- ✓ Green checkmark + "Completed"
- ❌ Just green
- ✓ Red badge + "Red Card"
- ❌ Just red

---

## Consistency Rules

### Terminology
Use these terms consistently throughout:
- ✓ "Goal" (not "Scored")
- ✓ "Pick" (not "Draft" when referring to single player)
- ✓ "Chaos Moment" or "Fiasco Bonus" (not "Special Event")
- ✓ "Unlocked" (not "Triggered")
- ✓ "Waiting" (not "Pending")

### Capitalization
- ✓ Objective names: Capitalized (Title Case)
- ✓ Status: Sentence case ("Match started", not "MATCH STARTED")
- ✓ Buttons: Title Case ("Add Another", not "Add another")

### Punctuation
- ✓ Button text: No period ("Done" not "Done.")
- ✓ Instructional text: Use period ("Select a player.")
- ✓ Errors: Question mark for "Did you mean to...?"

---

## Testing Checklist

- [ ] Read all text aloud — does it sound natural?
- [ ] Ask casual player: "What does [text] mean?"
- [ ] Check contrast: 4.5:1 minimum for all text
- [ ] Check font size: 14px minimum on mobile
- [ ] Check emojis: Do they make sense in context?
- [ ] Check consistency: Same term used everywhere
- [ ] Check brevity: No text longer than 2 lines on mobile
- [ ] Check clarity: No jargon without explanation
- [ ] Check errors: Do error messages help fix the problem?
- [ ] Check tone: Professional but friendly?

