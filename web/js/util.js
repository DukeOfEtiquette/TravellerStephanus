/* =========================================================================
   Shared helpers: escaping, formatting, view setting, breadcrumbs, generic
   YAML rendering. Used by every view module.
   ========================================================================= */

'use strict';

function el(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content;
}

function esc(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function nl2br(str) {
  return esc(str).replace(/\n/g, '<br>');
}

function md(str) {
  if (!str) return '';
  return marked.parse(str, { breaks: true, gfm: true });
}

function pad2(n) { return n < 10 ? '0' + n : '' + n; }

function fmtDate(d) {
  if (!d) return '';
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

function slugify(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function truncate(s, max) {
  if (!s) return '';
  s = s.trim();
  if (s.length <= max) return s;
  return s.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

function titleCase(s) {
  return String(s).replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function setView(html) {
  const view = document.getElementById('view');
  view.innerHTML = html;
  // Wrap every table in a horizontally scrollable container so wide tables
  // (prices, careers, retirement, etc.) don't blow out the viewport on phones.
  for (const table of view.querySelectorAll('table')) {
    if (table.parentElement && table.parentElement.classList.contains('table-scroll')) continue;
    const wrap = document.createElement('div');
    wrap.className = 'table-scroll';
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  }
  // Scroll the new view to the top so route changes don't strand the user mid-page.
  view.scrollTop = 0;
  window.scrollTo(0, 0);
}

function showError(err, contextPath) {
  const isLocalFile = location.protocol === 'file:';
  const hint = isLocalFile ? `
    <p style="margin-top: 10px;">
      It looks like you opened <code>index.html</code> directly. Browsers block
      <code>fetch()</code> from <code>file://</code>, so the campaign data can't
      be loaded.
    </p>
    <p style="margin-top: 6px;">
      Run a small static server from the project root, then visit
      <code>http://localhost:8000/web/</code>:
    </p>
    <pre>python3 -m http.server 8000</pre>
  ` : '';
  setView(`
    <div class="error">
      <strong>Failed to load data</strong>
      <pre>${esc(err.message || err)}${contextPath ? '\n\nFile: ' + esc(contextPath) : ''}</pre>
      ${hint}
    </div>
  `);
}

function crumbs(parts) {
  return `<div class="crumbs">${parts.map((p, i) =>
    i === parts.length - 1
      ? esc(p.label)
      : (p.route ? `<a href="${p.route}">${esc(p.label)}</a>` : esc(p.label))
  ).join(' / ')}</div>`;
}

// Generic recursive YAML renderer - used as the catch-all by several views
// when a section's shape isn't worth a bespoke renderer.
function renderYaml(obj, depth = 0) {
  if (obj == null) return '<em>null</em>';
  if (typeof obj === 'string') {
    return `<div style="white-space: pre-wrap;">${esc(obj)}</div>`;
  }
  if (typeof obj !== 'object') return esc(String(obj));

  if (Array.isArray(obj)) {
    if (obj.every(x => typeof x !== 'object' || x === null)) {
      return `<ul>${obj.map(x => `<li>${esc(String(x))}</li>`).join('')}</ul>`;
    }
    return obj.map(x => `<div class="card">${renderYaml(x, depth + 1)}</div>`).join('');
  }

  const entries = Object.entries(obj);
  let html = '';
  for (const [k, v] of entries) {
    const heading = depth === 0 ? 'h2' : depth === 1 ? 'h3' : 'h3';
    if (typeof v === 'object' && v !== null) {
      html += `<${heading}>${esc(k.replace(/_/g, ' '))}</${heading}>${renderYaml(v, depth + 1)}`;
    } else {
      html += `<div class="kv"><dt>${esc(k.replace(/_/g, ' '))}</dt><dd>${esc(String(v))}</dd></div>`;
    }
  }
  return html;
}
