# Post-Career Analysis Methodology

This document provides standardized methodology for analyzing the luck of character creation rolls in Step 6: Age and Aging.

---

## Overview

Characters age during their careers. Those with 4 or more terms must roll for aging effects, which can reduce physical and mental attributes.

**Note:** Steps 7 (Hit Protection) and 8 (Equipment Selection) are calculations and player choices, not dice rolls, so they are excluded from luck analysis.

---

## Reference Data

### Age Calculation

```
Final Age = 18 + (4 × standard terms) + (6 × Drifter terms)
```

| Total Terms | Age (Standard) | Age (All Drifter) |
|-------------|----------------|-------------------|
| 3           | 30             | 36                |
| 4           | 34             | 42                |
| 5           | 38             | 48                |
| 6           | 42             | 54                |

### Aging Triggers

- **Terms 1-3**: No aging rolls
- **Terms 4+**: Roll 1d6 for each term from the 4th onward

| Terms | Aging Rolls Required |
|-------|---------------------|
| 3     | 0                   |
| 4     | 1                   |
| 5     | 2                   |
| 6     | 3                   |

### Aging Effects (1d6)

| Roll | Effect | Attributes Affected | Points Lost |
|------|--------|---------------------|-------------|
| 1-3  | Mild   | 1 random from STR, DEX, END | 1 |
| 4-5  | Moderate | 2 random from STR, DEX, END, INT | 2 |
| 6    | Severe | 3 random from STR, DEX, END, INT | 3 |

### Probability Distribution

| Roll | Probability | Expected Points Lost |
|------|-------------|---------------------|
| 1-3  | 50.00%      | 0.50                |
| 4-5  | 33.33%      | 0.67                |
| 6    | 16.67%      | 0.50                |
| **Total** | 100%   | **1.67 per roll**   |

### Expected Attribute Loss by Terms

| Terms | Aging Rolls | Expected Points Lost |
|-------|-------------|---------------------|
| 3     | 0           | 0                   |
| 4     | 1           | 1.67                |
| 5     | 2           | 3.33                |
| 6     | 3           | 5.00                |

### Attribute Selection (Random)

When attributes are selected randomly:
- **Mild (1-3)**: Equal 33.33% chance for STR, DEX, or END
- **Moderate/Severe (4-6)**: Equal 25% chance for STR, DEX, END, or INT; multiple draws without replacement

---

## Analysis Methodology

### 6.1 Aging Roll Analysis

For each aging roll:
1. Note the roll result
2. Categorize as Mild/Moderate/Severe
3. Calculate expected vs. actual attribute loss

**Assessment Scale:**
- **Lucky**: Lost fewer points than expected (rolled 1-3)
- **Average**: Lost about expected (rolled 4-5)
- **Unlucky**: Lost more than expected (rolled 6)

### 6.2 Cumulative Aging Analysis

Sum all attribute points lost across all aging rolls.

| Aging Rolls | Expected Loss | Lucky (<) | Average | Unlucky (>) |
|-------------|---------------|-----------|---------|-------------|
| 1           | 1.67          | 1         | 2       | 3           |
| 2           | 3.33          | 1-2       | 3-4     | 5-6         |
| 3           | 5.00          | 1-3       | 4-6     | 7-9         |

### 6.3 Attribute Distribution Analysis

Assess which attributes were affected:
- **Lucky distribution**: Losses spread across less critical attributes
- **Unlucky distribution**: Losses concentrated on key attributes for the character's role

Consider the character's career and skills:
- Combat characters suffer more from STR/DEX loss
- Technical characters suffer more from INT loss
- Social characters may care less about physical stats

### 6.4 Final State Assessment

Calculate the character's final Hit Protection and compare to pre-aging:

```
Hit Protection = STR + DEX + END
Bloodied = 2/3 of Hit Protection (rounded)
```

Note the percentage loss in Hit Protection due to aging.

---

## Analysis Template

