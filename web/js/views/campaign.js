/* =========================================================================
   Campaign views: home, sessions list/detail, investigation, timeline, NPCs
   ========================================================================= */

'use strict';

// === Home / overview ===

async function viewHome() {
  setView('<div class="loading">Loading campaign overview…</div>');
  let camp;
  try { camp = await load('../data/campaign.yaml'); }
  catch (e) { return showError(e, '../data/campaign.yaml'); }

  let html = `<h1 class="page-title">Overview</h1>
    <h2>The Death Mask</h2>
    <div class="card">
      <p>${nl2br(camp.mcguffin?.description || '')}</p>
      <div class="kv" style="margin-top: 8px;">
        <dt>Material</dt><dd>${esc(camp.mcguffin?.material || '-')}</dd>
        <dt>Note</dt><dd>${esc(camp.mcguffin?.material_note || '-')}</dd>
      </div>
    </div>
  `;

  html += `<h2>Factions</h2><div class="card-grid">`;
  for (const f of (camp.factions || [])) {
    html += `
      <div class="card">
        <h3>${esc(f.name)}</h3>
        <div class="pill-row">
          <span class="tag">${esc(f.type || 'Faction')}</span>
        </div>
        <p>${esc(f.summary || '')}</p>
        ${f.pros?.length ? `<h3 style="margin-top: 10px;">Pros</h3><ul>${f.pros.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
        ${f.cons?.length ? `<h3>Cons</h3><ul>${f.cons.map(p => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      </div>
    `;
  }
  html += `</div>`;

  setView(html);
}

// === Sessions ===

async function viewSessions() {
  setView('<div class="loading">Loading sessions…</div>');
  let sessions;
  try {
    const all = await Promise.all(SESSION_NUMBERS.map(n =>
      load(`../data/sessions/session-${pad2(n)}.yaml`).then(d => ({ n, data: d.session || d }))
        .catch(() => null)
    ));
    sessions = all.filter(Boolean).sort((a, b) => b.n - a.n);
  } catch (e) { return showError(e); }

  let html = `<h1 class="page-title">GM Session Recaps</h1>`;

  for (const s of sessions) {
    const sd = s.data;
    html += `
      <div class="card">
        <h3>
          <a href="#/sessions/${s.n}">Session ${s.n}</a>
          ${sd.date ? `<span class="tag dim" style="margin-left: 8px;">${esc(fmtDate(sd.date))}</span>` : ''}
        </h3>
        <div style="color: var(--text-dim); font-size: 0.88rem; margin-top: 6px; white-space: pre-wrap;">${esc(sd.recap || '')}</div>
        ${sd.recap ? `<div style="margin-top: 8px; font-size: 0.85rem;"><a href="#/sessions/${s.n}">Read full session →</a></div>` : ''}
      </div>
    `;
  }

  setView(html);
}

async function viewSession(num) {
  setView('<div class="loading">Loading session…</div>');
  const path = `../data/sessions/session-${pad2(num)}.yaml`;
  let raw;
  try { raw = await load(path); }
  catch (e) { return showError(e, path); }
  const s = raw.session || raw;

  let html = '';
  html += crumbs([
    { route: '#/sessions', label: 'Sessions' },
    { label: `Session ${num}` }
  ]);
  html += `<h1 class="page-title">Session ${num}${s.date ? ` <span class="tag dim" style="font-size: 0.7rem; vertical-align: middle;">${esc(fmtDate(s.date))}</span>` : ''}</h1>`;

  if (s.recap) {
    html += `<h2>Recap</h2><div class="recap-block">${esc(s.recap)}</div>`;
  }

  if (s.key_events?.length) {
    html += `<h2>Key Events</h2><ul>${s.key_events.map(e => `<li>${esc(e)}</li>`).join('')}</ul>`;
  }

  if (s.npcs_introduced?.length) {
    html += `<h2>NPCs Introduced</h2><ul>${s.npcs_introduced.map(n =>
      typeof n === 'string' ? `<li>${esc(n)}</li>`
                            : `<li><strong>${esc(n.name)}</strong>${n.role ? ` - ${esc(n.role)}` : ''}${n.notes ? `: ${esc(n.notes)}` : ''}</li>`
    ).join('')}</ul>`;
  }

  if (s.ship_events?.length) {
    html += `<h2>Ship Events</h2><ul>${s.ship_events.map(e =>
      typeof e === 'string' ? `<li>${esc(e)}</li>`
                            : `<li><strong>${esc(e.event || '')}</strong>${e.outcome ? ` - ${esc(e.outcome)}` : ''}</li>`
    ).join('')}</ul>`;
  }

  if (s.derelicts_surveyed?.length) {
    html += `<h2>Derelicts Surveyed</h2><div class="card-grid">`;
    for (const d of s.derelicts_surveyed) {
      html += `<div class="card">
        <h3>${esc(d.name)}</h3>
        <div class="pill-row">
          ${d.faction ? `<span class="tag">${esc(d.faction)}</span>` : ''}
          ${d.size_marker ? `<span class="tag dim">size ${esc(d.size_marker)}</span>` : ''}
        </div>
        ${d.notes ? `<div style="white-space: pre-wrap; font-size: 0.88rem;">${esc(d.notes)}</div>` : ''}
      </div>`;
    }
    html += `</div>`;
  }

  if (s.absent_pcs?.length) {
    html += `<h2>Absent PCs</h2><ul>${s.absent_pcs.map(n => `<li>${esc(n)}</li>`).join('')}</ul>`;
  }

  // Render any other fields generically
  const knownKeys = new Set(['number','date','recap','key_events','npcs_introduced','ship_events','derelicts_surveyed','absent_pcs']);
  const extras = Object.entries(s).filter(([k]) => !knownKeys.has(k));
  if (extras.length) {
    html += `<h2>Additional Notes</h2>`;
    for (const [k, v] of extras) {
      html += `<h3>${esc(k.replace(/_/g, ' '))}</h3><pre>${esc(jsyaml.dump(v))}</pre>`;
    }
  }

  setView(html);
}

// === Investigation ===

async function viewInvestigation() {
  setView('<div class="loading">Loading investigation…</div>');
  let inv;
  try { inv = await load('../data/investigation.yaml'); }
  catch (e) { return showError(e, '../data/investigation.yaml'); }

  let html = `<h1 class="page-title">Investigation</h1>`;

  if (inv.primary_mission) {
    const pm = inv.primary_mission;
    html += `<div class="card">
      <h3>${esc(pm.name)}<span class="tag good" style="margin-left: 8px;">${esc(pm.status || '')}</span></h3>
      <div class="kv">
        ${pm.client ? `<dt>Client</dt><dd>${esc(pm.client)}</dd>` : ''}
        ${pm.contact ? `<dt>Contact</dt><dd>${esc(pm.contact)}</dd>` : ''}
        ${pm.assigned ? `<dt>Assigned</dt><dd>${esc(pm.assigned)}</dd>` : ''}
      </div>
      ${pm.objective ? `<div style="white-space: pre-wrap;">${esc(pm.objective)}</div>` : ''}
    </div>`;
  }

  if (inv.chain_of_custody?.length) {
    html += `<h2>Chain of Custody</h2>`;
    html += `<table><thead><tr><th>Period</th><th>Event</th><th>Source</th></tr></thead><tbody>`;
    for (const c of inv.chain_of_custody) {
      html += `<tr><td>${esc(c.period || '')}</td><td>${esc(c.event || '')}</td><td>${esc(c.source || '')}</td></tr>`;
    }
    html += `</tbody></table>`;
  }

  const renderLeads = (leads, title, opts = {}) => {
    if (!leads?.length) return '';
    let body = '';
    for (const lead of leads) {
      const statusCls = lead.status === 'resolved' ? 'good'
                      : lead.status === 'stalled'  ? 'warn'
                      : lead.status === 'in_progress' ? '' : 'dim';
      const prioCls = lead.priority === 'high' ? 'bad'
                    : lead.priority === 'medium' ? 'warn' : 'dim';
      body += `<div class="card">
        <h3>${esc(lead.name)}</h3>
        <div class="pill-row">
          ${lead.priority ? `<span class="tag ${prioCls}">${esc(lead.priority)} priority</span>` : ''}
          ${lead.status ? `<span class="tag ${statusCls}">${esc(lead.status)}</span>` : ''}
          ${lead.established ? `<span class="tag dim">established ${esc(lead.established)}</span>` : ''}
          ${lead.last_update ? `<span class="tag dim">updated ${esc(lead.last_update)}</span>` : ''}
          ${lead.resolved ? `<span class="tag dim">resolved ${esc(lead.resolved)}</span>` : ''}
        </div>
        ${lead.description ? `<div style="white-space: pre-wrap; margin-bottom: 6px;">${esc(lead.description)}</div>` : ''}
        ${lead.action_required ? `<div><strong>Action:</strong> ${esc(lead.action_required)}</div>` : ''}
        ${lead.notes ? `<div style="white-space: pre-wrap; color: var(--text-dim); font-size: 0.88rem; margin-top: 6px;">${esc(lead.notes)}</div>` : ''}
      </div>`;
    }
    if (opts.collapsible) {
      const open = opts.defaultOpen ? ' open' : '';
      return `<details class="collapsible"${open}><summary><h2>${esc(title)} <span class="tag dim">${leads.length}</span></h2></summary>${body}</details>`;
    }
    return `<h2>${esc(title)}</h2>${body}`;
  };

  if (inv.current_plan) {
    html += `<h2>Current Plan</h2>`;
    const cp = inv.current_plan;
    if (cp.summary) html += `<div class="recap-block">${esc(cp.summary)}</div>`;
    const planKnown = new Set(['summary','assets','timeline']);
    const planExtras = Object.entries(cp).filter(([k]) => !planKnown.has(k));
    for (const [k, v] of planExtras) {
      html += `<h3>${esc(k.replace(/_/g, ' '))}</h3>${renderYaml(v, 1)}`;
    }
  }

  if (inv.key_intel?.length) {
    const groups = new Map();
    for (const it of inv.key_intel) {
      const cat = it.category || 'Other';
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat).push(it);
    }
    const renderCard = (it) => `<div class="card">
      <h3>${esc(it.fact || it.topic || it.name || 'Intel')}</h3>
      <div class="pill-row">
        ${it.id ? `<span class="tag">${esc(it.id)}</span>` : ''}
        ${it.source ? `<span class="tag dim">source: ${esc(it.source)}</span>` : ''}
        ${(it.factions || []).map(f => `<span class="tag">${esc(f)}</span>`).join('')}
      </div>
      ${it.details ? `<div style="white-space: pre-wrap;">${esc(it.details)}</div>` : ''}
    </div>`;
    let body = '';
    for (const [cat, items] of groups) {
      body += `<h3 class="key-intel-group">${esc(cat)} <span class="tag dim">${items.length}</span></h3>`;
      body += items.map(renderCard).join('');
    }
    html += `<details class="collapsible"><summary><h2>Key Intel <span class="tag dim">${inv.key_intel.length}</span></h2></summary>${body}</details>`;
  }

  html += renderLeads(inv.active_leads, 'Active Leads', { collapsible: true, defaultOpen: true });
  html += renderLeads(inv.resolved_leads, 'Resolved Leads', { collapsible: true });

  if (inv.dead_ends?.length) {
    let body = '';
    for (const d of inv.dead_ends) {
      body += `<div class="card">
        <h3>${esc(d.name)}</h3>
        <div class="pill-row">
          ${d.ruled_out ? `<span class="tag dim">ruled out ${esc(d.ruled_out)}</span>` : ''}
        </div>
        ${d.description ? `<div style="margin-bottom: 4px;">${esc(d.description)}</div>` : ''}
        ${d.reason ? `<div style="white-space: pre-wrap;"><strong>Why:</strong> ${esc(d.reason)}</div>` : ''}
        ${d.notes ? `<div style="white-space: pre-wrap; color: var(--text-dim); font-size: 0.88rem; margin-top: 6px;">${esc(d.notes)}</div>` : ''}
      </div>`;
    }
    html += `<details class="collapsible"><summary><h2>Dead Ends <span class="tag dim">${inv.dead_ends.length}</span></h2></summary>${body}</details>`;
  }

  if (inv.open_questions?.length) {
    const items = inv.open_questions.map(q =>
      typeof q === 'string' ? `<li>${esc(q)}</li>` : `<li><strong>${esc(q.question || q.fact || '')}</strong>${q.notes ? ` - ${esc(q.notes)}` : ''}</li>`
    ).join('');
    html += `<details class="collapsible"><summary><h2>Open Questions <span class="tag dim">${inv.open_questions.length}</span></h2></summary><ul>${items}</ul></details>`;
  }

  // Catch-all for anything else
  const known = new Set(['primary_mission','chain_of_custody','active_leads','dead_ends','resolved_leads','key_intel','open_questions','current_plan']);
  const extras = Object.entries(inv).filter(([k]) => !known.has(k));
  for (const [k, v] of extras) {
    html += `<h2>${esc(k.replace(/_/g, ' '))}</h2>${renderYaml(v, 1)}`;
  }

  setView(html);
}

// === Timeline ===

// User's current filter for the timeline view. Persists across renders
// within a session (not across reloads).
let _timelineFilter = 'both'; // 'both' | 'narrative' | 'crew'

function _weekNum(d) {
  if (typeof d === 'number') return d;
  if (d == null) return -Infinity;
  const f = parseFloat(d);
  return Number.isFinite(f) ? f : Infinity; // unparseable (e.g. "TBD") → top
}

function _fmtWeek(d) {
  if (d == null || d === '') return '';
  if (typeof d === 'number') {
    // Keep one decimal place; trim trailing ".0" so whole weeks read clean.
    return Number.isInteger(d) ? String(d) : d.toFixed(1).replace(/\.0$/, '');
  }
  return String(d);
}

async function viewTimeline() {
  setView('<div class="loading">Loading campaign timeline…</div>');

  // Pull every session yaml in parallel; tolerate missing files.
  let sessions, inv;
  try {
    const sessionLoads = SESSION_NUMBERS.map(n =>
      load(`../data/sessions/session-${pad2(n)}.yaml`)
        .then(d => ({ n, data: d.session || d }))
        .catch(() => null)
    );
    [sessions, inv] = await Promise.all([
      Promise.all(sessionLoads).then(arr => arr.filter(Boolean)),
      load('../data/investigation.yaml').catch(() => null)
    ]);
  } catch (e) {
    return showError(e);
  }

  // Flatten all events with their type and source session.
  const events = [];
  for (const { n, data } of sessions) {
    for (const ev of (data.narrative_events || [])) {
      events.push({ ...ev, type: 'narrative', session: n });
    }
    for (const ev of (data.crew_events || [])) {
      events.push({ ...ev, type: 'crew', session: n });
    }
  }

  let html = `<h1 class="page-title">Campaign Timeline</h1>`;

  // Look forward: surface the planned next steps from the strategic plan
  // (only entries that haven't happened yet) so the timeline stays useful
  // beyond the in-game "now".
  const cp = inv?.current_plan;
  if (cp?.summary) {
    html += `<div class="recap-block">${esc(cp.summary)}</div>`;
  }
  const planned = (cp?.timeline || []).filter(t => t.status === 'planned');
  if (planned.length) {
    html += `<h2 style="margin-top: 6px;">Planned next</h2>`;
    html += `<div class="card-grid">`;
    for (const p of planned) {
      html += `<div class="card">
        <h3>${esc(p.event || p.notes || 'Planned action')}</h3>
        <div class="pill-row">
          ${p.week ? `<span class="tag dim">Week ${esc(p.week)}</span>` : ''}
          ${p.location ? `<span class="tag dim">${esc(p.location)}</span>` : ''}
        </div>
        ${p.notes && p.notes !== p.event ? `<div style="white-space: pre-wrap; margin-top: 4px;">${esc(p.notes)}</div>` : ''}
      </div>`;
    }
    html += `</div>`;
  }

  if (events.length === 0) {
    html += `<p style="color: var(--text-dim); margin-top: 18px;">
      No events yet - add <code>narrative_events</code> and
      <code>crew_events</code> arrays to a session yaml.</p>`;
    return setView(html);
  }

  const narrativeCount = events.filter(e => e.type === 'narrative').length;
  const crewCount = events.filter(e => e.type === 'crew').length;

  // Sort desc by in-game week; ties keep their array order (most recent
  // sessions first because we load in increasing session order, then push).
  // Actually we loaded sessions 1..N in order, so within the same week the
  // earlier session appears first; secondary sort by session desc keeps
  // newer sessions on top for ties.
  events.sort((a, b) => {
    const dd = _weekNum(b.week) - _weekNum(a.week);
    if (dd !== 0) return dd;
    return (b.session || 0) - (a.session || 0);
  });

  // Group consecutive events sharing the same in-game week.
  const groups = [];
  let last = null;
  for (const ev of events) {
    if (!last || _weekNum(last.week) !== _weekNum(ev.week)) {
      last = { week: ev.week, session: ev.session, narrative: [], crew: [] };
      groups.push(last);
    }
    last[ev.type].push(ev);
    // If a later event for the same week comes from a higher session
    // number, prefer that one as the row's "primary" session label.
    if (ev.session > (last.session || 0)) last.session = ev.session;
  }

  // Legend + filter pills
  html += `<div class="timeline-legend" id="timeline-legend">
    <button class="filter-btn" type="button" data-filter="both" aria-pressed="${_timelineFilter === 'both'}">Both</button>
    <button class="filter-btn" type="button" data-filter="narrative" aria-pressed="${_timelineFilter === 'narrative'}"><span class="swatch narrative"></span>Narrative · ${narrativeCount}</button>
    <button class="filter-btn" type="button" data-filter="crew" aria-pressed="${_timelineFilter === 'crew'}"><span class="swatch crew"></span>Crew · ${crewCount}</button>
    <span class="timeline-count">${groups.length} week${groups.length === 1 ? '' : 's'} · ${events.length} events</span>
  </div>`;

  const rootCls = _timelineFilter === 'narrative' ? 'campaign-timeline hide-crew'
                : _timelineFilter === 'crew' ? 'campaign-timeline hide-narrative'
                : 'campaign-timeline';
  html += `<div class="${rootCls}" id="campaign-timeline">`;

  const renderCard = (ev) => {
    const sessionLink = ev.session
      ? `<a href="#/sessions/${ev.session}" title="Open Session ${ev.session} recap">S${ev.session}</a>`
      : '';
    return `<article class="timeline-card ${ev.type}">
      <div class="card-head">
        <div class="card-title">${esc(ev.title || '(untitled)')}</div>
        <div class="card-meta">${sessionLink}</div>
      </div>
      ${ev.description ? `<div class="card-body">${esc(String(ev.description).trim())}</div>` : ''}
      ${ev.location ? `<div class="card-tags"><span class="tag dim">${esc(ev.location)}</span></div>` : ''}
    </article>`;
  };

  for (const g of groups) {
    const narrHtml = g.narrative.length
      ? g.narrative.map(renderCard).join('')
      : '';
    const crewHtml = g.crew.length
      ? g.crew.map(renderCard).join('')
      : '';
    html += `<div class="timeline-row" data-week="${esc(_fmtWeek(g.week))}">
      <div class="week-marker">
        <span class="week-pill">Week ${esc(_fmtWeek(g.week))}</span>
        ${g.session ? `<span class="week-sublabel">Session ${g.session}</span>` : ''}
      </div>
      <div class="timeline-col narrative${g.narrative.length ? '' : ' empty'}">${narrHtml}</div>
      <div class="timeline-col crew${g.crew.length ? '' : ' empty'}">${crewHtml}</div>
    </div>`;
  }

  html += `</div>`;
  setView(html);

  // Wire up the filter pills - re-render in place rather than re-fetching.
  const legend = document.getElementById('timeline-legend');
  const tl = document.getElementById('campaign-timeline');
  if (legend && tl) {
    legend.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      _timelineFilter = btn.dataset.filter;
      for (const b of legend.querySelectorAll('.filter-btn')) {
        b.setAttribute('aria-pressed', String(b.dataset.filter === _timelineFilter));
      }
      tl.classList.toggle('hide-narrative', _timelineFilter === 'crew');
      tl.classList.toggle('hide-crew', _timelineFilter === 'narrative');
    });
  }
}

