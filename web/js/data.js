/* =========================================================================
   Manifests and data loader
   Hand-maintained lists of available content files, plus a tiny cached
   fetch helper that parses YAML / JSON / Markdown.
   ========================================================================= */

'use strict';

const SESSION_NUMBERS = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

const RULES_FILES = [
  { id: 'character-creation', label: 'Character Creation' },
  { id: 'combat',             label: 'Combat' },
  { id: 'skills',             label: 'Skills' }
];

const CAREER_FILES = [
  { id: 'military',   label: 'Military' },
  { id: 'mercantile', label: 'Mercantile' },
  { id: 'frontier',   label: 'Frontier' },
  { id: 'noble',      label: 'Noble' },
  { id: 'drifter',    label: 'Drifter' },
  { id: 'psion',      label: 'Psion' }
];

const REFERENCES = [
  { id: 'system-fundamentals',   label: 'System Fundamentals' },
  { id: 'settings-fundamentals', label: 'Settings Fundamentals' },
  { id: 'world-profiles',        label: 'World Profiles (raw)' },
  { id: 'world-profiles-how-to', label: 'UWP Format Guide' }
];

const TOP_DOCS = [
  { path: '../README.md',           label: 'README' },
  { path: '../TRAVEL-EXPLAINED.md', label: 'Travel Rules' },
  { path: '../GM-QUESTIONS.md',     label: 'GM Questions' }
];

const _loadCache = new Map();

async function load(path, kind = 'yaml') {
  const key = `${kind}:${path}`;
  if (_loadCache.has(key)) return _loadCache.get(key);
  const res = await fetch(path);
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${path}`);
  const text = await res.text();
  let data;
  if (kind === 'yaml') data = jsyaml.load(text);
  else if (kind === 'json') data = JSON.parse(text);
  else data = text;
  _loadCache.set(key, data);
  return data;
}
