# PHASE_4_9_PLAYTEST_LAUNCH_CHECKLIST.md

## Ready for Live Playtest

Use this checklist to launch the first live playtest on GitHub Pages.

---

## Pre-Playtest Setup (48 Hours Before)

### Deployment Verification
- [ ] GitHub Actions workflow deployed successfully
- [ ] Live URL is accessible and loads
- [ ] No "Firebase configuration incomplete" error
- [ ] Create room works from live URL
- [ ] Join room works from another device/network
- [ ] Initial objectives display correctly

### Firebase Configuration
- [ ] All 7 Firebase secrets added to GitHub Actions
- [ ] GitHub Pages domain added to Firestore Authorized domains
- [ ] Firestore rules allow public room creation
- [ ] Anonymous authentication enabled
- [ ] Test room creation returns valid room ID

### Test Devices
- [ ] 2+ phones/tablets available for playtest
- [ ] All on same WiFi or different networks (test both)
- [ ] Chrome or Safari browsers ready
- [ ] Recording device ready (for capturing feedback)

### Game Setup
- [ ] Objectives imported/created in Firestore
- [ ] At least 1 test player pool created
- [ ] Expected match duration: 30-45 minutes
- [ ] Real soccer match selected for testing

### Observer Preparation
- [ ] Playtest observer assigned
- [ ] Feedback form printed or on device
- [ ] Stopwatch app ready (timing measurements)
- [ ] Notes app for observations

---

## 30 Minutes Before Match

### Final Infrastructure Check
- [ ] Live URL loads (refresh browser)
- [ ] No console errors (F12 > Console)
- [ ] Firebase is responsive (check Firestore)
- [ ] Mobile bandwidth sufficient (speedtest)
- [ ] All devices have battery > 50%

### Create Test Room
- [ ] 1 player opens live URL
- [ ] Click "Create Room"
- [ ] Room created successfully
- [ ] Room code/link generated
- [ ] Share link with other players

### Players Join
- [ ] Player 2 opens live URL
- [ ] Paste room code or click link
- [ ] Join room successfully
- [ ] Can see same screen as Player 1
- [ ] Repeat for all players

### Start Test
- [ ] All players in room (confirm count)
- [ ] All players can see objectives
- [ ] Proceed to draft when ready

---

## During Match - Objective Reveal Phase (Target: <15 seconds understanding)

### Timing Measurement
- [ ] Start timer when objectives appear
- [ ] Stop timer when first player clicks "Ready" or "Draft"
- [ ] Record time: _____ seconds

### User Observations
- [ ] Players read objectives silently
- [ ] Any confused moments? (note them)
- [ ] Any questions about what objectives mean?
- [ ] Do rare objectives stand out visually?
- [ ] Can all players see all objectives clearly?

### Checklist
- [ ] All objectives displayed
- [ ] Points visible for each
- [ ] Position colors visible (GK/DEF/MID/FWD)
- [ ] Rarity badges visible (Rare vs Common)
- [ ] Draft hints readable and helpful
- [ ] No horizontal scrolling at any viewport width

### Notes
_Observations:_


---

## During Match - Draft Phase (Target: <60 seconds full draft)

### Timing Measurement
- [ ] Start timer when draft begins
- [ ] Stop when last player locks in their picks
- [ ] Total draft time: _____ seconds
- [ ] Average per player: _____ seconds

### User Observations
- [ ] Draft flows smoothly
- [ ] Recommended players clearly marked (✨)
- [ ] Players understand position color coding
- [ ] No confusion about draft order
- [ ] Any slow moments (identify cause)
- [ ] Did anyone need help?

### Checklist
- [ ] All players can see same player pool
- [ ] Recommended indicator visible and understood
- [ ] Player cards show position + team + number
- [ ] Selected players show clear feedback (blue border)
- [ ] Drafted players show grayed out state
- [ ] Touch targets large enough (48px+)
- [ ] No missing player portraits

### Performance
- [ ] Draft updates real-time across devices
- [ ] No lag when selecting players
- [ ] No players duplicated across teams
- [ ] Everyone completes in reasonable time

### Notes
_Observations:_


---

## During Match - Live Match Phase (Target: <5 seconds per event entry)

### Event Entry Speed (Measure First 5 Events)

**Event 1:**
- [ ] Start timer when host opens event entry
- [ ] Stop when event submitted
- [ ] Time: _____ seconds
- [ ] Event: ________________

**Event 2:**
- [ ] Time: _____ seconds
- [ ] Event: ________________

**Event 3:**
- [ ] Time: _____ seconds
- [ ] Event: ________________

**Event 4:**
- [ ] Time: _____ seconds
- [ ] Event: ________________

**Event 5:**
- [ ] Time: _____ seconds
- [ ] Event: ________________

### Leaderboard Updates
- [ ] Leaderboard shows within 1 second of event
- [ ] Score changes are visible
- [ ] Player names displayed correctly
- [ ] Rank order updates correctly
- [ ] Position changes noticeable

### Player Spotlight
- [ ] Spotlight highlights a player
- [ ] Score badge visible (gold color)
- [ ] Most recent events listed
- [ ] Objectives showing if completed
- [ ] Fiasco Bonuses showing if triggered
- [ ] Sparks conversation at table

### Fiasco Bonuses
- [ ] Panel visible on screen
- [ ] Non-triggered bonuses show grayed out
- [ ] Triggered bonuses light up/change color
- [ ] ✓ HIT badge appears when triggered
- [ ] Creates excitement/engagement

### Event Feed
- [ ] Shows recent events in order
- [ ] Event icons visible (⚽🎯🟥 etc)
- [ ] Player names color-coded by event type
- [ ] Points displayed for each event
- [ ] Scrolls smoothly on mobile