// === NPCs ===

let _npcsState = { search: '', affiliation: '', status: '' };

async function viewNPCs() {
  setView('<div class="loading">Loading NPCs…</div>');
  let raw;
  try { raw = await load('../data/npcs.yaml'); }
  catch (e) { return showError(e, '../data/npcs.yaml'); }
  const npcs = raw.npcs || [];

  const affiliations = Array.from(new Set(npcs.map(n => n.affiliation).filter(Boolean))).sort();
  const statuses = Array.from(new Set(npcs.map(n => n.status).filter(Boolean))).sort();

  const renderList = () => {
    const q = _npcsState.search.toLowerCase();
    const filt = npcs.filter(n => {
      if (_npcsState.affiliation && n.affiliation !== _npcsState.affiliation) return false;
      if (_npcsState.status && n.status !== _npcsState.status) return false;
      if (q) {
        const hay = [n.name, n.role, n.location, n.description, n.notes, n.affiliation].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    let h = `<div class="filter-bar"><span class="count">${filt.length} of ${npcs.length}</span></div>`;
    h += `<div class="card-grid">`;
    for (const n of filt) {
      const statusStr = (n.status || '').toLowerCase();
      const statusCls = statusStr.includes('deceased') || statusStr.includes('hostile') ? 'bad'
                      : statusStr.includes('missing') || statusStr.includes('captured') ? 'warn'
                      : statusStr.includes('allied') || statusStr === 'active' ? 'good'
                      : 'dim';
      h += `<div class="card">
        <h3>${esc(n.name)}</h3>
        <div class="pill-row">
          ${n.affiliation ? `<span class="tag">${esc(n.affiliation)}</span>` : ''}
          ${n.role ? `<span class="tag dim">${esc(n.role)}</span>` : ''}
          ${n.status ? `<span class="tag ${statusCls}">${esc(n.status)}</span>` : ''}
          ${n.location ? `<span class="tag dim">${esc(n.location)}</span>` : ''}
          ${n.first_appearance ? `<span class="tag dim">${esc(n.first_appearance)}</span>` : ''}
        </div>
        ${n.description ? `<div style="white-space: pre-wrap; font-size: 0.9rem;">${esc(n.description)}</div>` : ''}
        ${n.notes ? `<div style="white-space: pre-wrap; color: var(--text-dim); font-size: 0.85rem; margin-top: 6px;"><em>${esc(n.notes)}</em></div>` : ''}
      </div>`;
    }
    h += `</div>`;
    document.getElementById('npc-list').innerHTML = h;
  };

  setView(`
    <h1 class="page-title">NPCs</h1>
    <div class="filter-bar">
      <input type="text" id="npc-search" placeholder="Search…" value="${esc(_npcsState.search)}">
      <select id="npc-aff">
        <option value="">All affiliations</option>
        ${affiliations.map(a => `<option value="${esc(a)}"${a === _npcsState.affiliation ? ' selected' : ''}>${esc(a)}</option>`).join('')}
      </select>
      <select id="npc-status">
        <option value="">All statuses</option>
        ${statuses.map(a => `<option value="${esc(a)}"${a === _npcsState.status ? ' selected' : ''}>${esc(a)}</option>`).join('')}
      </select>
    </div>
    <div id="npc-list"></div>
  `);
  document.getElementById('npc-search').addEventListener('input', e => {
    _npcsState.search = e.target.value; renderList();
  });
  document.getElementById('npc-aff').addEventListener('change', e => {
    _npcsState.affiliation = e.target.value; renderList();
  });
  document.getElementById('npc-status').addEventListener('change', e => {
    _npcsState.status = e.target.value; renderList();
  });
  renderList();
}
