# Phase 4.8 - Casual Player Playtest Script

## Purpose
Test Fiasco Futball with 4-6 friends to validate that the game is:
- Easy to understand for casual players
- Fast on mobile during live match
- Engaging enough to create conversation
- Ready for real-world play

## Pre-Test Setup
- **Testers:** 4-6 friends, age 18-45, casual sports viewers
- **Environment:** Living room or similar casual setting (watch-party scenario)
- **Hardware:** 1-2 phones for testing (shared or individual)
- **Duration:** 15-20 minutes total (includes brief intro)
- **Live Match:** Run during first 30 minutes of a real soccer match (optional but recommended)

---

## Test Phases

### Phase 1: Pre-Game (5 minutes)
**Goal:** Assess if players can enter a room and understand the concept

#### Tasks:
1. **Room Entry** (1-2 min)
   - Have testers join a room
   - Observe: Can they find the join button? Do they get lost?
   - Question: "Did you know what to do when you opened the app?"

2. **Quick Concept Explanation** (2 min)
   - Show them the objectives reveal screen
   - Ask: "Do you understand what these are?" (objectives)
   - Watch if they grasp the position recommendations quickly

#### Observer Notes:
- Did testers need help joining?
- Did they read the objective descriptions?
- How quickly did they understand positions?

---

### Phase 2: Objective Reveal & Understanding (3 minutes)
**Goal:** Test if objectives are immediately scannable

#### Tasks:
1. **Objective Reveal Screen Display** (2 min)
   - Show objective reveal screen
   - Ask testers: "Without me explaining, what do you think this game is about?"
   - Observation: Do they notice rarity levels? Do they understand draft strategy?

2. **Microcopy Check** (1 min)
   - Ask: "Can you explain in your own words what 'Recommended positions' means?"
   - Expected answer: Should match "best players to draft"

#### Success Criteria:
- Objective understanding: under 15 seconds per objective
- Players can articulate the main concept without help
- Position recommendations are visible and clear

#### Observer Notes:
- Which objectives confused players?
- Did anyone ask what "rarity" means?
- Did position colors help or hurt?

---

### Phase 3: Draft Experience (5 minutes)
**Goal:** Test if draft is fast and intuitive on mobile

#### Tasks:
1. **Player Search & Filtering** (2-3 min)
   - Ask testers to draft 1-2 players based on objectives
   - Observe: Do they use search? Do they scroll too much?
   - Question: "Are you finding the players you want?"

2. **Decision Speed** (1-2 min)
   - Time how long it takes to complete a full draft (3 picks)
   - Target: under 60 seconds for experienced user
   - Observation: Are there any confusing states?

#### Success Criteria:
- Full draft: under 60 seconds
- No excessive scrolling or searching needed
- Recommended players are clearly marked

#### Observer Notes:
- Did players understand "recommended"?
- Did they use search?
- Were they able to draft at all with current state?
- What was the most confusing part?

---

### Phase 4: Live Match Event Entry (4 minutes)
**Goal:** Test if commissioners can enter events quickly

#### Tasks:
1. **Event Entry Workflow** (2-3 min)
   - Have a "commissioner" enter 2-3 common events (Goal, Assist, Card)
   - Time each event entry: target under 5 seconds
   - Observation: Are buttons large enough? Is player search fast?

2. **Event Type Recognition** (1 min)
   - Ask: "Can you tell which button is 'Goal' without reading the label?"
   - Expected answer: Yes (due to icon)

#### Success Criteria:
- Common events entered in under 5 seconds
- Event buttons are large and tappable
- Player search is responsive

#### Observer Notes:
- Did commissioners tap the right buttons?
- Did they need help finding players?
- Were the event icons helpful?
- Did they accidentally click the wrong event type?

---

### Phase 5: Live Match Engagement (5 minutes)
**Goal:** Test if the match experience is engaging and clear

#### Tasks:
1. **Following Leaderboard Changes** (2 min)
   - After entering events, ask testers: "Who is winning right now?"
   - Can they read the leaderboard?
   - Do they notice score changes?

2. **Player Spotlight Engagement** (1-2 min)
   - Ask: "Who is the hot player right now and why?"
   - Expected answer: They should know the name and team
   - Observation: Do they create conversation about this player?

3. **Fiasco Bonus Awareness** (1-2 min)
   - If a Fiasco Bonus triggered, did players notice?
   - Question: "Did you see the 🔥 Fiasco section? What does it do?"
   - Expected: Players understand it's special/high-value

#### Success Criteria:
- Players know who's winning without asking for help
- Players create casual conversation ("Who drafted [Player]?")
- Fiasco Bonuses feel exciting, not confusing

#### Observer Notes:
- Did players notice leaderboard updates?
- Did Player Spotlight create conversation?
- Were players confused by Fiasco Bonuses?
- Did anyone not understand the scoring?

