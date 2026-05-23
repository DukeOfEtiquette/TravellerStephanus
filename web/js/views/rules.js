/* =========================================================================
   Rules: index + per-file detail. Includes bespoke renderers for character
   creation and combat, plus helpers (rollTable, rollMeta, modifier grouping).
   ========================================================================= */

'use strict';

async function viewRulesIndex() {
  let html = `<h1 class="page-title">Core Rules</h1><div class="card-grid">`;
  for (const r of RULES_FILES) {
    html += `<div class="card"><h3><a href="#/rules/${r.id}">${esc(r.label)}</a></h3></div>`;
  }
  html += `</div>`;
  setView(html);
}

async function viewRule(id) {
  const r = RULES_FILES.find(x => x.id === id);
  if (!r) return setView(`<div class="error">Unknown rules file: ${esc(id)}</div>`);
  setView('<div class="loading">Loading rules…</div>');
  let raw;
  try { raw = await load(`../data/rules/${id}.yaml`); }
  catch (e) { return showError(e, `../data/rules/${id}.yaml`); }

  let html = '';
  html += crumbs([{ route: '#/rules', label: 'Rules' }, { label: r.label }]);
  html += `<h1 class="page-title">${esc(r.label)}</h1>`;

  if (id === 'skills' && raw.skills?.length) {
    // Group skills by category
    const groups = {};
    for (const s of raw.skills) {
      const cat = s.category || 'Other';
      (groups[cat] = groups[cat] || []).push(s);
    }
    for (const [cat, list] of Object.entries(groups)) {
      html += `<h2>${esc(cat)}</h2><table><thead><tr><th>Skill</th><th>Description</th><th>Bonus</th><th>Careers</th></tr></thead><tbody>`;
      for (const s of list) {
        html += `<tr>
          <td><strong>${esc(s.name)}</strong></td>
          <td>${esc(s.description || '')}</td>
          <td>${esc(s.attribute_bonus || '')}</td>
          <td>${(s.careers || []).map(c => `<span class="tag dim">${esc(c)}</span>`).join('')}</td>
        </tr>`;
      }
      html += `</tbody></table>`;
    }
  } else if (id === 'character-creation') {
    html += renderCharacterCreation(raw);
  } else if (id === 'combat') {
    html += renderCombat(raw);
  } else {
    // Generic YAML render
    html += renderYaml(raw);
  }

  setView(html);
}

// =========================================================================
// Shared rule-rendering primitives
// =========================================================================

function rollTable(results, rollLabel = 'Roll', resultLabel = 'Result') {
  if (!results || typeof results !== 'object') return '';
  let html = `<table><thead><tr><th style="width: 110px;">${esc(rollLabel)}</th><th>${esc(resultLabel)}</th></tr></thead><tbody>`;
  for (const [k, v] of Object.entries(results)) {
    html += `<tr><td><strong>${esc(k)}</strong></td><td>${esc(String(v))}</td></tr>`;
  }
  html += `</tbody></table>`;
  return html;
}

function rollMeta(obj, extraKeys = []) {
  const parts = [];
  if (obj.roll) parts.push(`<span><span style="color: var(--text-faint);">Roll</span> <code>${esc(obj.roll)}</code></span>`);
  if (obj.target) parts.push(`<span><span style="color: var(--text-faint);">Target</span> <strong>${esc(obj.target)}+</strong></span>`);
  if (obj.modifier) parts.push(`<span><span style="color: var(--text-faint);">Modifier</span> ${esc(obj.modifier)}</span>`);
  for (const k of extraKeys) {
    if (obj[k] != null) parts.push(`<span><span style="color: var(--text-faint);">${esc(titleCase(k))}</span> ${esc(String(obj[k]))}</span>`);
  }
  if (!parts.length) return '';
  return `<div style="display: flex; flex-wrap: wrap; gap: 14px; margin: 4px 0 8px; font-size: 0.88rem;">${parts.join('')}</div>`;
}

