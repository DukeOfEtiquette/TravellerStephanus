# Traveller Stephanus Companion

A companion project for the Traveller Stephanus tabletop RPG campaign.

## Quick Reference

| Resource | Location |
|----------|----------|
| **Active Character** | [William Hung](characters/active/william-hung/william-hung.yaml) |
| **Price Guide** | [smparkin.com/games/ctrav/prices](https://smparkin.com/games/ctrav/prices) |
| **World Profiles** | [data/worlds/systems.yaml](data/worlds/systems.yaml) |
| **Combat Rules** | [data/rules/combat.yaml](data/rules/combat.yaml) |

## Setting Overview

The campaign takes place in the Mora cluster, featuring:

- **Interstellar travel** via jump drives (1 week in jump space regardless of distance)
- **No FTL communication** — information travels at the speed of ships
- **Diverse worlds** — from primitive societies to quantum-tech civilizations

### Political Factions

- **Quiru-Newhall alliance** — The dominant imperialist power bloc
- **Jade Front** — Resistance movement opposing the alliance

Key locations include Mora (fallen cultural hegemon), Newhall (imperialist power), Ith (advanced starfarers), and Mowebe (diaspora traders).

## About

Traveller Stephanus is a custom variant of Classic Traveller, an old-school sci-fi RPG focused on competent veteran characters adventuring across an interstellar setting. This project provides:

- **Structured Game Data** — Rules, careers, and world information in machine-readable formats
- **Character Records** — Character sheets and creation analysis
- **Campaign Knowledge Base** — Quick reference for rules, worlds, and setting information

## Characters

Character records are organized by status:

```
characters/
├── active/           # Currently played characters
│   └── william-hung/
└── inactive/         # Retired or dormant characters
    └── kelly-clarkson/
```

## Character Data Model

Characters in Traveller Stephanus have:

- **Attributes**: STR, DEX, END, INT, EDU, SOC (and PSI for psions)
- **Background**: Age, Homeworld type, Schooling type
- **Careers**: One or more careers with terms served and leadership rank
- **Expertise**: Skills ranked by ability (typically 1-4)
- **Hit Protection**: Derived from physical attributes
- **Equipment**: Weapons, gear, vehicles, cash, stipends

See `CLAUDE.md` for detailed schemas.

## Source Materials

Local files in `references/`:

| File | Description |
|------|-------------|
| `charsheet.pdf` | Blank character record sheet |
| `chargen.pdf` | Character creation rules |
| `careers1.pdf` / `careers2.pdf` | Career tables for all six careers |
| `pregens.pdf` | Sample characters |
| `system-fundamentals.md` | Core mechanics |
| `settings-fundamentals.md` | Setting assumptions |
| `world-profiles.md` | Inhabited star systems |
| `world-profiles-how-to.md` | UWP format guide |

External:

| URL | Description |
|-----|-------------|
| [smparkin.com/games/ctrav/prices](https://smparkin.com/games/ctrav/prices) | Price guide (equipment, services, vehicles, economics) |

## Contributing

This is a personal project for a specific tabletop campaign. The structured data may be useful as templates for other Traveller campaigns.

## License

Source materials are from the GM's custom Traveller Stephanus system.
