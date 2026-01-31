# Traveller Stephanus - Claude Code Guide

> **IMPORTANT**: Do NOT read files from `references/` unless explicitly instructed by the user. All game data has been extracted into structured YAML files in `data/`. Use those instead.

## Project Overview

This is a companion project for a tabletop RPG campaign using **Traveller Stephanus**, a custom variant of Classic Traveller. The project provides structured data for rules, worlds, and campaign information.

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

For schema examples, see these files:

- **Character schema**: `characters/active/william-hung/william-hung.yaml`
- **World profile (UWP) schema**: `data/worlds/systems.yaml`
- **Career data schema**: `data/careers/*.yaml`

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

## Directory Structure

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
├── data/                  # Structured game data (YAML)
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
│   ├── sessions/          # GM session recaps
│   │   └── session-*.yaml
│   ├── worlds/
│   │   └── systems.yaml
│   ├── equipment/
│   │   ├── weapons.yaml
│   │   ├── armor.yaml
│   │   └── vehicles.yaml
│   ├── party.yaml         # Other party members (lightweight tracking)
│   └── assets.yaml        # Shared ships, party funds, equipment
├── characters/            # Character records and analysis
│   ├── _analysis_methodology/
│   ├── active/
│   │   └── william-hung/
│   └── inactive/
│       └── kelly-clarkson/
├── scripts/               # Utility scripts
└── templates/             # Document templates
```

## Querying Campaign Data

When helping with rules questions, use the structured data files in `data/`:

- **Character creation**: `data/rules/character-creation.yaml`
- **Combat rules**: `data/rules/combat.yaml`
- **Skills**: `data/rules/skills.yaml`
- **Career tables**: `data/careers/*.yaml` (military, mercantile, frontier, noble, drifter, psion)
- **World info**: `data/worlds/systems.yaml`
- **Prices/equipment**: `data/equipment/prices.yaml`
- **GM session recaps**: `data/sessions/session-*.yaml`
- **Party members**: `data/party.yaml` (other PCs in the group)
- **Shared assets**: `data/assets.yaml` (ships, party funds, shared equipment)

For character-specific session notes, see `characters/active/*/session-notes.md`.

> Do NOT use `references/` - those are raw source files. All data has been extracted into `data/`.

## Notes

- The markdown files were copy-pasted from Discord and may have formatting artifacts (e.g., emoji reactions, timestamps in `world-profiles-how-to.md`)
- Attribute abbreviation inconsistency: Character sheet uses DEX, creation worksheet uses AGI (both refer to Dexterity)
- Some pregens show attributes in compact hex format (e.g., "B79878" = STR 11, DEX 7, END 9, INT 8, EDU 7, SOC 8)