// Collapse e.g. {2:-2, 3:-1, 4:-1, 5:-1, 6:0, 7:0, 8:0} into ranges sharing the same modifier.
function groupModifiers(modifiers) {
  const sorted = Object.entries(modifiers)
    .map(([k, v]) => [Number(k), v])
    .sort((a, b) => a[0] - b[0]);
  const groups = [];
  for (const [score, mod] of sorted) {
    const last = groups[groups.length - 1];
    if (last && last.mod === mod && last.scores[last.scores.length - 1] + 1 === score) {
      last.scores.push(score);
    } else {
      groups.push({ mod, scores: [score] });
    }
  }
  return groups.map(g => ({
    range: g.scores.length === 1 ? String(g.scores[0]) : `${g.scores[0]}–${g.scores[g.scores.length - 1]}`,
    mod: g.mod
  }));
}

// Render a generic procedure section: scalars as a kv list, nested objects as
// sub-headings with the same recursive treatment. Used for career_procedure.
function renderProcedureSection(sec, depth = 0) {
  if (sec == null) return '';
  if (Array.isArray(sec)) {
    if (sec.every(x => typeof x !== 'object' || x === null)) {
      return `<ul>${sec.map(v => `<li>${esc(String(v))}</li>`).join('')}</ul>`;
    }
    return sec.map(s => `<div class="card">${renderProcedureSection(s, depth + 1)}</div>`).join('');
  }
  if (typeof sec !== 'object') return `<p>${esc(String(sec))}</p>`;

  const scalars = [];
  const nested = [];
  for (const [k, v] of Object.entries(sec)) {
    if (v !== null && typeof v === 'object') nested.push([k, v]);
    else scalars.push([k, v]);
  }
  let html = '';
  if (scalars.length) {
    html += '<div class="kv">';
    for (const [k, v] of scalars) {
      const display = v == null ? '<span style="color: var(--text-faint);">—</span>' : esc(String(v));
      html += `<dt>${esc(titleCase(k))}</dt><dd>${display}</dd>`;
    }
    html += '</div>';
  }
  for (const [k, v] of nested) {
    const tag = depth === 0 ? 'h4' : 'h4';
    html += `<${tag} style="margin: 10px 0 4px; font-size: 0.92rem; color: var(--accent);">${esc(titleCase(k))}</${tag}>`;
    html += renderProcedureSection(v, depth + 1);
  }
  return html;
}

// =========================================================================
// Character creation — bespoke renderer
// =========================================================================

