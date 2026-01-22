# Framework Choice: Svelte + SvelteKit

**Status**: Provisional (to be revisited after data structuring)
**Date**: 2026-01-21

## Decision Summary

**Svelte 5** with **SvelteKit** is the preferred frontend framework for this project.

## Rationale

### Project Requirements

| Requirement | How Svelte Addresses It |
|-------------|-------------------------|
| Forms-heavy UI (character sheets) | Two-way binding with `bind:value` - minimal boilerplate |
| localStorage persistence (MVP) | Svelte stores + simple adapter pattern |
| Export/import for device transfer | Native JSON serialization of store state |
| Searchable rules reference | Reactive statements make filter logic declarative |
| Future interactive wizard | Component model handles multi-step flows well |
| Journal system (char/session/campaign notes) | Stores scale cleanly to multiple entity types |
| Tailwind CSS | First-class support, works out of the box |

### Why Not Other Frameworks

| Framework | Reason to Pass |
|-----------|----------------|
| React | More boilerplate for forms, need to assemble multiple libraries (state, forms, routing) |
| Vue | Good option, but Svelte is simpler for this use case |
| Vanilla JS | Too much manual work for reactive forms and state |

### Developer Experience

As a senior developer, the simplicity of Svelte is a productivity feature rather than a limitation. Less ceremony means faster iteration.

## Technical Approach

### Stack

| Layer | Choice |
|-------|--------|
| Framework | SvelteKit (provides routing, project structure, build tooling) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Svelte stores (built-in) |
| Persistence | localStorage (MVP), export/import JSON |
| Data | Static JSON/YAML files for rules reference |

### Why SvelteKit (not just Svelte + Vite)

Even for an SPA, SvelteKit provides:
- File-based routing out of the box
- Sensible project structure
- Easy to add SSR/prerendering later if rules reference pages benefit from it
- API routes available if backend needs emerge
- Better defaults for production builds

### State Management Pattern

```svelte
// stores/characters.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const stored = browser ? localStorage.getItem('characters') : null;
export const characters = writable(stored ? JSON.parse(stored) : []);

// Auto-persist to localStorage
characters.subscribe((value) => {
  if (browser) {
    localStorage.setItem('characters', JSON.stringify(value));
  }
});
```

### Form Example

```svelte
<script lang="ts">
  import type { Character } from '$lib/types';

  let character: Character = {
    name: '',
    attributes: { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 },
    // ...
  };
</script>

<form on:submit|preventDefault={save}>
  <input bind:value={character.name} placeholder="Character Name" />

  <label>
    STR
    <input type="number" bind:value={character.attributes.STR} min="2" max="12" />
  </label>

  <!-- More fields... -->

  <button type="submit">Save Character</button>
</form>
```

### Searchable Reference Example

```svelte
<script lang="ts">
  import weapons from '$lib/data/weapons.json';

  let search = '';
  let maxPrice: number | null = null;

  $: filtered = weapons.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) &&
    (maxPrice === null || w.price <= maxPrice)
  );
</script>

<input bind:value={search} placeholder="Search weapons..." />
<input type="number" bind:value={maxPrice} placeholder="Max price" />

{#each filtered as weapon}
  <div>{weapon.name} - {weapon.price} Cr</div>
{/each}
```

## Project Structure (Planned)

```
/
├── src/
│   ├── lib/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── CharacterSheet.svelte
│   │   │   ├── AttributeInput.svelte
│   │   │   └── ExpertiseList.svelte
│   │   ├── stores/           # Svelte stores
│   │   │   ├── characters.ts
│   │   │   ├── journal.ts
│   │   │   └── settings.ts
│   │   ├── types/            # TypeScript interfaces
│   │   │   └── index.ts
│   │   └── data/             # Static game data (imported JSON)
│   │       ├── careers.json
│   │       ├── weapons.json
│   │       └── worlds.json
│   ├── routes/
│   │   ├── +page.svelte              # Home / character list
│   │   ├── character/
│   │   │   ├── [id]/+page.svelte     # View/edit character
│   │   │   └── new/+page.svelte      # Create character
│   │   ├── reference/
│   │   │   ├── +page.svelte          # Rules reference home
│   │   │   ├── careers/+page.svelte
│   │   │   ├── equipment/+page.svelte
│   │   │   └── worlds/+page.svelte
│   │   └── journal/
│   │       └── +page.svelte          # Journal/notes
│   └── app.html
├── static/                   # Static assets
├── data/                     # Source YAML/JSON (build-time import)
├── references/               # Original PDFs and markdown
├── svelte.config.js
├── tailwind.config.js
└── package.json
```

## MVP Scope

1. Character sheet form (all fields from charsheet.pdf)
2. Save/load to localStorage
3. Character list with select/delete
4. Export character(s) as JSON file
5. Import characters from JSON file

## Future Phases

| Phase | Features |
|-------|----------|
| 2 | Calculated fields (HP, Bloodied, age from terms) |
| 3 | Rules reference UI with search/filter |
| 4 | Character creation wizard |
| 5 | Journal system (character notes, session logs, campaign notes) |
| 6 | Consider backend/sync if needed |

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Svelte 5 is newer, some tutorials are for v4 | Official docs are excellent; syntax differences are minor |
| Smaller ecosystem than React | Core needs (forms, state, routing) are built-in |
| May need backend later | SvelteKit has API routes; can add database when needed |

## Revisit Criteria

After data structuring is complete, revisit this decision if:
- The data structure reveals complexity that would benefit from a different state management approach
- New requirements emerge that change the calculus
- Personal preference shifts after working with the data

## Resources

- [Svelte 5 Docs](https://svelte.dev/docs)
- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [Svelte + Tailwind Setup](https://tailwindcss.com/docs/guides/sveltekit)
