# Traveller Stephanus Companion

A digital companion app for the Traveller Stephanus tabletop RPG campaign.

## About

Traveller Stephanus is a custom variant of Classic Traveller, an old-school sci-fi RPG focused on competent veteran characters adventuring across an interstellar setting. This project provides:

- **Digital Character Sheets** - Create, edit, save, and manage characters
- **Campaign Knowledge Base** - Quick reference for rules, worlds, and setting information

## Current Status

**Phase: Data Organization**

The project currently contains raw source materials (PDFs and Discord exports) that need to be transformed into structured data formats.

### Source Materials

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

## Roadmap

### MVP
- [ ] Transform PDFs/markdown into structured YAML/JSON
- [ ] Basic character sheet web form
- [ ] Manual data entry for all character fields
- [ ] localStorage save/load
- [ ] Character list management
- [ ] JSON export

### Future
- [ ] Calculated fields (Hit Protection, Bloodied threshold, age)
- [ ] Character creation wizard
- [ ] Rules reference UI
- [ ] Campaign journal system
- [ ] Party/group management

## Tech Stack

- **Styling**: Tailwind CSS
- **Storage**: Browser localStorage (MVP)
- **Data Format**: YAML/JSON for structured game data

## Character Data Model

Characters in Traveller Stephanus have:

- **Attributes**: STR, DEX, END, INT, EDU, SOC (and PSI for psions)
- **Background**: Age, Homeworld type, Schooling type
- **Careers**: One or more careers with terms served and leadership rank
- **Expertise**: Skills ranked 1-3
- **Hit Protection**: Derived from physical attributes
- **Equipment**: Weapons, gear, vehicles, cash, stipends

See `CLAUDE.md` for detailed schemas.

## Setting Overview

The campaign takes place in the Mora cluster, featuring:

- **Interstellar travel** via jump drives (1 week in jump space regardless of distance)
- **No FTL communication** - information travels at the speed of ships
- **Diverse worlds** - from primitive societies to quantum-tech civilizations
- **Political intrigue** - the Quiru-Newhall alliance vs. the Jade Front resistance

Key locations include Mora (fallen cultural hegemon), Newhall (imperialist power), Ith (advanced starfarers), and Mowebe (diaspora traders).

## Development

```bash
# Setup instructions will be added once framework is chosen
```

## Contributing

This is a personal project for a specific tabletop campaign. The structured data and web app components may be useful as templates for other Traveller campaigns.

## License

Source materials are from the GM's custom Traveller Stephanus system. The web application code will be open source (license TBD).