function renderCharacterCreation(raw) {
  let html = '';

  // Step 1: Attributes
  if (raw.attributes) {
    const a = raw.attributes;
    html += `<details class="collapsible" open><summary><h2>Step 1 · Attributes</h2></summary>`;
    if (a.generation) html += `<p>${esc(a.generation)}</p>`;
    if (Array.isArray(a.list) && a.list.length) {
      html += `<table><thead><tr><th style="width: 70px;">Code</th><th style="width: 160px;">Name</th><th>Description</th></tr></thead><tbody>`;
      for (const it of a.list) {
        html += `<tr>
          <td><strong>${esc(it.id)}</strong></td>
          <td>${esc(it.name)}</td>
          <td>${esc(it.description || '')}</td>
        </tr>`;
      }
      html += `</tbody></table>`;
    }
    if (a.chargen_modifiers && typeof a.chargen_modifiers === 'object') {
      html += `<h3>Chargen Modifiers</h3>`;
      html += `<p style="color: var(--text-dim); font-size: 0.88rem;">Applied during character creation when an attribute is referenced (e.g. for career qualification).</p>`;
      const groups = groupModifiers(a.chargen_modifiers);
      html += `<table style="max-width: 360px;"><thead><tr><th>Score</th><th>Modifier</th></tr></thead><tbody>`;
      for (const g of groups) {
        const m = g.mod > 0 ? `+${g.mod}` : g.mod === 0 ? '0' : String(g.mod);
        const cls = g.mod > 0 ? 'good' : g.mod < 0 ? 'bad' : 'dim';
        html += `<tr><td><strong>${esc(g.range)}</strong></td><td><span class="tag ${cls}">${esc(m)}</span></td></tr>`;
      }
      html += `</tbody></table>`;
    }
    html += `</details>`;
  }

  // Step 2: Background
  if (raw.background) {
    html += `<details class="collapsible"><summary><h2>Step 2 · Background</h2></summary>`;
    for (const [key, b] of Object.entries(raw.background)) {
      html += `<h3>${esc(titleCase(key))}</h3>`;
      if (b && typeof b === 'object') {
        html += rollMeta(b);
        if (b.results && typeof b.results === 'object') {
          html += rollTable(b.results, 'Roll', 'Result');
        }
        if (b.note) html += `<p style="color: var(--text-dim); font-size: 0.9rem;"><em>${esc(b.note)}</em></p>`;
      } else {
        html += `<p>${esc(String(b))}</p>`;
      }
    }
    html += `</details>`;
  }

  // Step 3: Terms
  if (raw.terms) {
    const t = raw.terms;
    html += `<details class="collapsible"><summary><h2>Step 3 · Terms</h2></summary>`;
    if (t.total_terms) {
      html += `<h3>Total Terms</h3>`;
      html += rollMeta(t.total_terms);
      if (t.total_terms.results) html += rollTable(t.total_terms.results, 'Roll', 'Terms');
    }
    if (t.careers_per_character) {
      html += `<h3>Careers Per Character</h3>`;
      if (t.careers_per_character.method) html += `<p>${esc(t.careers_per_character.method)}</p>`;
      if (t.careers_per_character.note) html += `<p style="color: var(--text-dim); font-size: 0.9rem;"><em>${esc(t.careers_per_character.note)}</em></p>`;
    }
    if (t.term_length && typeof t.term_length === 'object') {
      html += `<h3>Term Length</h3><div class="kv">`;
      for (const [k, v] of Object.entries(t.term_length)) {
        html += `<dt>${esc(titleCase(k))}</dt><dd>${esc(String(v))} years</dd>`;
      }
      html += `</div>`;
    }
    html += `</details>`;
  }

  // Step 4: Career Procedure
  if (raw.career_procedure) {
    html += `<details class="collapsible"><summary><h2>Step 4 · Career Procedure</h2></summary>`;
    for (const [key, sec] of Object.entries(raw.career_procedure)) {
      html += `<h3>${esc(titleCase(key))}</h3>`;
      html += renderProcedureSection(sec);
    }
    html += `</details>`;
  }

  // Step 5: Additional Careers
  if (raw.additional_careers) {
    html += `<details class="collapsible"><summary><h2>Step 5 · Additional Careers</h2></summary>`;
    if (raw.additional_careers.note) {
      html += `<p>${esc(raw.additional_careers.note)}</p>`;
    } else {
      html += renderProcedureSection(raw.additional_careers);
    }
    html += `</details>`;
  }

  // Step 6: Age & Aging
  if (raw.age) {
    html += `<details class="collapsible"><summary><h2>Step 6 · Age &amp; Aging</h2></summary>`;
    if (raw.age.calculation) {
      html += `<div class="kv"><dt>Starting Age</dt><dd>${esc(raw.age.calculation)}</dd></div>`;
    }
    if (raw.age.aging) {
      const ag = raw.age.aging;
      html += `<h3>Aging</h3>`;
      html += rollMeta(ag, ['trigger', 'per']);
      if (ag.results) html += rollTable(ag.results, 'Roll', 'Effect');
    }
    html += `</details>`;
  }

  // Step 7: Hit Protection
  if (raw.hit_protection) {
    html += `<details class="collapsible"><summary><h2>Step 7 · Hit Protection</h2></summary><div class="kv">`;
    for (const [k, v] of Object.entries(raw.hit_protection)) {
      html += `<dt>${esc(titleCase(k))}</dt><dd>${esc(String(v))}</dd>`;
    }
    html += `</div></details>`;
  }

  // Step 8: Equipment
  if (raw.equipment) {
    const eq = raw.equipment;
    html += `<details class="collapsible"><summary><h2>Step 8 · Equipment</h2></summary>`;
    if (eq.material_benefits && typeof eq.material_benefits === 'object') {
      html += `<h3>Material Benefits</h3><div class="kv">`;
      for (const [k, v] of Object.entries(eq.material_benefits)) {
        html += `<dt>${esc(titleCase(k))}</dt><dd>${esc(String(v))}</dd>`;
      }
      html += `</div>`;
    }
    if (eq.personal_vehicles && typeof eq.personal_vehicles === 'object') {
      html += `<h3>Personal Vehicles</h3>`;
      for (const [k, list] of Object.entries(eq.personal_vehicles)) {
        html += `<div style="margin: 6px 0 10px;"><div style="color: var(--text-faint); font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;">${esc(titleCase(k))}</div>`;
        if (Array.isArray(list)) {
          html += `<ul style="margin-bottom: 0;">${list.map(v => `<li>${esc(String(v))}</li>`).join('')}</ul>`;
        } else {
          html += renderProcedureSection(list);
        }
        html += `</div>`;
      }
    }
    if (eq.sabbatical && typeof eq.sabbatical === 'object') {
      html += `<h3>Sabbatical</h3><div class="kv">`;
      for (const [k, v] of Object.entries(eq.sabbatical)) {
        const display = (k === 'cost' && typeof v === 'number') ? `${v.toLocaleString()} Cr` : String(v);
        html += `<dt>${esc(titleCase(k))}</dt><dd>${esc(display)}</dd>`;
      }
      html += `</div>`;
    }
    html += `</details>`;
  }

  // Catch-all for any unexpected top-level keys
  const known = new Set(['attributes','background','terms','career_procedure','additional_careers','age','hit_protection','equipment']);
  const extras = Object.entries(raw).filter(([k]) => !known.has(k));
  for (const [k, v] of extras) {
    html += `<h2>${esc(titleCase(k))}</h2>${renderYaml(v, 1)}`;
  }

  return html;
}

