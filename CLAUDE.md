# Traveller Stephanus - Claude Code Guide

> **IMPORTANT**: Do NOT read files from `references/` unless explicitly instructed by the user. All game data has been extracted into structured YAML files in `data/`. Use those instead.

## Project Overview

This is a companion web app for a tabletop RPG campaign using **Traveller Stephanus**, a custom variant of Classic Traveller. The project serves two purposes:

1. **Digital Character Sheet** - A web app for creating, editing, and managing characters
2. **Campaign Knowledge Base** - Structured data for rules, worlds, and campaign information

## Source Material

### Local References (`references/`)

Raw source files from the GM's Discord:

| File | Contents |
|------|----------|
| `charsheet.pdf` | Character record sheet template |
| `chargen.pdf` | Character creation rules and procedures |
| `careers1.pdf` | Military and Mercantile career tables |
| `careers2.pdf` | Frontier, Noble, Drifter, and Psion career tables |
| `pregens.pdf` | Sample pre-generated characters |
| `system-fundamentals.md` | Core game mechanics (throws, combat, expertise) |
| `settings-fundamentals.md` | Setting assumptions (travel, starports, communication) |
| `world-profiles.md` | Inhabited systems with descriptions |
| `world-profiles-how-to.md` | Universal World Profile (UWP) format explanation |

### External Resources

| URL | Contents |
|-----|----------|
| https://smparkin.com/games/ctrav/prices | **Price Guide** - Comprehensive economics and equipment catalog |

The price guide includes:
- **Economics**: Living expenses, starship operating costs
- **Services**: Staff wages, parcel delivery costs
- **Travel**: Passage types and navigation expenses
- **Weapons**: Hand weapons (10-50 Cr) to crew-fed guns (1-3k Cr)
- **Armor**: Cloth to power armor (4k Cr)
- **Tools & Equipment**: Vacc suits, computers, communicators, kits
- **Drugs**: Medical and combat pharmaceuticals
- **Vehicles**: Ground cars to shuttlecraft
- **Robots**: Service and combat models

## Data Model

### Character Schema

```yaml
character:
  name: string
  attributes:
    STR: number (2-12)
    DEX: number (2-12)
    END: number (2-12)
    INT: number (2-12)
    EDU: number (2-12)
    SOC: number (2-12)
    PSI: number (optional, for psions)

  hitProtection:
    total: number        # STR + DEX + END
    current: number
    bloodied: number     # 2/3 of total
    armor: string

  background:
    age: number          # 18 + (4 * terms), 6 years for Drifter terms
    homeworld: enum      # Agricultural, Fringe, Spacer, Industrial, High Culture
    schooling: enum      # The Streets, Apprenticeship, Military Academy, University, Finishing School

  careers:
    - name: string       # Military, Mercantile, Frontier, Noble, Drifter, Psion
      terms: number
      rank: number

  expertise:             # Skills with ranks 1-3
    - name: string
      rank: number

  equipment:
    weapons: string[]
    gear: string[]
    vehicles: string[]
    cash: number
    stipend: number      # Weekly income, if any

  notes: string
```

### World Profile (UWP) Schema

Format: `[Starport]-[Size][Atmo][Hydro]-[Pop][Law][Tech]`

```yaml
world:
  name: string
  uwp: string            # e.g., "A-B75-77Q"
  starport: enum         # A, B, C, D, X
  physical:
    size: hex            # 0-C, 7 = Earth-like
    atmosphere: hex      # 0-C, 7 = Earth-like
    hydrosphere: hex     # 0-A (percentage/10)
  human:
    population: hex      # Exponent (7 = tens of millions)
    lawLevel: hex
  techLevel: enum        # P (Primitive), I (Industrial), A (Atomic), Q (Quantum)
  description: string
```

### Career Data Schema

```yaml
career:
  name: string
  qualification:
    attribute: string
    target: number
  leadership:
    attribute: string
    target: number
  skills:
    service: string[]
    personalDevelopment: string[]
    advancedEducation: string[]
  leadershipRanks:
    - rank: number
      benefit: string
  retirement:
    cash: object         # Roll ranges to amounts
    material: string[]   # 1d6 table
```

## Key Game Mechanics

### Throws
- Roll 2d6 + modifiers vs target number (usually 8+)
- Expertise ranks add +1 per rank to relevant throws

### Combat
- Attack: 2d6 + mods vs 8+
- Damage: 1d-4d based on weapon type (+2d for quantum weapons)
- Hit Protection = STR + DEX + END
- Bloodied at 2/3 HP lost (requires medical care)

### Attribute Modifiers (Character Creation)
| Score | Modifier |
|-------|----------|
| 2 | -2 |
| 3-5 | -1 |
| 6-8 | 0 |
| 9-11 | +1 |
| 12 | +2 |

## Directory Structure (Target)

```
/
├── CLAUDE.md              # This file
├── README.md              # Project documentation
├── references/            # Original source materials (PDFs, Discord exports)
│   ├── charsheet.pdf
│   ├── chargen.pdf
│   ├── careers1.pdf
│   ├── careers2.pdf
│   ├── pregens.pdf
│   ├── system-fundamentals.md
│   ├── settings-fundamentals.md
│   ├── world-profiles.md
│   └── world-profiles-how-to.md
├── data/                  # Structured game data (JSON/YAML)
│   ├── rules/
│   │   ├── combat.yaml
│   │   ├── character-creation.yaml
│   │   └── mechanics.yaml
│   ├── careers/
│   │   ├── military.yaml
│   │   ├── mercantile.yaml
│   │   ├── frontier.yaml
│   │   ├── noble.yaml
│   │   ├── drifter.yaml
│   │   └── psion.yaml
│   ├── worlds/
│   │   └── systems.yaml
│   └── equipment/
│       ├── weapons.yaml
│       ├── armor.yaml
│       └── vehicles.yaml
└── src/                   # Web app source
    ├── components/
    ├── pages/
    ├── stores/            # Character state management
    └── utils/
```

## Development Guidelines

### Tech Stack
- **Styling**: Tailwind CSS
- **Framework**: TBD (user has no preference)
- **Storage**: localStorage for MVP

### MVP Features
1. Character sheet form with all fields from `charsheet.pdf`
2. Manual data entry (no calculated fields initially)
3. Save/load characters to localStorage
4. Character list/selector for managing multiple characters
5. Export character data (JSON)

### Future Enhancements
- Calculated fields (Hit Protection, Bloodied threshold, age from terms)
- Rules reference/knowledge base searchable UI
- Character creation wizard following `chargen.pdf` procedure
- Campaign journal system
- Party management

## Querying Campaign Data

When helping with rules questions, use the structured data files in `data/`:

- **Character creation**: `data/rules/character-creation.yaml`
- **Combat rules**: `data/rules/combat.yaml`
- **Skills**: `data/rules/skills.yaml`
- **Career tables**: `data/careers/*.yaml` (military, mercantile, frontier, noble, drifter, psion)
- **World info**: `data/worlds/systems.yaml`
- **Prices/equipment**: `data/equipment/prices.yaml`

> Do NOT use `references/` - those are raw source files. All data has been extracted into `data/`.

## Notes

- The markdown files were copy-pasted from Discord and may have formatting artifacts (e.g., emoji reactions, timestamps in `world-profiles-how-to.md`)
- Attribute abbreviation inconsistency: Character sheet uses DEX, creation worksheet uses AGI (both refer to Dexterity)
- Some pregens show attributes in compact hex format (e.g., "B79878" = STR 11, DEX 7, END 9, INT 8, EDU 7, SOC 8)
