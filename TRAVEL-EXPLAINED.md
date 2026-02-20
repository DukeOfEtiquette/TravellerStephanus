# Modified Traveller RPG Rule System

## Overview

This rule system is based on the Traveller tabletop RPG with modified rules. It consists of two primary components: **hex map data** (describing interstellar systems) and **travel rules** (governing movement between hexes).

---

## The Hex Map

The map is composed of hexes, each representing an interstellar system. Hexes are connected to one another, and the distance between adjacent hexes is **1 parsec**. Distance between non-adjacent hexes is measured by the number of hexes separating them.

**Example map** (three hexes stacked vertically):

- Hex A (top)
- Hex B (middle, adjacent to A)
- Hex C (bottom, adjacent to B)

| Route | Distance |
|-------|----------|
| A to B | 1 parsec |
| B to C | 1 parsec |
| A to C | 2 parsecs |

---

## Travel Rules

Travel is governed by four components: jump drive rating, fuel type and quantity, jump distance, and travel time.

### 1. Jump Drive Rating

A ship's jump drive has a numeric rating (Jump-1, Jump-2, etc.) that indicates the maximum number of parsecs it can cover in a single jump.

- A **Jump-1** drive can travel at most 1 parsec per jump.
- A **Jump-2** drive can travel at most 2 parsecs per jump.
- A **Jump-3** drive can travel at most 3 parsecs per jump.
- A **Jump-4** drive can travel at most 4 parsecs per jump.
- A **Jump-5** drive can travel at most 5 parsecs per jump.

To travel a distance greater than the drive's rating, multiple sequential jumps are required.

### 2. Fuel

Each jump consumes **1 unit of fuel**, regardless of jump distance (within the drive's rating). Fuel comes in two forms:

**Refined Fuel**
- Acquired through purchase at high-rated starports, or through trade (handled narratively).
- Limited in supply; only what the ship carries at the start of travel is available.
- Always consumed first, before unrefined fuel.

**Unrefined Fuel**
- Acquired by skimming gas giants, which are accessible in every hex on the map.
- Assumed to always be available once refined fuel is exhausted.
- Travel using unrefined fuel is permitted and should simply be noted in planning.

**Fuel Priority Rule:** Refined fuel is consumed first. Once exhausted, unrefined fuel is used for all remaining jumps. Travel is never considered impossible due to a shortage of refined fuel alone.

### 3. Jump Distance

The number of jumps required depends on the route distance and the ship's jump drive rating:

> **Jumps required = Total parsecs / Jump drive rating** (rounded up)

### 4. Travel Time

Travel time is measured in weeks and is composed of three segments:

| Segment | Duration | Notes |
|---------|----------|-------|
| Travel within origin hex to its Jump Port | 1 week | Always required at the start |
| Time in jump space | 1 week per jump | Regardless of parsecs covered |
| Travel within destination hex to final destination | 1 week | Always required at the end |

**Key rule:** When making multiple sequential jumps, the intermediate hexes (those passed through but not the final destination) do not require the 1-week in-hex travel time. The ship jumps again immediately from the intermediate Jump Port.

---

## Worked Examples

### Example 1: Hex A to Hex B, Jump-1 Drive, 1 unit of refined fuel

| Segment | Time | Fuel |
|---------|------|------|
| Travel to Hex A Jump Port | 1 week | -- |
| Jump A to B (1 parsec) | 1 week | 1x Refined |
| Travel to destination in Hex B | 1 week | -- |
| **Total** | **3 weeks** | **1 Refined** |

### Example 2: Hex A to Hex C, Jump-1 Drive, 2 units of refined fuel

| Segment | Time | Fuel |
|---------|------|------|
| Travel to Hex A Jump Port | 1 week | -- |
| Jump A to B (1 parsec) | 1 week | 1x Refined |
| Jump B to C (1 parsec, immediate re-jump) | 1 week | 1x Refined |
| Travel to destination in Hex C | 1 week | -- |
| **Total** | **4 weeks** | **2 Refined** |

### Example 3: Hex A to Hex C, Jump-2 Drive, 2 units of refined fuel

| Segment | Time | Fuel |
|---------|------|------|
| Travel to Hex A Jump Port | 1 week | -- |
| Jump A to C (2 parsecs, single jump) | 1 week | 1x Refined |
| Travel to destination in Hex C | 1 week | -- |
| **Total** | **3 weeks** | **1 Refined** |

### Example 4: Hex A to Hex C, Jump-1 Drive, 1 unit of refined fuel

Refined fuel runs out after the first jump. Unrefined fuel covers the second.

| Segment | Time | Fuel |
|---------|------|------|
| Travel to Hex A Jump Port | 1 week | -- |
| Jump A to B (1 parsec) | 1 week | 1x Refined |
| Jump B to C (1 parsec, immediate re-jump) | 1 week | 1x Unrefined |
| Travel to destination in Hex C | 1 week | -- |
| **Total** | **4 weeks** | **1 Refined + 1 Unrefined** |

---

## Planning Summary

When calculating any route, a travel plan should note:

1. Total number of jumps required
2. Total travel time in weeks
3. Units of refined fuel consumed and on which legs
4. Units of unrefined fuel required and on which legs