// =========================================================================
// Combat rules — bespoke renderer (the YAML is too structured for renderYaml)
// =========================================================================

function combatKey(k) {
  let s = String(k).replace(/_plus$/i, '+').replace(/_/g, ' ');
  s = s.replace(/\b[a-z]/g, c => c.toUpperCase());
  s = s.replace(/\b(Str|Dex|End|Int|Edu|Soc|Hp|Npc|Pc|Gm)\b/g, m => m.toUpperCase());
  return s;
}

function formatMod(v) {
  if (typeof v === 'number') {
    const cls = v > 0 ? 'good' : v < 0 ? 'bad' : 'dim';
    const txt = v > 0 ? `+${v}` : String(v);
    return `<span class="tag ${cls}">${esc(txt)}</span>`;
  }
  if (typeof v === 'string' && /^[+-]/.test(v)) {
    const cls = v.startsWith('+') ? 'good' : 'bad';
    return `<span class="tag ${cls}">${esc(v)}</span>`;
  }
  return esc(String(v));
}

// Render an object whose scalar leaves are modifiers; nested objects become sub-headings.
function renderModifierGroup(obj, headingLevel = 4) {
  if (obj == null || typeof obj !== 'object') return '';
  const scalars = [];
  const nested = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v != null && typeof v === 'object' && !Array.isArray(v)) nested.push([k, v]);
    else scalars.push([k, v]);
  }

  let html = '';
  if (scalars.length) {
    html += `<table><thead><tr><th>Condition</th><th style="width: 220px;">Effect</th></tr></thead><tbody>`;
    for (const [k, v] of scalars) {
      const eff = Array.isArray(v) ? v.map(x => esc(String(x))).join('<br>') : formatMod(v);
      html += `<tr><td><strong>${esc(combatKey(k))}</strong></td><td>${eff}</td></tr>`;
    }
    html += `</tbody></table>`;
  }

  const tag = `h${Math.min(headingLevel, 6)}`;
  for (const [k, v] of nested) {
    html += `<${tag} style="margin: 14px 0 4px; font-size: 0.92rem; color: var(--accent);">${esc(combatKey(k))}</${tag}>`;
    html += renderModifierGroup(v, headingLevel + 1);
  }
  return html;
}

