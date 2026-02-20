/**
 * Traveller Stephanus - Travel Calculator
 *
 * Implements travel rules from TRAVEL-EXPLAINED.md:
 * - 1 unit fuel per jump regardless of distance
 * - Refined fuel consumed first, then unrefined (always available)
 * - Travel time = 1w origin + 1w per jump + 1w destination (no intermediate stop penalty)
 * - BFS pathfinding minimizes number of jumps
 *
 * Usage:
 *   node scripts/travel.js <from_hex> <to_hex> --jump=N --fuel=N
 *   node scripts/travel.js --map
 *
 * Examples:
 *   node scripts/travel.js S AF --jump=1 --fuel=2
 *   node scripts/travel.js --map
 */

const fs = require('fs');
const path = require('path');

// --- Load hex grid ---

const gridPath = path.join(__dirname, '../data/worlds/sector-graph.json');
const gridData = JSON.parse(fs.readFileSync(gridPath, 'utf8'));

const hexById = {};
const hexByColRow = {};
for (const hex of gridData.hexes) {
  hexById[hex.id] = hex;
  hexByColRow[`${hex.col},${hex.row}`] = hex;
}

// --- Hex geometry (even-q offset) ---

function toAxial(col, row) {
  return { q: col, r: row - Math.floor(col / 2) };
}

function hexDistance(a, b) {
  const ax = toAxial(a.col, a.row);
  const bx = toAxial(b.col, b.row);
  const dq = Math.abs(ax.q - bx.q);
  const dr = Math.abs(ax.r - bx.r);
  const ds = Math.abs((ax.q + ax.r) - (bx.q + bx.r));
  return (dq + dr + ds) / 2;
}

// --- Pathfinding ---

function findPath(sourceId, destId, jumpRating) {
  const source = hexById[sourceId];
  const dest = hexById[destId];
  if (!source || !dest) return null;

  const visited = new Set([sourceId]);
  const queue = [{ id: sourceId, path: [sourceId] }];

  while (queue.length > 0) {
    const { id: currentId, path: currentPath } = queue.shift();
    const current = hexById[currentId];

    if (currentId === destId) return currentPath;

    for (const hex of gridData.hexes) {
      if (visited.has(hex.id)) continue;
      if (hexDistance(current, hex) <= jumpRating) {
        visited.add(hex.id);
        queue.push({ id: hex.id, path: [...currentPath, hex.id] });
      }
    }
  }

  return null;
}

// --- Travel calculator ---

function calculateTravel(sourceId, destId, jumpRating, refinedFuel) {
  const path = findPath(sourceId, destId, jumpRating);
  if (!path) {
    return { error: `No path from ${sourceId} to ${destId} with Jump-${jumpRating}` };
  }

  const jumps = [];
  let refinedLeft = refinedFuel;

  for (let i = 0; i < path.length - 1; i++) {
    const from = hexById[path[i]];
    const to = hexById[path[i + 1]];
    const dist = hexDistance(from, to);
    let fuelType;

    if (refinedLeft > 0) {
      fuelType = 'Refined';
      refinedLeft--;
    } else {
      fuelType = 'Unrefined';
    }

    jumps.push({
      from: path[i],
      to: path[i + 1],
      parsecs: dist,
      fuelType,
      fromSystem: from.system || null,
      toSystem: to.system || null
    });
  }

  const numJumps = jumps.length;
  const totalWeeks = numJumps + 2;
  const refinedUsed = refinedFuel - refinedLeft;
  const unrefinedUsed = numJumps - refinedUsed;

  return { path, jumps, numJumps, totalWeeks, refinedUsed, unrefinedUsed };
}

// --- Display ---

function hexLabel(id) {
  const hex = hexById[id];
  return hex.system ? `${id} (${hex.system})` : id;
}