```markdown
## [Character Name] - Post-Career Analysis

### Age Calculation
- **Terms**: [X] standard, [X] Drifter
- **Calculation**: 18 + (4 × [X]) + (6 × [X])
- **Final Age**: [X]

### Aging Rolls Required
- **Terms 4+**: [list terms requiring rolls]
- **Total Rolls**: [X]
- **Expected Attribute Loss**: [X.XX]

---

### Aging Roll Details

#### Term [X]
- **Roll**: [X]
- **Effect**: [Mild/Moderate/Severe] — [description]
- **Attributes Affected**: [list with before→after]
- **Points Lost**: [X]
- **Assessment**: [lucky/average/unlucky]

[Repeat for each aging roll]

---

### Cumulative Analysis

#### Total Attribute Loss
- **Expected**: [X.XX]
- **Actual**: [X]
- **Assessment**: [lucky/average/unlucky]

#### Affected Attributes Summary

| Attribute | Before Aging | After Aging | Change |
|-----------|--------------|-------------|--------|
| STR       | [X]          | [X]         | [X]    |
| DEX       | [X]          | [X]         | [X]    |
| END       | [X]          | [X]         | [X]    |
| INT       | [X]          | [X]         | [X]    |

#### Distribution Assessment
[Analysis of whether the losses were favorable or unfavorable given the character's role]

---

### Final State

#### Hit Protection
- **Before Aging**: STR [X] + DEX [X] + END [X] = [X]
- **After Aging**: STR [X] + DEX [X] + END [X] = [X]
- **Loss**: [X] points ([X%])
- **Bloodied Threshold**: [X]

---

### Post-Career Overall Assessment
[2-3 sentences summarizing aging luck and its impact on the character's final state]
```

---

## Example Analysis: William Hung

### Age Calculation
- **Terms**: 5 standard, 0 Drifter
- **Calculation**: 18 + (4 × 5) + (6 × 0)
- **Final Age**: 38 (40 after sabbatical)

### Aging Rolls Required
- **Terms 4+**: Terms 4 and 5
- **Total Rolls**: 2
- **Expected Attribute Loss**: 3.33

---

### Aging Roll Details

#### Term 4
- **Roll**: 3
- **Effect**: Mild — -1 from one random physical attribute
- **Attribute Selection**: Rolled 6 → END
- **Attributes Affected**: END 6→5
- **Points Lost**: 1
- **Assessment**: Lucky — rolled in the favorable 1-3 range

#### Term 5
- **Roll**: 6
- **Effect**: Severe — -1 from three random attributes (STR/DEX/END/INT)
- **Attribute Selection**: STR spared; DEX, END, and INT affected
- **Attributes Affected**: DEX 10→9, END 5→4, INT 10→9
- **Points Lost**: 3
- **Assessment**: Unlucky — rolled the worst possible result (16.67% chance)

---

### Cumulative Analysis

#### Total Attribute Loss
- **Expected**: 3.33
- **Actual**: 4
- **Assessment**: Slightly unlucky — lost about 0.7 points more than expected

#### Affected Attributes Summary

| Attribute | Before Aging | After Aging | Change |
|-----------|--------------|-------------|--------|
| STR       | 8            | 8           | 0      |
| DEX       | 10           | 9           | -1     |
| END       | 6            | 4           | -2     |
| INT       | 10           | 9           | -1     |

#### Distribution Assessment
William's aging was a mixed bag. The severe roll on term 5 hit three attributes, but STR was spared (lucky on the attribute selection). His DEX and INT both dropped from exceptional (10) to merely good (9), still providing +1 modifiers. The real pain was END dropping to 4, giving him a -1 modifier for endurance-related tasks and reducing his Hit Protection significantly.

For a social/merchant character, losing physical attributes hurts less than it would for a combat specialist. William's core competencies (Broker, Carousing, Steward, Diplomacy) don't rely on the affected attributes.

---

### Final State

#### Hit Protection
- **Before Aging**: STR 8 + DEX 10 + END 6 = 24
- **After Aging**: STR 8 + DEX 9 + END 4 = 21
- **Loss**: 3 points (12.5%)
- **Bloodied Threshold**: 14

---

### Post-Career Overall Assessment

William Hung's aging was slightly unlucky overall, losing 4 attribute points against an expected 3.33. The term 5 roll of 6 (severe aging) was painful — only a 16.67% chance — but the damage was mitigated by good fortune on which attributes were hit: STR was spared entirely, and the losses to DEX and INT still left him with positive modifiers. His END took the brunt of the punishment, dropping to 4, which narratively suggests a man who's spent too many years at parties and not enough in the gym. For a character whose strengths are social rather than physical, he aged about as gracefully as one could hope after rolling a 6.
