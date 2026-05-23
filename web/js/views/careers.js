/* =========================================================================
   Careers: index + per-career detail (qualification, skill tables,
   leadership ranks, retirement benefits).
   ========================================================================= */

'use strict';

async function viewCareersIndex() {
  let html = `<h1 class="page-title">Careers</h1><div class="card-grid">`;
  for (const c of CAREER_FILES) {
    html += `<div class="card"><h3><a href="#/careers/${c.id}">${esc(c.label)}</a></h3></div>`;
  }
  html += `</div>`;
  setView(html);
}

async function viewCareer(id) {
  const c = CAREER_FILES.find(x => x.id === id);
  if (!c) return setView(`<div class="error">Unknown career: ${esc(id)}</div>`);
  setView('<div class="loading">Loading career…</div>');
  let raw;
  try { raw = await load(`../data/careers/${id}.yaml`); }
  catch (e) { return showError(e, `../data/careers/${id}.yaml`); }

  let html = '';
  html += crumbs([{ route: '#/careers', label: 'Careers' }, { label: c.label }]);
  html += `<h1 class="page-title">${esc(raw.name || c.label)}</h1>`;
  if (raw.description) html += `<p style="color: var(--text-dim);">${esc(raw.description)}</p>`;

  if (raw.qualification) html += `<h2>Qualification</h2><div class="kv"><dt>Attribute</dt><dd>${esc(raw.qualification.attribute)}</dd><dt>Target</dt><dd>${esc(raw.qualification.target)}+</dd></div>`;
  if (raw.leadership) html += `<h2>Leadership</h2><div class="kv"><dt>Attribute</dt><dd>${esc(raw.leadership.attribute)}</dd><dt>Target</dt><dd>${esc(raw.leadership.target)}+</dd></div>`;

  if (raw.skills) {
    html += `<h2>Skill Tables</h2>`;
    for (const [tableName, table] of Object.entries(raw.skills)) {
      html += `<h3>${esc(tableName.replace(/_/g, ' '))}</h3><table><thead><tr><th>Roll</th><th>Result</th></tr></thead><tbody>`;
      for (const [k, v] of Object.entries(table)) html += `<tr><td>${esc(k)}</td><td>${esc(v)}</td></tr>`;
      html += `</tbody></table>`;
    }
  }

  if (raw.leadership_ranks) {
    html += `<h2>Leadership Ranks</h2><table><thead><tr><th>Rank</th><th>Benefit</th></tr></thead><tbody>`;
    for (const [k, v] of Object.entries(raw.leadership_ranks)) {
      html += `<tr><td>${esc(k)}</td><td>${esc(v.benefit ?? jsyaml.dump(v))}</td></tr>`;
    }
    html += `</tbody></table>`;
  }

  if (raw.retirement) {
    html += `<h2>Retirement Benefits</h2>`;
    html += `<p style="color: var(--text-dim); margin: 0 0 10px;">Roll once on each table per term completed. Cash uses 2d6 (modifiers may push the result above 12); material uses 1d6.</p>`;
    html += `<div class="retirement-grid">`;
    if (raw.retirement.cash) {
      html += `<div><h3>Cash</h3><table><thead><tr><th>2d6</th><th>Credits</th></tr></thead><tbody>`;
      for (const [k, v] of Object.entries(raw.retirement.cash)) {
        const cell = typeof v === 'number'
          ? `<span class="unit">Cr</span>${v.toLocaleString('en-US')}`
          : esc(String(v));
        html += `<tr><td class="roll">${esc(k)}</td><td class="cash">${cell}</td></tr>`;
      }
      html += `</tbody></table></div>`;
    }
    if (raw.retirement.material) {
      html += `<div><h3>Material</h3><table><thead><tr><th>1d6</th><th>Benefit</th></tr></thead><tbody>`;
      for (const [k, v] of Object.entries(raw.retirement.material)) {
        html += `<tr><td class="roll">${esc(k)}</td><td>${esc(String(v))}</td></tr>`;
      }
      html += `</tbody></table></div>`;
    }
    html += `</div>`;
  }

  // Catch-all for additional fields
  const known = new Set(['name','description','qualification','leadership','skills','leadership_ranks','retirement']);
  const extras = Object.entries(raw).filter(([k]) => !known.has(k));
  for (const [k, v] of extras) {
    html += `<h2>${esc(k.replace(/_/g, ' '))}</h2>${renderYaml(v, 1)}`;
  }

  setView(html);
}
