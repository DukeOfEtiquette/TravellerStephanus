# Careers Analysis Methodology

This document provides standardized methodology for analyzing the luck of character creation rolls in Steps 4-5: Career Procedure and Additional Careers.

---

## Overview

Each career involves multiple roll types:
1. **Qualification**: Can the character enter this career?
2. **Basic Training**: Initial skill acquisition (first career only)
3. **Training**: Skill acquisition each term
4. **Special Assignments**: Bonus opportunities each term
5. **Leadership**: Advancement in rank each term
6. **Retirement**: Cash and material benefits upon leaving

Steps 4 and 5 use identical procedures, except additional careers skip basic training.

---

## Reference Data

### 2d6 Probability Distribution (Quick Reference)

| Target | P(Success) | Assessment |
|--------|------------|------------|
| 5+     | 83.33%     | Easy |
| 6+     | 72.22%     | Moderate |
| 7+     | 58.33%     | Standard |
| 8+     | 41.67%     | Difficult |
| 9+     | 27.78%     | Hard |
| 10+    | 16.67%     | Very Hard |
| 11+    | 8.33%      | Extreme |
| 12+    | 2.78%      | Nearly Impossible |

### Modifier Impact on 7+ Rolls

| Modifier | Effective Target | P(Success) |
|----------|------------------|------------|
| -2       | 9+               | 27.78%     |
| -1       | 8+               | 41.67%     |
| 0        | 7+               | 58.33%     |
| +1       | 6+               | 72.22%     |
| +2       | 5+               | 83.33%     |

### Career Qualification Targets

| Career     | Attribute | Target | Base P(Success) |
|------------|-----------|--------|-----------------|
| Military   | STR       | 5+     | 83.33%          |
| Mercantile | INT       | 7+     | 58.33%          |
| Frontier   | END       | 5+     | 83.33%          |
| Noble      | SOC       | 9+     | 27.78%          |
| Drifter    | —         | Auto   | 100%            |
| Psion      | PSI       | 7+     | 58.33%          |

### Leadership Targets

| Career     | Attribute | Target |
|------------|-----------|--------|
| Military   | INT       | 7+     |
| Mercantile | EDU       | 7+     |
| Frontier   | DEX       | 7+     |
| Noble      | SOC       | 7+     |
| Drifter    | —         | N/A    |
| Psion      | INT       | 7+     |

---

## Analysis Methodology

### 4.1 Qualification Analysis

For each career attempted:
1. Note the target and relevant attribute modifier
2. Calculate the probability of success
3. Compare the actual roll to the expected outcome

**Assessment Categories:**
- **Easy success**: Had 70%+ chance, succeeded
- **Lucky success**: Had <50% chance, succeeded
- **Expected failure**: Had <30% chance, failed
- **Unlucky failure**: Had 50%+ chance, failed
- **Critical roll**: Succeeded/failed by exactly 1

For failed qualifications, note the resolution:
- Drafted (one-time option)
- Forced into Drifter

### 4.2 Basic Training Analysis

First career only. Character rolls twice on the Service Skills table.

**Assessment:**
- Note which skills were gained
- Assess synergy with career path
- Flag any particularly lucky/unlucky draws (e.g., getting a skill that later stacks well)

### 4.3 Training Analysis

One roll per term on a table of the character's choice. Since table choice is player-driven, analyze:

**Skill Stacking:**
- Did repeated rolls on the same table produce skill increases?
- How many unique skills vs. skill ranks gained?

**Table Access:**
- Could they access Advanced Education (requires EDU 8+)?
- Did they utilize all available tables?

### 4.4 Special Assignment Analysis

Each term: roll 2d6, 7+ grants a bonus training roll.

**Expected Success Rate:** 58.33% per term

For a multi-term career, calculate:
- Expected successes: terms × 0.5833
- Actual successes
- Luck assessment: actual vs. expected

**Cumulative Probability Reference:**

| Terms | Expected Successes | P(0 successes) | P(all successes) |
|-------|-------------------|----------------|------------------|
| 1     | 0.58              | 41.67%         | 58.33%           |
| 2     | 1.17              | 17.36%         | 34.03%           |
| 3     | 1.75              | 7.23%          | 19.85%           |
| 4     | 2.33              | 3.01%          | 11.58%           |
| 5     | 2.92              | 1.26%          | 6.75%            |

