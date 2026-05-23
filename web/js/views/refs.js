/* =========================================================================
   Markdown views: reference docs and arbitrary top-level docs (README, etc.)
   The references were copy-pasted from Discord without markdown heading
   syntax, so they get preprocessed to promote heading-like lines.
   ========================================================================= */

'use strict';

async function viewMarkdown(path, title, crumbsArr, opts = {}) {
  setView('<div class="loading">Loading…</div>');
  let text;
  try { text = await load(path, 'text'); }
  catch (e) { return showError(e, path); }
  if (opts.preprocess) text = opts.preprocess(text);
  let html = '';
  if (crumbsArr) html += crumbs(crumbsArr);
  if (title) html += `<h1 class="page-title">${esc(title)}</h1>`;
  html += `<div class="md">${md(text)}</div>`;
  setView(html);
}

async function viewRefsIndex() {
  let html = `<h1 class="page-title">Reference Documents</h1>`;
  html += `<p style="color: var(--text-dim); margin-bottom: 12px;">Original markdown source materials from the GM's Discord.</p>`;
  html += `<div class="card-grid">`;
  for (const r of REFERENCES) {
    html += `<div class="card"><h3><a href="#/refs/${r.id}">${esc(r.label)}</a></h3></div>`;
  }
  html += `</div>`;
  setView(html);
}

async function viewRef(id) {
  const r = REFERENCES.find(x => x.id === id);
  if (!r) return setView(`<div class="error">Unknown reference: ${esc(id)}</div>`);
  return viewMarkdown(`../references/${id}.md`, r.label, [
    { route: '#/refs', label: 'References' },
    { label: r.label }
  ], { preprocess: preprocessReferenceMd });
}

// References were copy-pasted from Discord and don't use markdown heading syntax.
// Promote heading-like lines to ## and tag UWP codes as inline code.
function preprocessReferenceMd(text) {
  const isUWP = s => /^[A-EX]-?[A-Za-z0-9]{2,}(-[A-Za-z0-9]+)+$/.test(s)
                  || /^\[[A-EX]+\][- ]/.test(s);
  const lines = text.split('\n');
  const out = [];
  // Skip the first non-blank line - that's the document title and we render it
  // separately as the page title.
  let titleSkipped = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const prev = i > 0 ? lines[i - 1].trim() : '';
    const next = i < lines.length - 1 ? lines[i + 1].trim() : '';

    if (!trimmed) { out.push(line); continue; }
    if (/^#{1,6}\s/.test(trimmed)) { out.push(line); continue; }

    if (!titleSkipped) {
      titleSkipped = true;
      // Drop it - page title already shows the document title
      continue;
    }

    if (isUWP(trimmed)) {
      out.push('`' + trimmed + '`');
      continue;
    }

    const isShort = trimmed.length <= 60;
    const noTrailingPunct = !/[.!?:;]$/.test(trimmed);
    const noTrailingComma = !/,$/.test(trimmed);
    const hasLetters = /[a-zA-Z]/.test(trimmed);
    const prevBlank = prev === '';
    const nextHasContent = next.length > 0;

    if (isShort && noTrailingPunct && noTrailingComma && hasLetters && prevBlank && nextHasContent) {
      out.push('## ' + trimmed);
    } else if (isShort && /,$/.test(trimmed) && prevBlank && nextHasContent) {
      // The "world-profiles-how-to.md" file uses "Heading," with a trailing comma
      out.push('## ' + trimmed.replace(/,$/, ''));
    } else {
      out.push(line);
    }
  }
  return out.join('\n');
}

async function viewDoc(path) {
  return viewMarkdown(path, path.split('/').pop(), [
    { route: '#/', label: 'Home' },
    { label: path.split('/').pop() }
  ]);
}
