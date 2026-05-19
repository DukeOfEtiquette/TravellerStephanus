/* =========================================================================
   Traveller Stephanus — shared chrome scripts
   Used by both index.html and travel.html. Page-specific scripts stay inline.
   Exposes globals: NAV, renderNav, highlightNav (the router calls highlightNav
   on each hash change).
   ========================================================================= */

'use strict';

// --- Nav menu (single source of truth) ---

const NAV = [
  { group: 'Campaign', items: [
    { route: '#/',              label: 'Overview' },
    { route: '#/investigation', label: 'Investigation' },
    { route: '#/timeline',      label: 'Timeline' },
    { route: '#/npcs',          label: 'NPCs' },
    { route: '#/sessions',      label: 'GM Session Recaps' }
  ]},
  { group: 'Party', items: [
    { route: '#/party',  label: 'Party Members' },
    { route: '#/ships',  label: 'Ships' },
    { route: '#/assets', label: 'Assets' }
  ]},
  { group: 'Setting', items: [
    { route: '#/worlds',    label: 'Worlds' },
    { route: 'travel.html', label: 'Travel Calculator' }
  ]},
  { group: 'Rules', items: [
    { route: '#/rules',   label: 'Core Rules' },
    { route: '#/careers', label: 'Careers' },
    { route: '#/prices',  label: 'Prices & Equipment' },
    { route: '#/refs',    label: 'Reference Docs' }
  ]}
];

function _navEsc(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function _isIndexPage() {
  const p = location.pathname;
  return p === '/' || p.endsWith('/') || p.endsWith('/index.html');
}

// SPA hash routes need an `index.html` prefix when navigating from another page
function _navHref(route) {
  if (route.startsWith('#') && !_isIndexPage()) return 'index.html' + route;
  return route;
}

function renderNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.innerHTML = NAV.map(g => `
    <div class="group">${_navEsc(g.group)}</div>
    ${g.items.map(it =>
      `<a href="${_navEsc(_navHref(it.route))}" data-route="${_navEsc(it.route)}">${_navEsc(it.label)}</a>`
    ).join('')}
  `).join('');
}

function highlightNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  let currentRoute;
  if (_isIndexPage()) {
    currentRoute = location.hash || '#/';
  } else {
    currentRoute = location.pathname.split('/').pop() || '';
  }
  for (const a of nav.querySelectorAll('a[data-route]')) {
    const target = a.dataset.route;
    let active = false;
    if (target === '#/') {
      active = (currentRoute === '' || currentRoute === '#/' || currentRoute === '#');
    } else {
      active = currentRoute === target || currentRoute.startsWith(target + '/');
    }
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  }
}

// --- Palette cycle: phosphor → starchart → dossier → phosphor ---
(function setupPaletteToggle() {
  const PALETTES = ['phosphor', 'starchart', 'dossier'];
  const btn = document.getElementById('palette-toggle');
  if (!btn) return;
  const current = () => document.documentElement.dataset.palette || 'phosphor';
  const apply = (p) => {
    document.documentElement.dataset.palette = p;
    try { localStorage.setItem('ts-palette', p); } catch (e) {}
    btn.dataset.active = p;
  };
  apply(current());
  btn.addEventListener('click', () => {
    const next = PALETTES[(PALETTES.indexOf(current()) + 1) % PALETTES.length];
    apply(next);
  });
})();

// --- Font-size cycle: reg → lrg → xlrg → reg ---
(function setupFontToggle() {
  const SIZES = ['reg', 'lrg', 'xlrg'];
  const LABELS = { reg: 'Default', lrg: 'Large', xlrg: 'XLarge' };
  const btn = document.getElementById('font-toggle');
  if (!btn) return;
  const label = btn.querySelector('.font-label');
  const current = () => document.documentElement.dataset.font || 'reg';
  const apply = (size) => {
    document.documentElement.dataset.font = size;
    try { localStorage.setItem('ts-font', size); } catch (e) {}
    if (label) label.textContent = LABELS[size];
  };
  apply(current());
  btn.addEventListener('click', () => {
    const next = SIZES[(SIZES.indexOf(current()) + 1) % SIZES.length];
    apply(next);
  });
})();

// --- Mobile sidebar drawer ---
(function setupMobileNav() {
  const btn = document.getElementById('menu-toggle');
  const backdrop = document.getElementById('sidebar-backdrop');
  const nav = document.getElementById('nav');
  if (!btn || !backdrop) return;
  const close = () => {
    document.body.classList.remove('sidebar-open');
    btn.setAttribute('aria-expanded', 'false');
  };
  btn.addEventListener('click', () => {
    const open = document.body.classList.toggle('sidebar-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  backdrop.addEventListener('click', close);
  if (nav) {
    nav.addEventListener('click', e => {
      if (e.target.closest('a')) close();
    });
  }
})();

// --- Scroll-to-top button ---
(function setupScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  const THRESHOLD = 400;
  let ticking = false;
  function update() {
    btn.classList.toggle('visible', window.scrollY > THRESHOLD);
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  update();
})();

// --- Init nav (router/page will call highlightNav on each route change) ---
renderNav();
highlightNav();
