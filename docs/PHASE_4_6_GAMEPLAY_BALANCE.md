# Phase 4.6 - Gameplay Balance Report

**Date:** 2026-06-19  
**Purpose:** Validate that objectives encourage diverse drafting strategies and create balanced gameplay

---

## Executive Summary

**RECOMMENDATION: Minor adjustments required**

The current objective pool is **heavily attacker-biased** and does not sufficiently encourage goalkeeper-heavy strategies. The pool shows strong common-level depth but lacks goalkeeper-specific rare objectives.

**Critical Findings:**
- ✅ Diverse common objectives (7 total across all positions)
- ⚠️ **Rare objectives skew 5:2 toward attacking (IMBALANCED)**
- ✅ Position-specific recommendations are clear
- ⚠️ Goalkeeper strategy has only one rare objective (Clean Sheet King)

---

## Objective Pool Analysis

### Current Distribution

#### **Common Objectives** (2 per player)
| Objective | Position(s) | Points | Frequency | Bias |
|-----------|-------------|--------|-----------|------|
| FINISHER | FWD, MID | +3 per goal | Very frequent | ⭐⭐⭐ Attacker |
| CREATOR | MID, FWD | +2 per assist | Frequent | ⭐⭐ Attacker |
| MARKSMAN | FWD | +1 per shot | Very frequent | ⭐⭐⭐ Attacker |
| ENFORCER | DEF, MID | +1 per foul | Moderate | ⭐ Defender |
| CARD_MAGNET | DEF, MID | +2 per yellow | Moderate | ⭐ Defender |
| BRICK_WALL | GK | +1 per save | Very frequent | ⭐⭐⭐ Goalkeeper |
| WORKHORSE | DEF, MID, FWD | +1 per start | Universal | Neutral |

**Common Tier Analysis:**
- **Attacker-focused:** FINISHER, CREATOR, MARKSMAN (3/7)
- **Defender-focused:** ENFORCER, CARD_MAGNET (2/7)
- **Goalkeeper-focused:** BRICK_WALL (1/7)
- **Universal:** WORKHORSE (1/7)

#### **Rare Objectives** (1 per player)
| Objective | Position(s) | Points | Trigger | Difficulty |
|-----------|-------------|--------|---------|------------|
| BRACE_HUNTER | FWD | +10 | 2+ goals | Hard |
| MATCH_WINNER | FWD, MID | +10 | Winning goal | Hard |
| CLUTCH_PLAYER | FWD, MID | +8 | Goal after 80' | Hard |
| SUPER_SUB | FWD, MID | +8 | Substitute scores | Medium |
| ASSIST_MACHINE | MID, FWD | +8 | 2+ assists | Hard |
| CLEAN_SHEET_KING | GK | +8 | Clean sheet | Medium |

**Rare Tier Analysis:**
- **Attacker-focused:** BRACE_HUNTER, MATCH_WINNER, CLUTCH_PLAYER, SUPER_SUB, ASSIST_MACHINE (5/6) = **83%**
- **Goalkeeper-focused:** CLEAN_SHEET_KING (1/6) = **17%**
- **Defender-focused:** 0 rare objectives = **0%**

---

## Objective Combination Analysis

### Attacker-Heavy Strategy (Example)
**Draft: Forward + Midfielder**

| Player Type | Common Objs | Rare Obj | Max Possible | Strategy |
|------------|------------|---------|--------------|----------|
| Striker (FWD) | FINISHER (+3), MARKSMAN (+1) | BRACE_HUNTER (+10) | ~30-45 points | High-risk, high-reward |
| Playmaker (MID) | CREATOR (+2), FINISHER (+3) | ASSIST_MACHINE (+8) | ~25-35 points | Consistent output |

**Total Potential:** 55-80 points from 2 players  
**Conditions:** Multiple goals + assists needed  
**Risk Level:** HIGH (dependent on match scoring)

### Balanced Strategy (Example)
**Draft: Forward + Defender + Goalkeeper**

| Player Type | Common Objs | Rare Obj | Max Possible | Strategy |
|------------|------------|---------|--------------|----------|
| Forward (FWD) | FINISHER (+3), CREATOR (+2) | MATCH_WINNER (+10) | ~20-30 points | Goal-focused |
| Defender (DEF) | CARD_MAGNET (+2), ENFORCER (+1) | None | ~5-15 points | Physical play |
| Goalkeeper (GK) | BRICK_WALL (+1) | CLEAN_SHEET_KING (+8) | ~15-25 points | Team defense |