---

### Phase 6: Post-Game & Match Complete (2 minutes)
**Goal:** Test if the winner moment feels rewarding

#### Tasks:
1. **Match Complete Screen** (1 min)
   - Show the match complete/winner screen
   - Ask: "Does this feel rewarding?"
   - Observation: Is the winner clear? Are the stats understandable?

2. **Would They Play Again?** (1 min)
   - Question: "Would you play this again during a real match?"
   - Expected answer: Should be "yes" for successful test
   - Follow-up: "What would make it more fun?"

#### Success Criteria:
- Winner feels obvious and rewarding
- Players express interest in playing again
- No major confusion about final results

#### Observer Notes:
- Was the winner screen exciting?
- Did players understand final scoring?
- What did they suggest for improvement?

---

## Measurable Targets

### Performance Benchmarks
| Task | Target | Measured |
|------|--------|----------|
| Objective understanding | < 15 seconds | — |
| Full draft completion | < 60 seconds | — |
| Event entry (common) | < 5 seconds | — |
| Event entry (special) | < 7 seconds | — |
| Player finds who's winning | < 3 seconds | — |

### Engagement Metrics
| Metric | Success | Measured |
|--------|---------|----------|
| Players know who drafted what | Yes | — |
| Players notice Player Spotlight | Yes | — |
| Players create table talk | At least 1 comment | — |
| Players notice Fiasco Bonuses | Yes (if triggered) | — |
| Would play again | Yes | — |

---

## Critical Failure Modes

### Stop the test if...
1. Players cannot join a room after 2 minutes
2. Players cannot understand objectives after 3 minutes of explanation
3. Draft cannot be completed in 2 minutes
4. Event entry takes more than 10 seconds consistently
5. Players cannot identify the winner on the final screen

### These indicate critical UX failures that must be fixed before next playtest

---

## Observer Checklist

### Before Test:
- [ ] All devices connected to test room
- [ ] At least one live soccer match playing in background
- [ ] Test app running on phone(s)
- [ ] Timer ready for measuring phase durations
- [ ] Pen and paper for notes
- [ ] Backup phone in case of crashes

### During Test:
- [ ] Note any confusion or hesitation
- [ ] Time each major phase
- [ ] Record direct quotes from testers
- [ ] Observe body language (frustration, engagement)
- [ ] Note any unexpected behaviors or workarounds
- [ ] Ask follow-up questions when confused

### After Test:
- [ ] Summarize tester feedback
- [ ] List major issues found
- [ ] List positive feedback
- [ ] Recommend priority fixes
- [ ] Schedule follow-up test if major issues found

---

## Debriefing Questions

### Core Functionality
1. "Could you play this game without asking for help?"
2. "What was the most confusing part?"
3. "What was the best part?"
4. "What would make this more fun?"

### Specific Features
5. "Did you understand what the objectives were trying to do?"
6. "Was picking players easy?"
7. "Did you know when your team scored points?"
8. "Did you feel like you had a fair chance to win?"
9. "Would you want to play this during a real match?"

### Design & Readability
10. "Could you read everything on the screen easily?"
11. "Were the buttons easy to tap?"
12. "Did the colors help you understand what was happening?"

---

## Test Results Template

### Session Overview
- **Date:** [DATE]
- **Duration:** [MINUTES]
- **Testers:** [NAMES]
- **Match:** [IF APPLICABLE - TEAM vs TEAM]
- **Issues Found:** [COUNT]

### Phase Timing
- Objective Reveal: __ seconds
- Full Draft: __ seconds
- Event Entry Avg: __ seconds
- Score Explanation: __ seconds

### Critical Findings
1. [Most important issue]
2. [Second most important issue]
3. [Third most important issue]

### Positive Feedback
- [What worked well]
- [What was engaging]
- [What should stay]

### Recommendations
- [Priority fix #1]
- [Priority fix #2]
- [Nice-to-have improvement]

---

## Follow-Up Test Schedule

- **First Playtest:** This week (4-6 people)
- **Second Playtest (if needed):** After critical fixes (4-6 people)
- **Validation Playtest:** Before Phase 4.9 (8-10 people or live match party)

---

## Success Criteria for Phase 4.8

- [ ] All testers can join without help
- [ ] All testers understand objectives within 15 seconds
- [ ] Draft completes in under 60 seconds for new player
- [ ] Event entry is under 5 seconds for common events
- [ ] Players notice Fiasco Bonuses and feel excited
- [ ] Players create conversation about Player Spotlight
- [ ] At least 5/6 testers would play again
- [ ] No critical usability failures found
- [ ] Game is readable at 320px width
- [ ] Game feels fun, not stressful

**Phase 4.8 is successful if we pass 8/10 criteria**

