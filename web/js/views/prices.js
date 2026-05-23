/* =========================================================================
   Prices & equipment view. Recursively walks the nested category tree and
   renders any leaf array as a price table (collapsing cost / cost_min /
   cost_max into one virtual Cost column).
   ========================================================================= */

'use strict';

const PRICE_COL_ORDER = ['name','skill_level','damage','value','cost','cost_min','cost_max','cost_ratio','ammo_cost','shell_cost','annual','unit','situational','note'];
const PRICE_COL_LABELS = {
  name: 'Item',
  skill_level: 'Skill Level',
  cost: 'Cost',
  cost_min: 'Min',
  cost_max: 'Max',
  cost_ratio: 'Cost Ratio',
  ammo_cost: 'Ammo Cost',
  shell_cost: 'Shell Cost',
  annual: 'Annual',
  unit: 'Unit',
  damage: 'Damage',
  value: 'Value',
  situational: 'Situational',
  note: 'Note'
};

async function viewPrices() {
  setView('<div class="loading">Loading prices…</div>');
  let raw;
  try { raw = await load('../data/equipment/prices.yaml'); }
  catch (e) { return showError(e, '../data/equipment/prices.yaml'); }

  let html = `<h1 class="page-title">Prices &amp; Equipment</h1>`;
  html += renderPriceCategory(raw, 0);
  setView(html);
}

function renderPriceCategory(obj, depth) {
  if (obj == null) return '';
  if (Array.isArray(obj)) return renderPriceTable(obj);
  if (typeof obj !== 'object') return `<div>${esc(String(obj))}</div>`;

  let html = '';
  for (const [k, v] of Object.entries(obj)) {
    const heading = depth === 0 ? 'h2' : depth === 1 ? 'h3' : 'h4';
    const label = k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    html += `<${heading}>${esc(label)}</${heading}>`;
    html += renderPriceCategory(v, depth + 1);
  }
  return html;
}

function renderPriceTable(rows) {
  if (!rows.length) return '';
  // Non-object rows (e.g. simple strings) - fall back to a list
  if (rows.some(r => typeof r !== 'object' || r === null)) {
    return `<ul>${rows.map(r => `<li>${esc(String(r))}</li>`).join('')}</ul>`;
  }
  // Union of keys present in any row
  const keysPresent = new Set();
  for (const r of rows) for (const k of Object.keys(r)) keysPresent.add(k);

  // Build column list: known order first, then anything else.
  // Collapse cost / cost_min / cost_max into a single virtual "Cost" column.
  const hasCost = keysPresent.has('cost') || keysPresent.has('cost_min') || keysPresent.has('cost_max');
  const skip = new Set(['cost', 'cost_min', 'cost_max']);
  const cols = [];
  for (const k of PRICE_COL_ORDER) {
    if (skip.has(k)) continue;
    if (k === 'name') {
      if (keysPresent.has('name')) cols.push('name');
      if (hasCost) cols.push('Cost');
      continue;
    }
    if (keysPresent.has(k)) cols.push(k);
  }
  // Anything not yet covered
  for (const k of keysPresent) {
    if (!skip.has(k) && !cols.includes(k)) cols.push(k);
  }
  if (hasCost && !cols.includes('Cost')) cols.unshift('Cost');

  const labelOf = k => PRICE_COL_LABELS[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const cellOf = (row, k) => {
    if (k === 'Cost') {
      if (row.cost != null) return esc(row.cost);
      if (row.cost_min != null && row.cost_max != null) return `${esc(row.cost_min)}–${esc(row.cost_max)}`;
      if (row.cost_min != null) return `${esc(row.cost_min)}+`;
      if (row.cost_max != null) return `≤${esc(row.cost_max)}`;
      return '';
    }
    const v = row[k];
    if (v == null) return '';
    if (typeof v === 'object') return esc(jsyaml.dump(v).trim());
    return esc(String(v));
  };

  let html = `<table class="prices-table"><thead><tr>${cols.map(c => `<th>${esc(labelOf(c))}</th>`).join('')}</tr></thead><tbody>`;
  for (const r of rows) {
    html += `<tr>${cols.map(c => `<td>${cellOf(r, c)}</td>`).join('')}</tr>`;
  }
  html += `</tbody></table>`;
  return html;
}