function renderCombat(raw) {
  const basics = raw.basics;
  const hp = raw.hit_protection;
  const ap = raw.attack_procedure;
  const am = raw.attack_modifiers;
  const dam = raw.damage;
  const armor = raw.armor;
  const healing = raw.healing;

  let html = '';

  // Quick-reference cards: round structure + hit protection
  if (basics || hp) {
    html += `<div class="card-grid" style="margin-bottom: 18px;">`;
    if (basics) {
      html += `<div class="card"><h3>Round Structure</h3><div class="kv">`;
      if (basics.surprise) html += `<dt>Surprise</dt><dd>${esc(basics.surprise)}</dd>`;
      if (basics.action) html += `<dt>Action</dt><dd>${esc(basics.action)}</dd>`;
      if (basics.timing) html += `<dt>Timing</dt><dd>${esc(basics.timing)}</dd>`;
      if (basics.actions_per_round != null) html += `<dt>Actions / round</dt><dd>${esc(String(basics.actions_per_round))}</dd>`;
      html += `</div>`;
      if (Array.isArray(basics.action_types) && basics.action_types.length) {
        html += `<div style="margin-top: 6px;">`;
        for (const a of basics.action_types) html += `<span class="tag">${esc(a)}</span>`;
        html += `</div>`;
      }
      html += `</div>`;
    }
    if (hp) {
      html += `<div class="card"><h3>Hit Protection</h3><div class="kv">`;
      if (hp.total) html += `<dt>Total HP</dt><dd><code>${esc(hp.total)}</code></dd>`;
      if (hp.bloodied) html += `<dt>Bloodied</dt><dd>${esc(hp.bloodied)}</dd>`;
      if (hp.dying) html += `<dt>Dying</dt><dd style="color: var(--text-dim); font-size: 0.85rem;">${esc(hp.dying)}</dd>`;
      html += `</div></div>`;
    }
    html += `</div>`;
  }

  // Attack procedure (open by default — most-used reference)
  if (ap) {
    html += `<details class="collapsible" open><summary><h2>Attack Procedure</h2></summary>`;
    html += `<div class="kv">`;
    if (ap.roll) html += `<dt>Roll</dt><dd><code>${esc(ap.roll)}</code></dd>`;
    if (ap.target != null) html += `<dt>Target</dt><dd><strong>${esc(String(ap.target))}</strong></dd>`;
    if (ap.modifiers) html += `<dt>Modifiers</dt><dd>${esc(ap.modifiers)}</dd>`;
    if (ap.on_success) html += `<dt>On Success</dt><dd>${esc(ap.on_success)}</dd>`;
    if (ap.armor) html += `<dt>Armor</dt><dd>${esc(ap.armor)}</dd>`;
    html += `</div>`;
    if (ap.bloodied_save) {
      const bs = ap.bloodied_save;
      html += `<h3>Bloodied Save</h3><div class="kv">`;
      if (bs.trigger) html += `<dt>Trigger</dt><dd>${esc(bs.trigger)}</dd>`;
      if (bs.target != null) html += `<dt>Target</dt><dd><strong>${esc(String(bs.target))}</strong></dd>`;
      html += `</div>`;
      if (Array.isArray(bs.modifiers) && bs.modifiers.length) {
        html += `<ul>${bs.modifiers.map(m => `<li>${esc(m)}</li>`).join('')}</ul>`;
      }
    }
    html += `</details>`;
  }

  // Attack modifiers (collapsed)
  if (am) {
    html += `<details class="collapsible"><summary><h2>Attack Modifiers</h2></summary>`;
    for (const [section, body] of Object.entries(am)) {
      html += `<h3>${esc(combatKey(section))}</h3>`;
      html += renderModifierGroup(body, 4);
    }
    html += `</details>`;
  }

  // Damage
  if (dam) {
    html += `<details class="collapsible"><summary><h2>Damage</h2></summary>`;

    if (dam.weapon_damage) {
      html += `<h3>Weapon Damage</h3>`;
      html += `<table><thead><tr><th style="width: 90px;">Dice</th><th>Weapons</th></tr></thead><tbody>`;
      for (const [dice, list] of Object.entries(dam.weapon_damage)) {
        if (Array.isArray(list)) {
          const tags = list.map(w => `<span class="tag dim">${esc(w)}</span>`).join('');
          html += `<tr><td><code>${esc(dice)}</code></td><td>${tags}</td></tr>`;
        } else if (list && typeof list === 'object') {
          const types = Array.isArray(list.types) ? list.types.map(t => `<span class="tag">${esc(t)}</span>`).join('') : '';
          const note = list.note ? `<div style="color: var(--text-dim); font-size: 0.85rem; margin-bottom: 4px;">${esc(list.note)}</div>` : '';
          html += `<tr><td><code>${esc(dice)}</code></td><td>${note}${types}</td></tr>`;
        } else {
          html += `<tr><td><code>${esc(dice)}</code></td><td>${esc(String(list))}</td></tr>`;
        }
      }
      html += `</tbody></table>`;
    }

    if (dam.blast_damage) {
      html += `<h3>Blast Damage</h3>`;
      html += `<table><thead><tr><th>Source</th><th style="width: 110px;">Close</th><th style="width: 110px;">Far</th></tr></thead><tbody>`;
      for (const [src, vals] of Object.entries(dam.blast_damage)) {
        const close = vals?.close ?? '';
        const far = vals?.far ?? '';
        html += `<tr><td><strong>${esc(combatKey(src))}</strong></td><td><code>${esc(String(close))}</code></td><td><code>${esc(String(far))}</code></td></tr>`;
      }
      html += `</tbody></table>`;
    }

    if (dam.damage_modifiers) {
      html += `<h3>Damage Modifiers</h3>`;
      html += renderModifierGroup(dam.damage_modifiers, 4);
    }

    html += `</details>`;
  }

  // Armor
  if (armor && armor.types) {
    html += `<details class="collapsible"><summary><h2>Armor</h2></summary>`;
    html += `<table><thead><tr><th>Type</th><th style="width: 80px;">Value</th><th>Situational</th><th>Notes</th></tr></thead><tbody>`;
    for (const [type, info] of Object.entries(armor.types)) {
      const sit = info && info.situational
        ? Object.entries(info.situational).map(([k, v]) => `<span class="tag">${esc(combatKey(k))} <strong>${esc(String(v))}</strong></span>`).join(' ')
        : '';
      html += `<tr>
        <td><strong>${esc(combatKey(type))}</strong></td>
        <td>${esc(String(info?.value ?? ''))}</td>
        <td>${sit}</td>
        <td style="color: var(--text-dim); font-size: 0.85rem;">${esc(info?.note || '')}</td>
      </tr>`;
    }
    html += `</tbody></table>`;
    html += `</details>`;
  }

  // Healing
  if (healing) {
    html += `<details class="collapsible"><summary><h2>Healing</h2></summary>`;
    html += `<table><thead><tr><th>Status</th><th>Rate</th><th>Notes</th></tr></thead><tbody>`;
    for (const [status, info] of Object.entries(healing)) {
      const notes = [info?.note, info?.requirement].filter(Boolean).join(' ');
      html += `<tr>
        <td><strong>${esc(combatKey(status))}</strong></td>
        <td>${esc(info?.rate || '')}</td>
        <td style="color: var(--text-dim); font-size: 0.85rem;">${esc(notes)}</td>
      </tr>`;
    }
    html += `</tbody></table>`;
    html += `</details>`;
  }

  // Catch-all for any unanticipated top-level keys
  const known = new Set(['basics','hit_protection','attack_procedure','attack_modifiers','damage','armor','healing']);
  for (const [k, v] of Object.entries(raw)) {
    if (known.has(k)) continue;
    html += `<details class="collapsible"><summary><h2>${esc(combatKey(k))}</h2></summary>${renderYaml(v, 1)}</details>`;
  }

  return html;
}
