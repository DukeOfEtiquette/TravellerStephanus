/* =========================================================================
   Party views: party members, shared assets, ships
   ========================================================================= */

'use strict';

async function viewParty() {
  setView('<div class="loading">Loading party…</div>');
  let raw;
  try { raw = await load('../data/party.yaml'); }
  catch (e) { return showError(e, '../data/party.yaml'); }

  const members = raw.party_members || [];
  const active   = members.filter(m => m.status !== 'DECEASED');
  const deceased = members.filter(m => m.status === 'DECEASED');

  const renderCard = (m) => {
    const dead = m.status === 'DECEASED';
    return `<div class="card">
      <h3>${esc(m.name)}${dead ? ` <span class="tag bad">DECEASED${m.died ? ` — ${esc(m.died)}` : ''}</span>` : ''}</h3>
      <div class="pill-row">
        ${m.upp ? `<span class="tag dim">UPP ${esc(m.upp)}</span>` : ''}
        ${m.age ? `<span class="tag dim">age ${esc(m.age)}</span>` : ''}
        ${m.player ? `<span class="tag">${esc(m.player)}</span>` : ''}
      </div>
      ${m.background ? `<div class="kv">
        ${m.background.homeworld ? `<dt>Homeworld</dt><dd>${esc(m.background.homeworld)}</dd>` : ''}
        ${m.background.schooling ? `<dt>Schooling</dt><dd>${esc(m.background.schooling)}</dd>` : ''}
      </div>` : ''}
      ${m.careers?.length ? `<h3 style="margin-top: 8px;">Careers</h3><ul>${m.careers.map(c => `<li>${esc(c.name)}${c.terms != null ? ` — ${esc(c.terms)} terms` : ''}${c.rank != null ? `, rank ${esc(c.rank)}` : ''}</li>`).join('')}</ul>` : ''}
      ${m.skills?.length ? `<h3>Skills</h3><div>${m.skills.map(s => `<span class="tag">${esc(s)}</span>`).join('')}</div>` : ''}
      ${m.notes ? `<div style="margin-top: 8px; white-space: pre-wrap; color: var(--text-dim); font-size: 0.88rem;">${esc(m.notes)}</div>` : ''}
    </div>`;
  };

  let html = `<h1 class="page-title">Party Members</h1>`;
  html += `<p style="color: var(--text-dim); margin-bottom: 12px;">PCs in the group.</p>`;

  html += `<div class="card-grid">${active.map(renderCard).join('')}</div>`;

  if (deceased.length) {
    html += `<h2 style="margin-top: 24px;">Deceased</h2>`;
    html += `<div class="card-grid">${deceased.map(renderCard).join('')}</div>`;
  }

  setView(html);
}

async function viewAssets() {
  setView('<div class="loading">Loading assets…</div>');
  let raw;
  try { raw = await load('../data/assets.yaml'); }
  catch (e) { return showError(e, '../data/assets.yaml'); }

  let html = `<h1 class="page-title">Assets</h1>`;

  if (raw.party_kitty) {
    const k = raw.party_kitty;
    let notesBody = '';
    if (k.notes) {
      const lines = k.notes.replace(/\s+$/, '').split('\n');
      let lastSessionIdx = -1;
      for (let i = lines.length - 1; i >= 0; i--) {
        if (/^Session \d+:/.test(lines[i])) {
          lastSessionIdx = i;
          break;
        }
      }
      if (lastSessionIdx > 0) {
        const earlier = lines.slice(0, lastSessionIdx).join('\n');
        const latest = lines.slice(lastSessionIdx).join('\n');
        notesBody = `<div style="white-space: pre-wrap; font-size: 0.88rem; color: var(--text-dim);">${esc(latest)}</div>
        <details style="margin-top: 8px;">
          <summary style="cursor: pointer; font-size: 0.85rem; color: var(--accent); list-style: none;">Show earlier history →</summary>
          <div style="white-space: pre-wrap; font-size: 0.88rem; color: var(--text-dim); margin-top: 8px;">${esc(earlier)}</div>
        </details>`;
      } else {
        notesBody = `<div style="white-space: pre-wrap; font-size: 0.88rem; color: var(--text-dim);">${esc(k.notes)}</div>`;
      }
    }
    html += `<div class="card">
      <h3>Party Kitty</h3>
      <div class="pill-row">
        <span class="tag">${esc((k.balance || 0).toLocaleString())} Cr</span>
        ${k.last_updated ? `<span class="tag dim">as of ${esc(k.last_updated)}</span>` : ''}
      </div>
      ${notesBody}
    </div>`;
  }

  if (raw.shared_equipment?.length) {
    html += `<h2>Shared Equipment</h2><table><thead><tr><th>Item</th><th>Qty</th><th>Location</th><th>Notes</th></tr></thead><tbody>`;
    for (const e of raw.shared_equipment) {
      html += `<tr><td>${esc(e.name)}</td><td>${esc(e.quantity ?? '')}</td><td>${esc(e.location || '')}</td><td>${esc(e.notes || '')}</td></tr>`;
    }
    html += `</tbody></table>`;
  }

  if (raw.recovered_data?.length) {
    html += `<h2>Recovered Intelligence / Data</h2>`;
    for (const r of raw.recovered_data) {
      html += `<div class="card">
        <h3>${esc(r.source || 'Unknown source')}</h3>
        <ul>${(r.items || []).map(it => `<li><strong>${esc(it.description || '')}</strong> <span class="tag ${it.status === 'decoded' ? 'good' : it.status === 'pending' ? 'warn' : 'dim'}">${esc(it.status || '')}</span>${it.notes ? `<br><span style="color: var(--text-dim); font-size: 0.88rem;">${esc(it.notes)}</span>` : ''}</li>`).join('')}</ul>
      </div>`;
    }
  }

  setView(html);
}

