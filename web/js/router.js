/* =========================================================================
   Hash-based router. Dispatches to one of the view functions defined in
   js/views/*.js, then calls highlightNav (from site.js) to mark the active
   sidebar link.
   ========================================================================= */

'use strict';

async function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  const parts = hash.split('/').filter(Boolean);
  highlightNav();
  window.scrollTo(0, 0);

  try {
    if (parts.length === 0) return await viewHome();

    switch (parts[0]) {
      case 'sessions':
        if (parts.length === 1) return await viewSessions();
        return await viewSession(parts[1]);
      case 'investigation':
        return await viewInvestigation();
      case 'timeline':
        return await viewTimeline();
      case 'npcs':
        return await viewNPCs();
      case 'worlds':
        if (parts.length === 1) return await viewWorlds();
        return await viewWorld(parts[1]);
      case 'party':
        return await viewParty();
      case 'ships':
        return await viewShips();
      case 'assets':
        return await viewAssets();
      case 'rules':
        if (parts.length === 1) return await viewRulesIndex();
        return await viewRule(parts[1]);
      case 'careers':
        if (parts.length === 1) return await viewCareersIndex();
        return await viewCareer(parts[1]);
      case 'prices':
        return await viewPrices();
      case 'refs':
        if (parts.length === 1) return await viewRefsIndex();
        return await viewRef(parts[1]);
      case 'doc':
        return await viewDoc(decodeURIComponent(parts.slice(1).join('/')));
      default:
        setView(`<div class="error">Unknown route: <code>${esc(hash)}</code></div>`);
    }
  } catch (e) {
    showError(e);
  }
}

window.addEventListener('hashchange', route);
route();