**Total Potential:** 40-70 points from 3 players  
**Conditions:** Team coordination required  
**Risk Level:** MEDIUM (distributed across positions)

### Goalkeeper-Heavy Strategy (Example)
**Draft: Goalkeeper + Defender + Midfielder**

| Player Type | Common Objs | Rare Obj | Max Possible | Strategy |
|------------|------------|---------|--------------|----------|
| Elite GK | BRICK_WALL (+1) | CLEAN_SHEET_KING (+8) | ~15-25 points | Defensive strength |
| Defender (DEF) | CARD_MAGNET (+2) | None | ~5-15 points | Aggressive defense |
| Midfielder (MID) | CREATOR (+2) | ASSIST_MACHINE (+8) | ~15-25 points | Playmaking |

**Total Potential:** 35-65 points from 3 players  
**Conditions:** Defensive team setup  
**Risk Level:** MEDIUM (fewer goal opportunities)

---

## Key Findings

### ✅ Strengths
1. **Common objectives are well-distributed** - All positions have viable common-tier strategies
2. **Clear position mapping** - Each objective has explicit `recommendedPositions`
3. **Point scaling is sensible** - More frequent events get lower points; rare events get higher
4. **Draft hints are helpful** - Strategic guidance is clear and position-specific
5. **WORKHORSE is a wildcard** - Applies to any position; rewards consistent starters

### ⚠️ Balance Issues

#### Issue #1: Rare Objectives Heavily Favor Attack (5:1:0 ratio)
**Problem:** 5 rare objectives for attackers, 1 for goalkeepers, 0 for defenders
**Impact:**
- Drafting multiple attackers becomes high-value strategy (80+ points possible)
- Goalkeeper-heavy teams cap at ~65 points
- Defender strategies have no rare objectives (only common objectives)

#### Issue #2: Goalkeeper Strategy Is Single-Threaded
**Problem:** Only CLEAN_SHEET_KING rare objective; BRICK_WALL is the only common goalkeeper objective
**Impact:**
- Goalkeepers are "all-or-nothing" - succeed on team defense or score low
- No goalkeeper-specific rare objectives for attacking goalkeepers (libero style)
- Less tactical variety for goalkeepers

#### Issue #3: Defender Strategies Lack Rare Objectives
**Problem:** No rare objectives apply exclusively to defenders
**Impact:**
- Pure defensive drafts cannot reach high scores (capped at ~30 points from common objs)
- Defenders only score on ENFORCER (+1) and CARD_MAGNET (+2)
- No incentive to draft elite defenders as primary team composition

#### Issue #4: Attacker Position Overlap
**Problem:** FWD and MID have significant objective overlap (FINISHER, CREATOR both apply)
**Impact:**
- Both positions compete for same scoring opportunities
- Less tactical distinction between forward and midfielder roles

---

## Objective-Based Draft Incentives

### Current Incentive Pyramid

```
HIGH VALUE (80+ pts)     [Attacker + Attacker (multiple rare)]
MEDIUM-HIGH VALUE (65-79) [Mixed 2-3 positions]
MEDIUM VALUE (50-64)      [Balanced team]
LOW VALUE (35-49)         [Goalkeeper/Defender heavy]
```

**Issue:** Top of pyramid is too narrow - only attacker combinations reach highest tier.

---

## Recommendations

### 🎯 Priority 1: Add Defender Rare Objective (CRITICAL)

**Objective Name:** TACTICIAN  
**Description:** +7 if 3+ tackles  
**Position:** DEF (exclusive)  
**Trigger:** Player records 3 or more tackles  
**Rarity:** RARE  
**Strategic Intent:** Rewards elite defenders for physical dominance

**Why:** Gives pure defensive drafts a viable high-value strategy (rare objective achievable through defensive play)

**Example Impact:**
- Defender now reaches ~50-60 points (vs. 15-25)
- Defender-heavy teams become viable strategy

---

### 🎯 Priority 2: Add Goalkeeper Rare Objective (IMPORTANT)

**Objective Name:** SHOT_STOPPER  
**Description:** +6 if 5+ saves  
**Position:** GK (exclusive)  
**Trigger:** Goalkeeper records 5 or more saves  
**Rarity:** RARE  
**Strategic Intent:** Rewards active goalkeepers facing attack volume

**Why:** Gives goalkeeper strategies more tactical variety beyond clean sheets