### Checklist
- [ ] All events entered successfully
- [ ] All scores calculated correctly
- [ ] No duplicate events recorded
- [ ] No missing events
- [ ] Real-time sync working
- [ ] No console errors during match
- [ ] Mobile viewport still readable

### Notes
_Observations:_


---

## During Match - Player Engagement

### Conversation & Engagement
- [ ] Players talking about Player Spotlight
- [ ] Comments on Fiasco Bonuses
- [ ] Laughter when unexpected events happen
- [ ] Engagement level: (1-5): _____
  - 1 = Bored, not paying attention
  - 5 = Highly engaged, lots of table talk

### Leaderboard Watching
- [ ] Players watching score changes
- [ ] Celebrating their points
- [ ] Reacting to others' scores
- [ ] Interest in final standings

### Notable Moments
_Capture any memorable moments, good or bad:_


---

## End of Match - Match Complete Screen

### Final Results Display
- [ ] Winner displays prominently (medal 🥇)
- [ ] Final leaderboard shows all rankings
- [ ] Top 3 have medals (🥇🥈🥉)
- [ ] Score deltas visible (how much changed)
- [ ] Objectives completed shown
- [ ] Quick summary of highlights

### Checklist
- [ ] Winner is correct
- [ ] Scores are correct
- [ ] Ranking order is correct
- [ ] All players' names display
- [ ] No layout issues
- [ ] Mobile viewport still readable

### Notes
_Observations:_


---

## Post-Match Feedback

### Quick Survey (3 Minutes)

**1. Did objectives make sense?**
- [ ] Yes, understood immediately
- [ ] Yes, after reading description
- [ ] Somewhat confusing
- [ ] Very confusing

**2. Was the draft too slow?**
- [ ] Too slow (>1 min per player)
- [ ] Appropriate (30-60 sec total)
- [ ] Too fast (<30 sec total)

**3. Was event entry too slow?**
- [ ] Too slow (>10 sec per event)
- [ ] Appropriate (3-5 sec per event)
- [ ] Too fast (<3 sec per event)

**4. Did you notice Fiasco Bonuses?**
- [ ] Yes, exciting when triggered
- [ ] Yes, but not exciting
- [ ] Barely noticed
- [ ] Didn't notice

**5. Did Player Spotlight create conversation?**
- [ ] Yes, lots of comments
- [ ] Yes, some comments
- [ ] Barely talked about it
- [ ] Didn't notice

**6. How fun was the game? (1-10)**
- _____ / 10
- Comments: _________________

**7. Would you play again?**
- [ ] Definitely yes
- [ ] Yes
- [ ] Maybe
- [ ] No

### Detailed Feedback

**What worked really well?**
- 

**What was confusing?**
- 

**What would make it better?**
- 

**Any technical issues?**
- 

**Mobile experience (if on phone):**
- 

---

## Post-Playtest Data Collection

### Performance Metrics

| Metric | Target | Actual | Notes |
|--------|--------|--------|-------|
| Objectives reveal time | <15s | ____ | |
| Total draft time | <60s | ____ | |
| Avg per player draft | <10s | ____ | |
| Avg event entry time | <5s | ____ | |
| Leaderboard update | <1s | ____ | |
| Overall engagement | 4/5+ | ____ | |

### Success Criteria Checklist

- [ ] All 6 friends could join the game
- [ ] Everyone understood objectives in <15 seconds
- [ ] Draft completed in <60 seconds
- [ ] Events entered in <5 seconds each
- [ ] No gameplay-breaking errors
- [ ] Fiasco Bonuses felt exciting
- [ ] Player Spotlight created conversation
- [ ] Mobile viewport worked at 320px
- [ ] 5+ players would play again
- [ ] No major technical issues

### Critical Issues Found

_List any blocking bugs or major UX problems:_

1. 
2. 
3. 

### Quick Wins (Easy Fixes)

_List improvements that could be fixed in <1 hour:_

1. 
2. 
3. 

---

## After Playtest (Within 24 Hours)

### Prioritize Feedback

**Blocking Issues** (must fix before next playtest)
- 

**High Priority** (would significantly improve UX)
- 

**Medium Priority** (nice to have)
- 

**Low Priority** (polish)
- 

### Schedule Next Steps

- [ ] Review feedback with team
- [ ] Prioritize fixes
- [ ] Schedule fixes for next sprint
- [ ] Plan next playtest date

### Document Results

- [ ] Save notes to project
- [ ] Update memory with lessons learned
- [ ] Share feedback with team
- [ ] Create GitHub issues for fixes

---

## Observer Notes Template

**Date:** ____________
**Duration:** ____________ minutes
**Players:** ____________
**Result:** Winner ____________

**Overall Impression:**


**Key Moments:**


**Timing Summary:**
- Objectives reveal: _____ seconds
- Full draft: _____ seconds
- Average per event: _____ seconds
- Total match: _____ minutes

**Engagement Level (1-5):** _____

**Would Recommend for Next Phase?** Yes / No

**Top 3 Feedback Items:**
1. 
2. 
3. 

---

## Success Definition

✅ **Phase 4.9 Playtest Success = ANY 5 OF THESE**

- [ ] All 6 players successfully joined and played
- [ ] Objectives understood in <15 seconds  
- [ ] Draft completed in <60 seconds
- [ ] Events entered smoothly (<5 seconds each)
- [ ] Fiasco Bonuses created excitement/laughter
- [ ] Player Spotlight created table conversation
- [ ] Mobile viewport remained readable
- [ ] 5+ players said "I'd play again"
- [ ] No critical technical failures
- [ ] Final scores made sense to everyone

**Playtest Success Criteria Met: _____ / 5 minimum** ✅