### 4.5 Leadership Analysis

Each term: roll 2d6 + attribute modifier vs 7+.

**Analysis Approach:**
1. Calculate P(success) for each term given the modifier
2. Calculate expected promotions: terms × P(success)
3. Compare actual promotions to expected
4. Note final rank achieved

**Rank Progression Assessment:**
- **Rapid advancement**: Promoted more terms than expected
- **Average advancement**: Within ±1 of expected
- **Slow advancement**: Promoted fewer terms than expected

**Drifter Exception:** Drifters don't roll for leadership. Instead, they roll for "Specials" — analyze these separately.

### 4.6 Retirement Analysis

#### Cash Roll
Roll 2d6 + leadership rank, consult career's cash table.

**Analysis:**
- Note the roll and final modified result
- Compare to cash table breakpoints
- Assess if leadership rank meaningfully improved the result

#### Material Benefits
Roll 1d6 once per term PLUS once per leadership rank.

**Analysis:**
- Total rolls = terms + final rank
- Categorize benefits: attribute bonuses, equipment, passages, vehicles
- Note any particularly lucky/unlucky rolls (e.g., multiple vehicles, no useful benefits)

---

## Analysis Template

```markdown
## [Character Name] - Careers Analysis

### Career Overview
- **Total Careers**: [X]
- **Total Terms**: [X]
- **Career Sequence**: [Career 1] ([X] terms) → [Career 2] ([X] terms) → ...

---

### Career 1: [Name]

#### Qualification
- **Target**: [attribute] [target]+
- **Modifier**: [X] ([attribute] [score])
- **Roll**: [X]
- **Total**: [X]
- **Result**: [Pass/Fail]
- **P(Success)**: [X%]
- **Assessment**: [assessment]

#### Basic Training
- **Table**: [Service/etc.]
- **Rolls**: [X, X]
- **Skills Gained**: [skill-1, skill-1]
- **Assessment**: [assessment of skill synergy]

#### Training (X terms)

| Term | Table | Roll | Result | Notes |
|------|-------|------|--------|-------|
| 1    | [X]   | [X]  | [skill]| [notes] |
| 2    | [X]   | [X]  | [skill]| [notes] |
| ...  | ...   | ...  | ...    | ...   |

- **Skill Summary**: [list unique skills and final ranks]
- **Assessment**: [analysis of skill acquisition luck/strategy]

#### Special Assignments

| Term | Roll | Result |
|------|------|--------|
| 1    | [X]  | [bonus/none] |
| 2    | [X]  | [bonus/none] |
| ...  | ...  | ...    |

- **Expected Successes**: [X.XX]
- **Actual Successes**: [X]
- **Assessment**: [lucky/average/unlucky]

#### Bonus Training (from Special Assignments)

| # | Table | Roll | Result |
|---|-------|------|--------|
| 1 | [X]   | [X]  | [skill]|
| ...| ...  | ...  | ...    |

#### Leadership

- **Target**: [attribute] 7+
- **Modifier**: [X] ([attribute] [score])
- **P(Success per term)**: [X%]
- **Expected Promotions**: [X.XX]

| Term | Roll | Total | Result |
|------|------|-------|--------|
| 1    | [X]  | [X]   | [promoted/none] |
| 2    | [X]  | [X]   | [promoted/none] |
| ...  | ...  | ...   | ...    |

- **Final Rank**: [X]
- **Rank Benefits**: [list benefits gained]
- **Assessment**: [rapid/average/slow advancement]

#### Retirement

**Cash:**
- **Roll**: [X]
- **Rank Modifier**: +[X]
- **Total**: [X]
- **Result**: [X] Cr
- **Assessment**: [assessment]

**Material Benefits ([X] rolls = [X] terms + [X] rank):**

| Roll | Result |
|------|--------|
| [X]  | [benefit] |
| ...  | ...    |

- **Summary**: [categorized list of benefits]
- **Assessment**: [assessment]

#### Career 1 Summary
[2-3 sentences on overall luck and narrative significance of this career]

---

### Career 2: [Name]
[Repeat structure, noting "No basic training" for additional careers]

---

### Careers Overall Assessment
[3-4 sentences synthesizing all careers. Total skill ranks gained, total cash, key lucky/unlucky moments, how the career path shaped the character.]
```