**Relationship to CLEAN_SHEET_KING:**
- CLEAN_SHEET_KING (+8): Rewards team defense
- SHOT_STOPPER (+6): Rewards individual goalkeeper performance

**Example Impact:**
- Goalkeeper strategies now have two distinct rare objectives
- Goalkeeper + Attacker hybrid teams become more viable

---

### 🎯 Priority 3: Adjust Rare Objective Points Distribution (RECOMMENDED)

**Current Distribution (too skewed):**
- Rare attackers: +8 to +10 points
- Rare goalkeeper: +8 points
- Rare defenders: 0 points

**Proposed Distribution:**
- High-difficulty attacker objectives (BRACE_HUNTER, MATCH_WINNER): +10
- Medium-difficulty rare objectives (ASSIST_MACHINE, SHOT_STOPPER, CLEAN_SHEET_KING): +8
- Lower-difficulty rare objectives (CLUTCH_PLAYER, SUPER_SUB, TACTICIAN): +7

**Why:** Normalizes scoring across positions while preserving difficulty-based rewards

---

### 🎯 Priority 4: Position-Specific Applicability (RECOMMENDED)

**Current Issue:** FINISHER and CREATOR apply to both FWD and MID, creating overlap

**Proposed Solution - Create Position-Variant Objectives:**

Option A: Position-specific variants
```typescript
FINISHER_FWD: {
  id: 'FINISHER_FWD',
  name: 'Finisher',
  description: '+3 per Goal',
  applicablePositions: ['FWD'],
  rarity: 'COMMON',
  // ... rest of fields
}

FINISHER_MID: {
  id: 'FINISHER_MID',
  name: 'Goal Contributor',  // Different name to reflect MID role
  description: '+2 per Goal',  // Lower points for midfielders
  applicablePositions: ['MID'],
  rarity: 'COMMON',
  // ... rest of fields
}
```

**Why:** Encourages more diverse position drafting; rewards different roles with different point values

**Trade-off:** More objectives to manage; may increase cognitive load

Option B: Keep current but add defensive variants
```typescript
// Keep FINISHER + CREATOR as-is
// Add defensive versions:

NEUTRALIZER: {
  name: 'Neutralizer',
  description: '+1 per Interception',  // New event type
  applicablePositions: ['DEF'],
  rarity: 'COMMON',
  // Rewards defensive positioning
}

COVERAGE_SPECIALIST: {
  name: 'Coverage Specialist',
  description: '+1 per Block',  // New event type
  applicablePositions: ['DEF'],
  rarity: 'COMMON',
  // Rewards defensive blocking
}
```

**Recommendation:** Start with Option B (add new defensive objectives rather than create variants)

---

## Objective Rarity Review

### Event Type Frequency Assessment

```
VERY FREQUENT (occurs 5-10x per match):
  - Goal (FWD/MID)
  - Save (GK)
  - Shot on Target (FWD)
  - Pass Completion (MID)
  - Tackle (DEF)

FREQUENT (occurs 2-5x per match):
  - Assist (MID/FWD)
  - Foul (DEF/MID)
  - Yellow Card (DEF/MID)
  - Interception (DEF)
  - Block (DEF)

MODERATE (occurs 0-2x per match):
  - Multi-goal/Multi-assist
  - Red Card
  - Missed Penalty
  - Substitution scoring
  - Clean Sheet (team-dependent)

RARE (occurs <1x per match):
  - Winning Goal
  - Own Goal
  - Penalty Kick
```

**Current Mapping Validation:**
- ✅ FINISHER (+3 per goal) - Event is VERY FREQUENT, points are reasonable
- ✅ BRICK_WALL (+1 per save) - Event is VERY FREQUENT, points are appropriate
- ✅ BRACE_HUNTER (+10 for 2+ goals) - Threshold-based, MODERATE frequency, points justified
- ⚠️ CLEAN_SHEET_KING (+8) - Team-dependent, hard to predict for one player
- ✅ Points scaling matches frequency correctly

---

## Multi-Position Draft Incentives

### Current State
**Drafted positions typically take 2-3 of:**
- Forward
- Midfielder
- Defender
- Goalkeeper

### Analysis

**Why FWD + MID dominates:**
1. 5/6 rare objectives apply to one of these positions
2. Goal and assist events are most frequent (highest scoring)
3. Common objectives like FINISHER and CREATOR apply to both

**Why DEFENDER strategy is weak:**
1. No rare objectives available
2. Only 2 common objectives (ENFORCER, CARD_MAGNET)
3. Lower point values for comparable common objectives