function printResult(result) {
  if (result.error) {
    console.log(`Error: ${result.error}`);
    return;
  }

  console.log(`Route: ${result.path.map(hexLabel).join(' → ')}`);

  for (let i = 0; i < result.jumps.length; i++) {
    const j = result.jumps[i];
    console.log(`  Jump ${i + 1}: ${hexLabel(j.from)} → ${hexLabel(j.to)} (${j.parsecs} parsec${j.parsecs !== 1 ? 's' : ''}) — ${j.fuelType}`);
  }

  console.log();
  console.log(`Total time: ${result.totalWeeks} weeks (1w origin + ${result.numJumps}w jump${result.numJumps !== 1 ? 's' : ''} + 1w destination)`);

  const fuelParts = [];
  if (result.refinedUsed > 0) fuelParts.push(`${result.refinedUsed} refined`);
  if (result.unrefinedUsed > 0) fuelParts.push(`${result.unrefinedUsed} unrefined`);
  console.log(`Fuel used: ${fuelParts.join(' + ')}`);
}

function printMap() {
  const maxCol = Math.max(...gridData.hexes.map(h => h.col));
  const maxRow = Math.max(...gridData.hexes.map(h => h.row));

  const cellWidth = 12;

  for (let row = 0; row <= maxRow; row++) {
    // Even columns at this row
    let evenLine = '';
    for (let col = 0; col <= maxCol; col += 2) {
      const hex = hexByColRow[`${col},${row}`];
      if (hex) {
        const label = hex.system ? `${hex.id}:${hex.system.slice(0, 6)}` : hex.id;
        evenLine += `[${label}]`.padEnd(cellWidth);
      } else {
        evenLine += ''.padEnd(cellWidth);
      }
    }

    // Odd columns at this row (shifted right by half cell width)
    let oddLine = '';
    for (let col = 1; col <= maxCol; col += 2) {
      const hex = hexByColRow[`${col},${row}`];
      if (hex) {
        const label = hex.system ? `${hex.id}:${hex.system.slice(0, 6)}` : hex.id;
        oddLine += `[${label}]`.padEnd(cellWidth);
      } else {
        oddLine += ''.padEnd(cellWidth);
      }
    }

    const indent = ' '.repeat(cellWidth / 2);
    console.log(evenLine);
    console.log(indent + oddLine);
  }
}

// --- CLI ---

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log('Traveller Stephanus - Travel Calculator');
    console.log();
    console.log('Usage:');
    console.log('  node scripts/travel.js <from> <to> --jump=N --fuel=N');
    console.log('  node scripts/travel.js --map');
    console.log('  node scripts/travel.js --distance <hex1> <hex2>');
    console.log();
    console.log('Options:');
    console.log('  --jump=N    Jump drive rating (default: 1)');
    console.log('  --fuel=N    Units of refined fuel carried (default: 0)');
    console.log('  --map       Print ASCII hex map');
    console.log();
    console.log('Hex IDs:', gridData.hexes.map(h => h.system ? `${h.id}(${h.system})` : h.id).join(', '));
    process.exit(0);
  }

  if (args[0] === '--map') {
    printMap();
    process.exit(0);
  }

  if (args[0] === '--distance') {
    const id1 = (args[1] || '').toUpperCase();
    const id2 = (args[2] || '').toUpperCase();
    const h1 = hexById[id1];
    const h2 = hexById[id2];
    if (!h1 || !h2) {
      console.log(`Unknown hex: ${!h1 ? id1 : id2}`);
      process.exit(1);
    }
    console.log(`${hexLabel(id1)} to ${hexLabel(id2)}: ${hexDistance(h1, h2)} parsecs`);
    process.exit(0);
  }

  const fromId = args[0].toUpperCase();
  const toId = args[1].toUpperCase();
  let jumpRating = 1;
  let fuel = 0;

  for (const arg of args.slice(2)) {
    if (arg.startsWith('--jump=')) jumpRating = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--fuel=')) fuel = parseInt(arg.split('=')[1], 10);
  }

  if (!hexById[fromId]) { console.log(`Unknown hex: ${fromId}`); process.exit(1); }
  if (!hexById[toId]) { console.log(`Unknown hex: ${toId}`); process.exit(1); }

  const result = calculateTravel(fromId, toId, jumpRating, fuel);
  printResult(result);
}

module.exports = { hexById, hexByColRow, hexDistance, findPath, calculateTravel, gridData };