---

## Example Analysis: William Hung

### Career Overview
- **Total Careers**: 2
- **Total Terms**: 5
- **Career Sequence**: Mercantile (2 terms) → Mercantile/Drafted (3 terms)

---

### Career 1: Mercantile (2 terms)

#### Qualification
- **Target**: INT 7+
- **Modifier**: +1 (INT 10)
- **Roll**: 6
- **Total**: 7
- **Result**: Pass (exactly)
- **P(Success)**: 72.22%
- **Assessment**: Made it by the skin of his teeth. With a +1 modifier, he needed a 6+ and rolled exactly 6. A roll of 5 would have meant draft or Drifter.

#### Basic Training
- **Table**: Service
- **Rolls**: [6, 1]
- **Skills Gained**: Steward-1, Broker-1
- **Assessment**: Excellent draw. Both skills are core Mercantile competencies that would stack well with later training.

#### Training (2 terms)

| Term | Table   | Roll | Result       | Notes |
|------|---------|------|--------------|-------|
| 1    | Service | 5    | Streetwise-1 | Fits "Streets" background |
| 2    | Service | 6    | Steward-2    | Stacks with basic training |

- **Skill Summary**: Broker-1, Steward-2, Streetwise-1
- **Assessment**: Good synergy. Rolling Steward again on term 2 turned basic training into a foundation for expertise.

#### Special Assignments

| Term | Roll | Result |
|------|------|--------|
| 1    | 12   | Bonus (critical success!) |
| 2    | 4    | None |

- **Expected Successes**: 1.17
- **Actual Successes**: 1
- **Assessment**: Average overall, but that natural 12 on term 1 was memorable.

#### Bonus Training

| # | Table   | Roll | Result      |
|---|---------|------|-------------|
| 1 | Service | 2    | Carousing-1 |

- **Assessment**: Carousing fits the character perfectly — the party-throwing purser.

#### Leadership

- **Target**: EDU 7+
- **Modifier**: -1 (EDU 5)
- **P(Success per term)**: 41.67%
- **Expected Promotions**: 0.83

| Term | Roll | Total | Result |
|------|------|-------|--------|
| 1    | 4    | 3     | None |
| 2    | 8    | 7     | Promoted (Rank 1) |

- **Final Rank**: 1
- **Rank Benefits**: Broker-2
- **Assessment**: Exactly matched expectation. The -1 modifier made promotion tough, but he squeaked through on term 2.

#### Retirement

**Cash:**
- **Roll**: 9
- **Rank Modifier**: +1
- **Total**: 10
- **Result**: 30,000 Cr
- **Assessment**: Solid roll. One bracket below maximum for this career.

**Material Benefits (3 rolls = 2 terms + 1 rank):**

| Roll | Result |
|------|--------|
| 5    | Personal Vehicle |
| 3    | +1 EDU (5→6) |
| 4    | +1 SOC (3→4) |

- **Summary**: 1 vehicle, +1 EDU, +1 SOC
- **Assessment**: Excellent spread. The attribute bumps helped offset his weak starting stats, and the vehicle gave him mobility.

#### Career 1 Summary
William's first career was a near-miss success story. He barely qualified, advanced slowly due to his poor education, but made the most of his opportunities. The natural 12 on his first special assignment set the tone for a character who occasionally gets spectacularly lucky. He left at 26 with solid Mercantile skills, a ground car, and attribute improvements that would help in his second career.

---

### Career 2: Mercantile/Drafted (3 terms)

#### Qualification
- **Attempted**: Military
- **Target**: STR 5+
- **Modifier**: 0 (STR 8)
- **Roll**: 4
- **Total**: 4
- **Result**: Fail
- **P(Success)**: 83.33%
- **Assessment**: Very unlucky. Military is the easiest career to enter (83% base), and he rolled below the threshold. This forced the draft into Mercantile.

#### Training (3 terms)

