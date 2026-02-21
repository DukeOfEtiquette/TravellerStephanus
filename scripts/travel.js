/**
 * Traveller Stephanus - Travel Calculator
 *
 * Two modes:
 * 1. Basic: BFS shortest path, fuel consumed in order (refined first, then unrefined)
 * 2. Plan (--plan): Dijkstra on (hex, fuel) state space. Routes through system hexes
 *    only, uses refined fuel only, buys refined at A/B/C starports when needed.
 *    Refueling at an intermediate stop costs 2 weeks (jump point → starport → jump point).
 *
 * Usage:
 *   node scripts/travel.js <from> <to> --jump=N --fuel=N
 *   node scripts/travel.js <from> <to> --jump=N --fuel=N --plan
 *   node scripts/travel.js --map
 *   node scripts/travel.js --distance <hex1> <hex2>
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

// --- Basic pathfinding (BFS, minimizes jumps) ---

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

// --- Basic travel calculator ---

function calculateTravel(sourceId, destId, jumpRating, refinedFuel) {
  const foundPath = findPath(sourceId, destId, jumpRating);
  if (!foundPath) {
    return { error: `No path from ${sourceId} to ${destId} with Jump-${jumpRating}` };
  }

  const jumps = [];
  let refinedLeft = refinedFuel;

  for (let i = 0; i < foundPath.length - 1; i++) {
    const from = hexById[foundPath[i]];
    const to = hexById[foundPath[i + 1]];
    const dist = hexDistance(from, to);
    let fuelType;

    if (refinedLeft > 0) {
      fuelType = 'Refined';
      refinedLeft--;
    } else {
      fuelType = 'Unrefined';
    }

    jumps.push({ from: foundPath[i], to: foundPath[i + 1], parsecs: dist, fuelType });
  }

  const numJumps = jumps.length;
  const totalWeeks = numJumps + 2;
  const refinedUsed = refinedFuel - refinedLeft;
  const unrefinedUsed = numJumps - refinedUsed;

  return { mode: 'basic', path: foundPath, jumps, numJumps, totalWeeks, refinedUsed, unrefinedUsed };
}

// --- Smart pathfinding (--plan mode) ---

const MAX_FUEL = 20;

function hasRefinedFuel(hex) {
  return hex.starport && ['A', 'B', 'C'].includes(hex.starport);
}

function planTravel(sourceId, destId, jumpRating, startingFuel) {
  const source = hexById[sourceId];
  const dest = hexById[destId];
  if (!source || !dest) return { error: 'Unknown hex' };

  const stateKey = (id, fuel) => `${id}:${fuel}`;
  const dist = {};
  const prev = {};

  const startKey = stateKey(sourceId, startingFuel);
  dist[startKey] = 0;

  // Priority queue: [cost, hexId, fuel]
  const pq = [[0, sourceId, startingFuel]];

  while (pq.length > 0) {
    pq.sort((a, b) => a[0] - b[0]);
    const [cost, hexId, fuel] = pq.shift();
    const key = stateKey(hexId, fuel);

    if (cost > (dist[key] ?? Infinity)) continue;

    // Goal: reached destination at any fuel level
    if (hexId === destId) {
      return buildPlanResult(prev, key, sourceId, startingFuel);
    }

    const hex = hexById[hexId];

    // Transition: jump to a reachable system hex (or the destination)
    if (fuel > 0) {
      for (const candidate of gridData.hexes) {
        if (candidate.id === hexId) continue;
        if (!candidate.system && candidate.id !== destId) continue;
        if (hexDistance(hex, candidate) > jumpRating) continue;

        const newFuel = fuel - 1;
        const newKey = stateKey(candidate.id, newFuel);
        const newCost = cost + 1;
        if (newCost < (dist[newKey] ?? Infinity)) {
          dist[newKey] = newCost;
          prev[newKey] = { prevKey: key, action: 'jump', from: hexId, to: candidate.id };
          pq.push([newCost, candidate.id, newFuel]);
        }
      }
    }

    // Transition: refuel at A/B/C starport (costs 2 weeks, fills to MAX_FUEL)
    if (hasRefinedFuel(hex) && fuel < MAX_FUEL) {
      const newKey = stateKey(hexId, MAX_FUEL);
      const newCost = cost + 2;
      if (newCost < (dist[newKey] ?? Infinity)) {
        dist[newKey] = newCost;
        prev[newKey] = { prevKey: key, action: 'refuel', at: hexId, fuelBefore: fuel };
        pq.push([newCost, hexId, MAX_FUEL]);
      }
    }
  }

  return { error: `No route from ${hexLabel(sourceId)} to ${hexLabel(destId)} through system hexes with Jump-${jumpRating} and refined fuel only` };
}

function buildPlanResult(prev, goalKey, sourceId, startingFuel) {
  // Reconstruct action sequence
  const actions = [];
  let key = goalKey;
  while (prev[key]) {
    actions.unshift(prev[key]);
    key = prev[key].prevKey;
  }

  // Build steps and hex path
  const steps = [];
  const hexPath = [sourceId];

  for (const action of actions) {
    if (action.action === 'jump') {
      const dist = hexDistance(hexById[action.from], hexById[action.to]);
      steps.push({ type: 'jump', from: action.from, to: action.to, parsecs: dist });
      hexPath.push(action.to);
    } else {
      steps.push({ type: 'refuel', at: action.at, fuelBefore: action.fuelBefore });
    }
  }

  // Compute minimum fuel purchases at each refuel stop
  let fuel = startingFuel;
  let totalPurchased = 0;
  let refuelStops = 0;
  let numJumps = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.type === 'jump') {
      step.fuelType = 'Refined';
      fuel -= 1;
      numJumps++;
      step.fuelAfter = fuel;
    } else {
      // Count jumps until next refuel stop or end of path
      let jumpsAhead = 0;
      for (let j = i + 1; j < steps.length; j++) {
        if (steps[j].type === 'jump') jumpsAhead++;
        if (steps[j].type === 'refuel') break;
      }
      const buy = Math.max(0, jumpsAhead - fuel);
      step.purchased = buy;
      fuel += buy;
      totalPurchased += buy;
      refuelStops++;
      step.fuelAfter = fuel;
    }
  }

  const refuelWeeks = refuelStops * 2;
  const totalWeeks = numJumps + refuelWeeks + 2;

  return {
    mode: 'plan',
    path: hexPath,
    steps,
    numJumps,
    refuelStops,
    refuelWeeks,
    totalWeeks,
    startingFuel,
    totalPurchased,
    totalRefined: startingFuel + totalPurchased
  };
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

  if (result.mode === 'plan') {
    printPlanResult(result);
    return;
  }

  console.log(`Route: ${result.path.map(hexLabel).join(' \u2192 ')}`);

  for (let i = 0; i < result.jumps.length; i++) {
    const j = result.jumps[i];
    console.log(`  Jump ${i + 1}: ${hexLabel(j.from)} \u2192 ${hexLabel(j.to)} (${j.parsecs} parsec${j.parsecs !== 1 ? 's' : ''}) \u2014 ${j.fuelType}`);
  }

  console.log();
  console.log(`Total time: ${result.totalWeeks} weeks (1w origin + ${result.numJumps}w jump${result.numJumps !== 1 ? 's' : ''} + 1w destination)`);

  const fuelParts = [];
  if (result.refinedUsed > 0) fuelParts.push(`${result.refinedUsed} refined`);
  if (result.unrefinedUsed > 0) fuelParts.push(`${result.unrefinedUsed} unrefined`);
  console.log(`Fuel used: ${fuelParts.join(' + ')}`);
}

function printPlanResult(result) {
  // Route summary line
  const routeParts = result.path.map(id => {
    const hex = hexById[id];
    const refuelStep = result.steps.find(s => s.type === 'refuel' && s.at === id);
    let label = hexLabel(id);
    if (refuelStep) label += ` [+${refuelStep.purchased} refined]`;
    return label;
  });
  console.log(`Route: ${routeParts.join(' \u2192 ')}`);

  // Step-by-step
  let jumpNum = 0;
  for (const step of result.steps) {
    if (step.type === 'jump') {
      jumpNum++;
      console.log(`  Jump ${jumpNum}: ${hexLabel(step.from)} \u2192 ${hexLabel(step.to)} (${step.parsecs} parsec${step.parsecs !== 1 ? 's' : ''}) \u2014 Refined [${step.fuelAfter} left]`);
    } else {
      const hex = hexById[step.at];
      console.log(`  Refuel at ${hexLabel(step.at)}: buy ${step.purchased} refined (Starport ${hex.starport}) \u2014 2 weeks`);
    }
  }

  // Time breakdown
  console.log();
  const timeParts = [`1w origin`, `${result.numJumps}w jump${result.numJumps !== 1 ? 's' : ''}`];
  if (result.refuelWeeks > 0) timeParts.push(`${result.refuelWeeks}w refueling`);
  timeParts.push(`1w destination`);
  console.log(`Total time: ${result.totalWeeks} weeks (${timeParts.join(' + ')})`);

  // Fuel summary
  const fuelParts = [`${result.startingFuel} carried`];
  if (result.totalPurchased > 0) fuelParts.push(`${result.totalPurchased} purchased`);
  console.log(`Fuel: ${fuelParts.join(' + ')} = ${result.totalRefined} refined`);
}

function printMap() {
  const maxCol = Math.max(...gridData.hexes.map(h => h.col));
  const maxRow = Math.max(...gridData.hexes.map(h => h.row));

  const cellWidth = 12;

  for (let row = 0; row <= maxRow; row++) {
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
    console.log('  node scripts/travel.js <from> <to> --jump=N --fuel=N --plan');
    console.log('  node scripts/travel.js --map');
    console.log('  node scripts/travel.js --distance <hex1> <hex2>');
    console.log();
    console.log('Options:');
    console.log('  --jump=N    Jump drive rating (default: 1)');
    console.log('  --fuel=N    Units of refined fuel carried (default: 0)');
    console.log('  --plan      Smart routing: systems only, refined fuel only,');
    console.log('              buys refined at A/B/C starports (+2w per stop)');
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
  let planMode = false;

  for (const arg of args.slice(2)) {
    if (arg.startsWith('--jump=')) jumpRating = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--fuel=')) fuel = parseInt(arg.split('=')[1], 10);
    if (arg === '--plan') planMode = true;
  }

  if (!hexById[fromId]) { console.log(`Unknown hex: ${fromId}`); process.exit(1); }
  if (!hexById[toId]) { console.log(`Unknown hex: ${toId}`); process.exit(1); }

  const result = planMode
    ? planTravel(fromId, toId, jumpRating, fuel)
    : calculateTravel(fromId, toId, jumpRating, fuel);
  printResult(result);
}

module.exports = { hexById, hexByColRow, hexDistance, findPath, calculateTravel, planTravel, gridData };