**Why GOALKEEPER strategy is inconsistent:**
1. Only 1 rare objective (all-or-nothing: clean sheet)
2. Highly dependent on team defense
3. No control over outcome (team defensive quality)

---

## Recommendations Summary

| Issue | Priority | Fix | Implementation |
|-------|----------|-----|-----------------|
| Defenders lack rare objectives | CRITICAL | Add TACTICIAN (+7, 3+ tackles) | 1-2 hours |
| Goalkeepers have limited variety | IMPORTANT | Add SHOT_STOPPER (+6, 5+ saves) | 1-2 hours |
| Attacker objectives worth too much | RECOMMENDED | Adjust rare points (8→7 for CLUTCH_PLAYER, SUPER_SUB) | 30 mins |
| Position overlap reduces diversity | RECOMMENDED | Add defensive variants (NEUTRALIZER, COVERAGE_SPECIALIST) | 2-3 hours |
| Event types limit goalkeeper play | NICE-TO-HAVE | Add BLOCK, INTERCEPTION event types | 2-3 hours |

---

## Scoring Ceiling Analysis

### Projected Max Scores by Strategy (3-player draft)

**Attacker-Heavy (FWD + MID + Sub):**
- Best case: FWD (FINISHER +3, MARKSMAN +1, BRACE_HUNTER +10) + MID (CREATOR +2, FINISHER +3, ASSIST_MACHINE +8) + impact substitute = **~70-100 points**

**Balanced (FWD + DEF + GK):**
- Best case: FWD (FINISHER +3, CREATOR +2, MATCH_WINNER +10) + DEF (CARD_MAGNET +2, [no rare]) + GK (BRICK_WALL +1, CLEAN_SHEET_KING +8) = **~50-80 points**

**Goalkeeper-Heavy (GK + DEF + MID):**
- Best case: GK (BRICK_WALL +1, CLEAN_SHEET_KING +8, SHOT_STOPPER +6) + DEF (CARD_MAGNET +2, TACTICIAN +7) + MID (CREATOR +2) = **~50-75 points**

**After Recommendations (removes ceiling gap):**
- Gap narrows from 50-point spread to 25-point spread
- All strategies become viable
- Draft diversity improves

---

## Next Steps

1. **Validate event tracking** - Ensure all referenced events (TACKLE, BLOCK, INTERCEPTION) are implemented in eventRegistry
2. **Add new objectives** - Implement TACTICIAN and SHOT_STOPPER in objectiveRegistry
3. **Adjust point values** - Update rare objective points in objectiveRegistry
4. **Test drafting scenarios** - Simulate draft scenarios with updated objectives
5. **Monitor actual gameplay** - Track which strategies win in early games

---

## Appendix: Complete Objective Checklist

### Common Objectives (7)
- [x] FINISHER - Core attacker objective
- [x] CREATOR - Core midfielder objective
- [x] MARKSMAN - Attacker-specific (shots)
- [x] ENFORCER - Defender-specific (fouls)
- [x] CARD_MAGNET - Defender-specific (cards)
- [x] BRICK_WALL - Goalkeeper-specific (saves)
- [x] WORKHORSE - Universal (starts)

### Rare Objectives (6 current → 8 proposed)
- [x] BRACE_HUNTER - Striker-specific
- [x] MATCH_WINNER - Attack-focused
- [x] CLUTCH_PLAYER - Attack-focused
- [x] SUPER_SUB - Attack-focused
- [x] ASSIST_MACHINE - Midfielder-specific
- [x] CLEAN_SHEET_KING - Goalkeeper-specific
- [ ] **TACTICIAN** - Defender-specific (NEW)
- [ ] **SHOT_STOPPER** - Goalkeeper-specific (NEW)

### Event Types Required
- [x] GOAL - Implemented
- [x] ASSIST - Implemented
- [x] SHOT_ON_TARGET - Implemented
- [x] FOUL_COMMITTED - Implemented
- [x] YELLOW_CARD - Implemented
- [x] SAVE - Implemented
- [x] STARTER - Implemented
- [ ] TACKLE - Need to verify
- [ ] BLOCK - Need to verify
- [ ] INTERCEPTION - Need to verify
- [ ] OWN_GOAL - Fiasco bonus
- [ ] RED_CARD - Fiasco bonus
- [ ] MISSED_PENALTY - Fiasco bonus

---

**Document Complete:** Phase 4.6 Gameplay Balance Report  
**Status:** Ready for Implementation
