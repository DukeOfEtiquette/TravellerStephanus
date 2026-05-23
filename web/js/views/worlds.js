/* =========================================================================
   Worlds index + per-world detail. Includes UWP code → English lookups.
   ========================================================================= */

'use strict';

const UWP_DESCRIPTIONS = {
  starport: { A: 'Excellent', B: 'Good', C: 'Routine', D: 'Poor', X: 'None' },
  size: {
    '0': 'Asteroid', '1': 'Tiny', '2': 'Small', '3': 'Small',
    '4': 'Mid-sized', '5': 'Mid-sized', '6': 'Mid-sized',
    '7': 'Earth-sized', '8': 'Earth-sized',
    '9': 'Large', A: 'Large', B: 'Very large'
  },
  atmosphere: {
    '0': 'None', '1': 'Trace', '2': 'Very thin, tainted', '3': 'Very thin',
    '4': 'Thin, tainted', '5': 'Thin', '6': 'Standard', '7': 'Standard, tainted',
    '8': 'Dense', '9': 'Dense, tainted', A: 'Exotic', B: 'Corrosive', C: 'Insidious'
  },
  population: {
    '0': 'Uninhabited', '1': 'Tens', '2': 'Hundreds', '3': 'Thousands',
    '4': 'Tens of thousands', '5': 'Hundreds of thousands', '6': 'Millions',
    '7': 'Tens of millions', '8': 'Hundreds of millions', '9': 'Billions',
    A: 'Tens of billions', B: 'Hundreds of billions', C: 'Trillions'
  },
  law_level: {
    '0': 'No law', '1': 'Permissive', '2': 'Permissive', '3': 'Low',
    '4': 'Moderate', '5': 'Moderate', '6': 'Moderate', '7': 'Contemporary',
    '8': 'Strict', '9': 'Strict', A: 'Very restrictive',
    B: 'Very restrictive', C: 'Extremely restrictive'
  },
  tech_level: { P: 'Primitive', I: 'Industrial', A: 'Atomic', Q: 'Quantum' }
};

function uwpDesc(field, value) {
  if (value == null) return '';
  const key = String(value).toUpperCase();
  const desc = UWP_DESCRIPTIONS[field]?.[key];
  return desc ? ` <span style="color: var(--text-dim); font-weight: normal;">(${desc})</span>` : '';
}

function hydroPct(value) {
  if (value == null) return '';
  const key = String(value).toUpperCase();
  const map = { '0': '0%', '1': '10%', '2': '20%', '3': '30%', '4': '40%',
    '5': '50%', '6': '60%', '7': '70%', '8': '80%', '9': '90%', A: '100%' };
  const pct = map[key];
  return pct ? ` <span style="color: var(--text-dim); font-weight: normal;">(${pct})</span>` : '';
}

async function viewWorlds() {
  setView('<div class="loading">Loading worlds…</div>');
  let raw, graph;
  try {
    [raw, graph] = await Promise.all([
      load('../data/worlds/systems.yaml'),
      load('../data/worlds/sector-graph.json', 'json').catch(() => null)
    ]);
  } catch (e) { return showError(e); }
  const systems = raw.systems || [];

  // Find hex id per system from graph
  const hexById = {};
  if (graph?.hexes) {
    for (const h of graph.hexes) if (h.system) hexById[h.system] = h;
  }

  let html = `<h1 class="page-title">Worlds</h1>`;
  html += `<p style="color: var(--text-dim); margin-bottom: 12px;">${systems.length} inhabited systems. <a href="travel.html">Open the travel calculator</a></p>`;

  html += `<div class="card-grid">`;
  for (const s of systems) {
    const sp = s.starport || '?';
    const hex = hexById[s.name];
    html += `<div class="card">
      <h3>
        <a href="#/worlds/${encodeURIComponent(slugify(s.name))}">${esc(s.name)}</a>
        ${hex ? `<span class="tag dim" style="margin-left: 6px;">hex ${esc(hex.id)}</span>` : ''}
      </h3>
      <div class="pill-row">
        <span class="tag starport-${esc(sp)}">Starport ${esc(sp)}</span>
        ${s.uwp ? `<span class="tag dim">${esc(s.uwp)}</span>` : ''}
        ${s.tech_level ? `<span class="tag">TL ${esc(s.tech_level)}</span>` : ''}
        ${s.law_level ? `<span class="tag">Law ${esc(s.law_level)}</span>` : ''}
      </div>
      <div style="font-size: 0.88rem; color: var(--text-dim); white-space: pre-wrap;">${esc(truncate(s.description || '', 240))}</div>
      ${s.description ? `<div style="margin-top: 8px; font-size: 0.85rem;"><a href="#/worlds/${encodeURIComponent(slugify(s.name))}">Read full details →</a></div>` : ''}
    </div>`;
  }
  html += `</div>`;
  setView(html);
}