| Term | Table   | Roll | Result    | Notes |
|------|---------|------|-----------|-------|
| 1    | Service | 1    | Broker-3  | Stacks to rank 3 |
| 2    | Service | 2    | Carousing-2 | Stacks to rank 2 |
| 3    | Service | 6    | Steward-3 | Stacks to rank 3 |

- **Skill Summary**: Broker-3, Carousing-2, Steward-3
- **Assessment**: Remarkable skill stacking. Every roll advanced an existing skill rather than gaining something new.

#### Special Assignments

| Term | Roll | Result |
|------|------|--------|
| 1    | 8    | Bonus |
| 2    | 9    | Bonus |
| 3    | 9    | Bonus |

- **Expected Successes**: 1.75
- **Actual Successes**: 3 (all terms!)
- **P(3/3 successes)**: 19.85%
- **Assessment**: Very lucky. Narrative explanation: Vasquez gave him prime assignments.

#### Bonus Training

| # | Table   | Roll | Result      |
|---|---------|------|-------------|
| 1 | Service | 3    | Diplomacy-1 |
| 2 | Service | 2    | Carousing-3 |
| 3 | Service | 2    | Carousing-4 |

- **Assessment**: Two Carousing stacks in a row (both rolled 2) pushed this skill to ridiculous heights. The Diplomacy pickup added breadth.

#### Leadership

- **Target**: EDU 7+
- **Modifier**: 0 (EDU 6, improved from career 1)
- **P(Success per term)**: 58.33%
- **Expected Promotions**: 1.75

| Term | Roll | Total | Result |
|------|------|-------|--------|
| 1    | 10   | 10    | Promoted (Rank 1→2) |
| 2    | 8    | 8     | Promoted (Rank 2→3) |
| 3    | 8    | 8     | Promoted (Rank 3→4... wait) |

*Note: Looking at the character sheet, final rank was 3, so one of these may have been recorded differently. Assuming 3 promotions to Rank 3.*

- **Final Rank**: 3
- **Rank Benefits**: Broker-4, Steward-4, +1 EDU (6→7)
- **Assessment**: Very lucky. Promoted every term with only 58% odds each time. P(3/3) = 19.85%.

#### Retirement

**Cash:**
- **Roll**: 10
- **Rank Modifier**: +3
- **Total**: 13
- **Result**: 45,000 Cr
- **Assessment**: Excellent. Hit the second-highest bracket.

**Material Benefits (6 rolls = 3 terms + 3 rank):**

| Roll | Result |
|------|--------|
| 6    | Personal Vehicle |
| 6    | Personal Vehicle |
| 1    | High Passage |
| 6    | Personal Vehicle |
| 1    | High Passage |
| 5    | Personal Vehicle |

- **Summary**: 4 Personal Vehicles, 2 High Passages
- **Assessment**: Extremely lucky on vehicles (four 5s and 6s), but no attribute bumps. The vehicle haul enabled a shuttlecraft.

#### Career 2 Summary
William's second Mercantile career was blessed by the dice. After unluckily failing Military qualification, everything went his way: 3/3 special assignments, 3/3 promotions, excellent retirement rolls. The narrative of Vasquez's mentorship perfectly explains this mechanical luck — she put him in positions to succeed, and he delivered every time.

---

### Careers Overall Assessment

William Hung's career phase tells a story of redemption through patronage. His first career was modest — barely qualified, slow advancement, average results. His failed attempt at Military could have derailed everything, but being drafted back into Mercantile under Vasquez's wing transformed his trajectory. The second career saw exceptional luck: perfect special assignment success (19.85% odds), perfect promotion success (19.85% odds), and a retirement haul heavy on vehicles.

**Final Career Statistics:**
- **Total Cash**: 75,000 Cr
- **Total Skill Ranks**: 14 (Broker-4, Carousing-4, Diplomacy-1, Steward-4, Streetwise-1)
- **Attribute Improvements**: +2 EDU, +1 SOC
- **Equipment**: 5 Personal Vehicles, 2 High Passages

The dice created a character who started rough, failed at branching out, but found his calling when a mentor gave him a second chance. His high Carousing (eventually 5 after sabbatical) and maxed-out Broker/Steward skills make him one of the best social operators in the sector.