async function viewShips() {
  setView('<div class="loading">Loading ships…</div>');
  let raw;
  try { raw = await load('../data/assets.yaml'); }
  catch (e) { return showError(e, '../data/assets.yaml'); }

  let html = `<h1 class="page-title">Ships</h1>`;

  if (raw.ships?.length) {
    for (const ship of raw.ships) {
      const cargoList = Array.isArray(ship.cargo) ? ship.cargo : (ship.cargo?.manifest || []);
      const cargoUsed = cargoList.reduce((s, c) => s + (Number(c.tons) || 0), 0);
      const cargoCap  = Number(ship.frame?.cargo_capacity) || 0;
      const cargoOver = cargoCap > 0 && cargoUsed > cargoCap;

      const hangerList = ship.hanger || [];
      const hangerUsed = hangerList.reduce((s, v) => s + (Number(v.tons) || 0), 0);
      const hangerCap  = Number(ship.frame?.hanger_capacity) || 0;
      const hangerOver = hangerCap > 0 && hangerUsed > hangerCap;

      const fmtCap = (used, cap, over) => {
        if (!cap) return '';
        const cls = over ? 'bad' : (used >= cap * 0.9 ? 'warn' : 'good');
        const usedStr = (used % 1 === 0) ? used : used.toFixed(1);
        return `<span class="tag ${cls}">${usedStr} / ${cap} t</span>`;
      };

      // A bay (cargo or hangar) renders a loose-cargo table + a vessel card grid.
      // Items keyed by `item:` are loose; items keyed by `name:` are vessels.
      const renderBay = (label, list, cap) => {
        if (!list.length && !cap) return '';
        const loose   = list.filter(c => c.item);
        const vessels = list.filter(c => c.name);
        const used = list.reduce((s, c) => s + (Number(c.tons) || 0), 0);
        const over = cap > 0 && used > cap;

        let h = `<h3>${esc(label)} ${fmtCap(used, cap, over)}</h3>`;

        h += `<table><thead><tr><th>Item</th><th>Qty</th><th>Tons</th><th>Source</th><th>Notes</th></tr></thead><tbody>`;
        if (loose.length) {
          h += loose.map(c => `<tr><td>${esc(c.item)}${c.value != null ? ` <span class="tag dim">${esc(Number(c.value).toLocaleString())} Cr</span>` : ''}</td><td>${esc(c.count ?? c.quantity ?? '')}</td><td>${esc(c.tons ?? '')}</td><td>${esc(c.source || '')}</td><td style="white-space: pre-wrap;">${esc(c.notes || '')}</td></tr>`).join('');
        } else {
          h += `<tr><td colspan="5" style="color: var(--text-dim); text-align: center; font-style: italic;">no loose cargo</td></tr>`;
        }
        h += `</tbody></table>`;

        if (vessels.length) {
          h += `<div class="card-grid" style="margin-top: 12px;">`;
          h += vessels.map(v => `
            <div class="card" style="background: var(--bg-1);">
              <h3>${esc(v.name)}</h3>
              <div class="pill-row">
                ${v.owner ? `<span class="tag">${esc(v.owner)}</span>` : ''}
                ${v.tons ? `<span class="tag dim">${esc(v.tons)} t</span>` : ''}
                ${v.cargo_capacity ? `<span class="tag dim">${esc(v.cargo_capacity)} t cargo</span>` : ''}
                ${v.source ? `<span class="tag dim">${esc(v.source)}</span>` : ''}
              </div>
              ${v.current_cargo?.length
                ? `<ul style="margin: 0;">${v.current_cargo.map(c => `<li>${esc(c.item)}${c.count ? ` ×${esc(c.count)}` : ''}${c.tons ? ` (${esc(c.tons)} t${c.count ? ` each` : ''})` : ''}${c.notes ? ` — ${esc(c.notes)}` : ''}</li>`).join('')}</ul>`
                : '<div style="color: var(--text-dim); font-size: 0.85rem;">empty</div>'}
              ${v.notes ? `<div style="margin-top: 6px; white-space: pre-wrap; font-size: 0.85rem; color: var(--text-dim);">${esc(v.notes)}</div>` : ''}
            </div>
          `).join('');
          h += `</div>`;
        }

        return h;
      };

      html += `<div class="card">
        <h3>${esc(ship.name)}</h3>
        <div class="pill-row">
          ${ship.type ? `<span class="tag">${esc(ship.type)}</span>` : ''}
          ${ship.status ? `<span class="tag ${ship.status === 'operational' ? 'good' : 'warn'}">${esc(ship.status)}</span>` : ''}
          ${ship.owner ? `<span class="tag dim">owner: ${esc(ship.owner)}</span>` : ''}
          ${ship.acquired ? `<span class="tag dim">${esc(ship.acquired)}</span>` : ''}
        </div>
        ${ship.notes ? `<div style="white-space: pre-wrap; font-size: 0.88rem; margin-bottom: 10px;">${esc(ship.notes)}</div>` : ''}

        ${ship.frame ? `<h3>Frame</h3><div class="kv">
          ${ship.frame.tonnage ? `<dt>Tonnage</dt><dd>${esc(ship.frame.tonnage)}</dd>` : ''}
          ${ship.frame.hull_hp ? `<dt>Hull HP</dt><dd>${esc(ship.frame.hull_current ?? ship.frame.hull_hp)} / ${esc(ship.frame.hull_hp)}</dd>` : ''}
          ${cargoCap ? `<dt>Cargo</dt><dd>${cargoUsed} / ${cargoCap} t</dd>` : ''}
          ${hangerCap ? `<dt>Hanger</dt><dd>${hangerUsed || '—'} / ${hangerCap} t</dd>` : ''}
        </div>` : ''}

        ${ship.systems ? `<h3>Systems</h3><pre>${esc(jsyaml.dump(ship.systems))}</pre>` : ''}
        ${ship.amenities ? `<h3>Amenities</h3><pre>${esc(jsyaml.dump(ship.amenities))}</pre>` : ''}
        ${ship.passengers?.length ? `<h3>Passengers</h3><ul>${ship.passengers.map(p => `<li><strong>${esc(p.name)}</strong>${p.role ? ` (${esc(p.role)})` : ''}${p.boarded ? ` — boarded ${esc(p.boarded)}` : ''}${p.notes ? `: ${esc(p.notes)}` : ''}</li>`).join('')}</ul>` : ''}

        ${renderBay('Cargo Bay', cargoList, cargoCap)}

        ${renderBay('Hanger', hangerList, hangerCap)}

        ${ship.damage_log?.length ? `<h3>Damage Log</h3><ul>${ship.damage_log.map(d => `<li>Session ${esc(d.session)}: ${esc(d.damage)}${d.repaired ? ` <span class="tag good">repaired</span>` : ` <span class="tag warn">unrepaired</span>`}${d.repaired_by ? ` — ${esc(d.repaired_by)}` : ''}</li>`).join('')}</ul>` : ''}
      </div>`;
    }
  }

  setView(html);
}