async function viewWorld(slug) {
  setView('<div class="loading">Loading world…</div>');
  let raw, graph;
  try {
    [raw, graph] = await Promise.all([
      load('../data/worlds/systems.yaml'),
      load('../data/worlds/sector-graph.json', 'json').catch(() => null)
    ]);
  } catch (e) { return showError(e); }
  const sys = (raw.systems || []).find(x => slugify(x.name) === slug);
  if (!sys) return setView(`<div class="error">Unknown world: ${esc(slug)}</div>`);

  let hex = null;
  if (graph?.hexes) hex = graph.hexes.find(h => h.system === sys.name);

  let html = '';
  html += crumbs([{ route: '#/worlds', label: 'Worlds' }, { label: sys.name }]);
  html += `<h1 class="page-title">${esc(sys.name)}</h1>`;
  html += `<div class="pill-row">
    <span class="tag starport-${esc(sys.starport)}">Starport ${esc(sys.starport)}</span>
    ${sys.uwp ? `<span class="tag dim">${esc(sys.uwp)}</span>` : ''}
    ${hex ? `<span class="tag">hex ${esc(hex.id)}</span>` : ''}
  </div>`;
  html += `<div class="kv">
    ${sys.starport != null ? `<dt>Starport</dt><dd>${esc(sys.starport)}${uwpDesc('starport', sys.starport)}</dd>` : ''}
    ${sys.size != null ? `<dt>Size</dt><dd>${esc(sys.size)}${uwpDesc('size', sys.size)}</dd>` : ''}
    ${sys.atmosphere != null ? `<dt>Atmosphere</dt><dd>${esc(sys.atmosphere)}${uwpDesc('atmosphere', sys.atmosphere)}</dd>` : ''}
    ${sys.hydrosphere != null ? `<dt>Hydrosphere</dt><dd>${esc(sys.hydrosphere)}${hydroPct(sys.hydrosphere)}</dd>` : ''}
    ${sys.population != null ? `<dt>Population</dt><dd>${esc(sys.population)}${uwpDesc('population', sys.population)}</dd>` : ''}
    ${sys.law_level != null ? `<dt>Law Level</dt><dd>${esc(sys.law_level)}${uwpDesc('law_level', sys.law_level)}</dd>` : ''}
    ${sys.tech_level != null ? `<dt>Tech Level</dt><dd>${esc(sys.tech_level)}${uwpDesc('tech_level', sys.tech_level)}</dd>` : ''}
  </div>`;
  if (sys.description) {
    html += `<h2>Overview</h2><div class="recap-block">${esc(sys.description)}</div>`;
  }
  // Render any extra fields
  const known = new Set(['name','uwp','starport','size','atmosphere','hydrosphere','population','law_level','tech_level','description']);
  const extras = Object.entries(sys).filter(([k]) => !known.has(k));
  for (const [k, v] of extras) {
    html += `<h2>${esc(k.replace(/_/g, ' '))}</h2>`;
    if (typeof v === 'string') html += `<div style="white-space: pre-wrap;">${esc(v)}</div>`;
    else html += `<pre>${esc(jsyaml.dump(v))}</pre>`;
  }
  setView(html);
}
