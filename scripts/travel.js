/**
 * Traveller Stephanus - Travel Calculator
 *
 * Graph algorithms for route planning using hex coordinates.
 * Properly handles dead space (empty hexes) between systems.
 *
 * Usage:
 *   node scripts/travel.js <from> <to> [--jump=N] [--fuel=refined|unrefined|any]
 *
 * Examples:
 *   node scripts/travel.js stoyben mowebe
 *   node scripts/travel.js stoyben mowebe --jump=1 --fuel=unrefined
 *   node scripts/travel.js spirelle tivid --jump=1
 *   node scripts/travel.js spirelle tivid --jump=2
 */

const fs = require('fs');
const path = require('path');

// Load sector graph
const graphPath = path.join(__dirname, '../data/worlds/sector-graph.json');
const sectorData = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

/**
 * Calculate hex distance using axial coordinates (q, r).
 * Formula: (|Δq| + |Δr| + |Δq + Δr|) / 2
 *
 * This correctly accounts for empty hexes (dead space) between systems.
 *
 * @param {number[]} hex1 - [q, r] axial coordinates of first hex
 * @param {number[]} hex2 - [q, r] axial coordinates of second hex
 * @returns {number} Distance in hexes (parsecs)
 */
function hexDistance(hex1, hex2) {
  const [q1, r1] = hex1;
  const [q2, r2] = hex2;

  const dq = Math.abs(q1 - q2);
  const dr = Math.abs(r1 - r2);
  const dqr = Math.abs((q1 + r1) - (q2 + r2));

  return (dq + dr + dqr) / 2;
}

/**
 * Get all systems reachable from a given system with a specific jump rating.
 * Returns systems and their distances.
 *
 * @param {string} systemKey - The starting system
 * @param {number} jumpRating - Maximum jump distance (1-5)
 * @returns {Array<{system: string, distance: number}>}
 */
function getReachableSystems(systemKey, jumpRating) {
  const systems = sectorData.systems;
  const sourceHex = systems[systemKey].hex;
  const reachable = [];

  for (const [targetKey, targetData] of Object.entries(systems)) {
    if (targetKey === systemKey) continue;

    const distance = hexDistance(sourceHex, targetData.hex);
    if (distance <= jumpRating) {
      reachable.push({ system: targetKey, distance });
    }
  }

  return reachable;
}

/**
 * Find shortest path using Dijkstra's algorithm.
 * Accounts for dead space - jumps go through empty hexes without stopping.
 *
 * @param {string} from - Starting system key
 * @param {string} to - Destination system key
 * @param {number} jumpRating - Ship's jump drive rating (1-5)
 * @returns {{path: string[]|null, totalParsecs: number, jumps: Array}}
 */
function findShortestPath(from, to, jumpRating = 1) {
  const systems = sectorData.systems;

  if (!systems[from]) return { path: null, totalParsecs: Infinity, jumps: [], error: `Unknown system: ${from}` };
  if (!systems[to]) return { path: null, totalParsecs: Infinity, jumps: [], error: `Unknown system: ${to}` };

  const dist = {};
  const prev = {};
  const jumpDist = {};
  const pq = [];

  for (const sys of Object.keys(systems)) {
    dist[sys] = Infinity;
    prev[sys] = null;
    jumpDist[sys] = 0;
  }

  dist[from] = 0;
  pq.push({ system: from, distance: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.distance - b.distance);
    const { system: current } = pq.shift();

    if (current === to) break;
    if (dist[current] === Infinity) continue;

    const reachable = getReachableSystems(current, jumpRating);

    for (const { system: neighbor, distance: edgeDist } of reachable) {
      const alt = dist[current] + edgeDist;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
        jumpDist[neighbor] = edgeDist;
        pq.push({ system: neighbor, distance: alt });
      }
    }
  }

  if (dist[to] === Infinity) {
    return { path: null, totalParsecs: Infinity, jumps: [], error: `No route found with Jump-${jumpRating}` };
  }

  // Reconstruct path
  const pathList = [];
  const jumps = [];
  let current = to;
  while (current !== null) {
    pathList.unshift(current);
    if (prev[current] !== null) {
      jumps.unshift({
        from: prev[current],
        to: current,
        parsecs: jumpDist[current]
      });
    }
    current = prev[current];
  }

  return { path: pathList, totalParsecs: dist[to], jumps };
}

/**
 * Find path optimizing for refined fuel availability.
 * Penalizes routes through systems without refined fuel.
 *
 * @param {string} from - Starting system key
 * @param {string} to - Destination system key
 * @param {number} jumpRating - Ship's jump drive rating
 * @param {string} fuelPreference - 'refined', 'unrefined', or 'any'
 * @returns {{path: string[]|null, totalParsecs: number, jumps: Array, unrefinedJumps: number}}
 */
function findSafestPath(from, to, jumpRating = 1, fuelPreference = 'refined') {
  const systems = sectorData.systems;

  if (!systems[from]) return { path: null, error: `Unknown system: ${from}` };
  if (!systems[to]) return { path: null, error: `Unknown system: ${to}` };

  function getFuelPenalty(systemKey) {
    if (fuelPreference === 'any') return 0;
    const sys = systems[systemKey];
    if (sys.fuel.refined) return 0;
    if (sys.fuel.unrefined || sys.fuel.gas_giant) return 5; // Prefer refined, but unrefined is ok
    return 100; // No fuel at all - very expensive
  }

  const dist = {};
  const prev = {};
  const jumpInfo = {};
  const pq = [];

  for (const sys of Object.keys(systems)) {
    dist[sys] = Infinity;
    prev[sys] = null;
  }

  dist[from] = 0;
  pq.push({ system: from, cost: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { system: current } = pq.shift();

    if (current === to) break;
    if (dist[current] === Infinity) continue;

    const reachable = getReachableSystems(current, jumpRating);

    for (const { system: neighbor, distance: parsecs } of reachable) {
      const fuelPenalty = getFuelPenalty(neighbor);
      const edgeCost = parsecs + fuelPenalty;
      const alt = dist[current] + edgeCost;

      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = current;
        jumpInfo[neighbor] = { parsecs, fuelPenalty };
        pq.push({ system: neighbor, cost: alt });
      }
    }
  }

  if (dist[to] === Infinity) {
    return { path: null, totalParsecs: Infinity, jumps: [], unrefinedJumps: 0, error: `No route found` };
  }

  // Reconstruct path
  const pathList = [];
  const jumps = [];
  let unrefinedJumps = 0;
  let current = to;

  while (current !== null) {
    pathList.unshift(current);
    if (prev[current] !== null) {
      const info = jumpInfo[current];
      const sys = systems[current];
      const fuelType = sys.fuel.refined ? 'refined' :
                       (sys.fuel.unrefined || sys.fuel.gas_giant) ? 'unrefined' : 'none';
      if (fuelType !== 'refined') unrefinedJumps++;

      jumps.unshift({
        from: prev[current],
        to: current,
        parsecs: info.parsecs,
        fuelAvailable: fuelType,
        starport: sys.starport
      });
    }
    current = prev[current];
  }

  return {
    path: pathList,
    totalParsecs: jumps.reduce((a, j) => a + j.parsecs, 0),
    jumps,
    unrefinedJumps
  };
}

/**
 * Calculate travel time for a route through inhabited systems.
 *
 * Travel time model:
 * - 1 week at origin (transit to jump point)
 * - 1 week per jump (in jump space)
 * - 1 week per inhabited intermediate stop (refueling/transit)
 * - 1 week at destination (transit from jump point)
 *
 * Example: Stoyben → Ugrik → Atsah → Mowebe
 *   1 (origin) + 3 (jumps) + 2 (stops at Ugrik, Atsah) + 1 (destination) = 7 weeks
 *
 * @param {Array} jumps - Array of jump objects with 'from' and 'to' properties
 * @returns {{originWeek: number, jumpWeeks: number, stopWeeks: number, destinationWeek: number, totalWeeks: number}}
 */
function calculateTravelTime(jumps) {
  const rules = sectorData.travel_rules;

  const originWeek = rules.in_system_weeks;      // 1 week at origin
  const jumpWeeks = jumps.length * rules.jump_space_weeks;  // 1 week per jump
  const destinationWeek = rules.in_system_weeks; // 1 week at destination

  // Intermediate stops = all stops except the final destination
  // Each intermediate inhabited system adds 1 week for refueling/transit
  const intermediateStops = jumps.length > 0 ? jumps.length - 1 : 0;
  const stopWeeks = intermediateStops * rules.in_system_weeks;

  return {
    originWeek,
    jumpWeeks,
    stopWeeks,
    intermediateStops,
    destinationWeek,
    totalWeeks: originWeek + jumpWeeks + stopWeeks + destinationWeek,
    breakdown: `${originWeek}w origin + ${jumpWeeks}w jumps + ${stopWeeks}w stops + ${destinationWeek}w destination`
  };
}

/**
 * Calculate travel time for a direct route through dead space.
 *
 * Each dead space stop adds 1 week (for the jump into it).
 * No additional transit time at dead space (no services/refueling needed).
 *
 * Example: Stoyben → (dead space) → Mowebe (2 parsecs, Jump-1)
 *   1 (origin) + 1 (jump to dead space) + 1 (dead space stop) + 1 (jump to dest) + 1 (destination) = 5 weeks
 *
 * @param {number} jumpsNeeded - Number of jumps required
 * @returns {{originWeek: number, jumpWeeks: number, deadSpaceWeeks: number, destinationWeek: number, totalWeeks: number}}
 */
function calculateDirectTravelTime(jumpsNeeded) {
  const rules = sectorData.travel_rules;

  const originWeek = rules.in_system_weeks;
  const jumpWeeks = jumpsNeeded * rules.jump_space_weeks;
  const deadSpaceStops = jumpsNeeded - 1;
  const deadSpaceWeeks = deadSpaceStops * rules.in_system_weeks; // Each dead space stop = 1 week
  const destinationWeek = rules.in_system_weeks;

  return {
    originWeek,
    jumpWeeks,
    deadSpaceStops,
    deadSpaceWeeks,
    destinationWeek,
    totalWeeks: originWeek + jumpWeeks + deadSpaceWeeks + destinationWeek,
    breakdown: `${originWeek}w origin + ${jumpWeeks}w jumps + ${deadSpaceWeeks}w dead space + ${destinationWeek}w destination`
  };
}

/**
 * Calculate cumulative damage risk from unrefined fuel.
 *
 * @param {Array} jumps - Array of jump objects
 * @returns {{unrefinedJumps: number, probabilityOfDamage: number, ...}}
 */
function calculateFuelRisk(jumps) {
  const systems = sectorData.systems;
  const rules = sectorData.travel_rules;
  const damageChance = rules.unrefined_fuel_damage.chance_per_jump;

  let unrefinedJumps = 0;
  const riskByJump = [];

  for (const jump of jumps) {
    const destSystem = systems[jump.to];
    // You refuel at destination, so check destination's fuel availability
    const usesUnrefined = !destSystem.fuel.refined &&
                          (destSystem.fuel.unrefined || destSystem.fuel.gas_giant);

    if (usesUnrefined) {
      unrefinedJumps++;
    }

    riskByJump.push({
      ...jump,
      usesUnrefined,
      cumulativeUnrefinedJumps: unrefinedJumps
    });
  }

  // P(at least one failure) = 1 - P(no failures) = 1 - (1-p)^n
  const noFailureProb = Math.pow(1 - damageChance, unrefinedJumps);
  const atLeastOneFailureProb = 1 - noFailureProb;

  return {
    unrefinedJumps,
    totalJumps: jumps.length,
    damageChancePerJump: damageChance,
    probabilityOfDamage: atLeastOneFailureProb,
    probabilityOfNoDamage: noFailureProb,
    riskByJump
  };
}

/**
 * Calculate a direct route through dead space.
 * This is faster but dangerous - no services, rescue, or refueling in empty hexes.
 *
 * @param {string} from - Starting system
 * @param {string} to - Destination system
 * @param {number} jumpRating - Ship's jump rating
 * @returns {Object} Direct route analysis
 */
function findDirectRoute(from, to, jumpRating = 1) {
  const systems = sectorData.systems;

  if (!systems[from]) return { error: `Unknown system: ${from}` };
  if (!systems[to]) return { error: `Unknown system: ${to}` };

  const distance = hexDistance(systems[from].hex, systems[to].hex);
  const jumpsNeeded = Math.ceil(distance / jumpRating);
  const deadSpaceStops = jumpsNeeded - 1; // All intermediate stops are in dead space

  return {
    from,
    to,
    distance,
    jumpRating,
    jumpsNeeded,
    deadSpaceStops,
    parsecsPerJump: distance / jumpsNeeded,
    viable: jumpRating >= 1 // Always viable if you have any jump drive
  };
}

/**
 * Compare safe route (through systems) vs direct route (through dead space).
 * This is the core trade-off analysis for campaign travel decisions.
 *
 * @param {string} from - Starting system
 * @param {string} to - Destination system
 * @param {number} jumpRating - Ship's jump rating
 * @returns {Object} Comparison of both route options
 */
function compareRoutes(from, to, jumpRating = 1) {
  const systems = sectorData.systems;

  if (!systems[from]) return { error: `Unknown system: ${from}` };
  if (!systems[to]) return { error: `Unknown system: ${to}` };

  // Direct route through dead space
  const direct = findDirectRoute(from, to, jumpRating);
  const directTime = calculateDirectTravelTime(direct.jumpsNeeded);

  // Safe route through inhabited systems only
  const safeRoute = findSafestPath(from, to, jumpRating, 'any');
  let safe = null;
  let safeTime = null;
  let safeFuelRisk = null;

  if (safeRoute.path) {
    safeTime = calculateTravelTime(safeRoute.jumps);
    safeFuelRisk = calculateFuelRisk(safeRoute.jumps);
    safe = {
      path: safeRoute.path,
      jumps: safeRoute.jumps.length,
      parsecs: safeRoute.totalParsecs,
      weeks: safeTime.totalWeeks,
      breakdown: safeTime.breakdown,
      unrefinedStops: safeFuelRisk.unrefinedJumps,
      fuelDamageRisk: safeFuelRisk.probabilityOfDamage
    };
  }

  // Calculate trade-offs
  const directWeeks = directTime.totalWeeks;
  const safeWeeks = safe ? safe.weeks : Infinity;

  return {
    from: systems[from].name,
    to: systems[to].name,
    hexDistance: direct.distance,
    jumpRating,

    direct: {
      viable: true,
      jumps: direct.jumpsNeeded,
      deadSpaceStops: direct.deadSpaceStops,
      weeks: directWeeks,
      breakdown: directTime.breakdown,
      risks: [
        'No rescue if misjump occurs',
        'No refueling in dead space (must carry all fuel)',
        'No starport services',
        direct.deadSpaceStops > 0 ? `${direct.deadSpaceStops} stop(s) in empty hexes` : null
      ].filter(Boolean),
      fuelRequired: direct.jumpsNeeded // Number of jump fuel loads needed
    },

    safe: safe ? {
      viable: true,
      path: safe.path,
      jumps: safe.jumps,
      parsecs: safe.parsecs,
      weeks: safe.weeks,
      breakdown: safe.breakdown,
      unrefinedStops: safe.unrefinedStops,
      fuelDamageRisk: `${(safe.fuelDamageRisk * 100).toFixed(1)}%`,
      benefits: [
        'Refueling available at stops',
        'Starport services available',
        'Rescue possible if problems occur'
      ]
    } : {
      viable: false,
      reason: `No safe route exists with Jump-${jumpRating}`
    },

    comparison: {
      timeSaved: safe ? (safeWeeks - directWeeks).toFixed(1) + ' weeks' : 'N/A (no safe route)',
      jumpsSaved: safe ? (safe.jumps - direct.jumpsNeeded) : 'N/A',
      recommendation: getRouteRecommendation(direct, safe, directWeeks, safeWeeks)
    }
  };
}

/**
 * Generate a recommendation based on route comparison.
 */
function getRouteRecommendation(direct, safe, directWeeks, safeWeeks) {
  if (!safe) {
    return 'Direct route is the only option - prepare for dead space travel';
  }

  const timeDiff = safeWeeks - directWeeks;
  const deadSpaceStops = direct.deadSpaceStops;

  if (deadSpaceStops === 0) {
    return 'Routes are equivalent - direct route recommended';
  }

  if (timeDiff <= 1) {
    return 'Safe route recommended - minimal time difference, much lower risk';
  }

  if (timeDiff <= 3 && safe.unrefinedStops === 0) {
    return 'Safe route recommended - moderate time cost but refined fuel available';
  }

  if (timeDiff > 5 && deadSpaceStops <= 1) {
    return 'Direct route viable if time-critical - single dead space jump manageable';
  }

  if (deadSpaceStops >= 2) {
    return `Caution: ${deadSpaceStops} dead space stops required - high risk, ensure supplies`;
  }

  return 'Evaluate based on mission urgency and risk tolerance';
}

/**
 * Full route analysis combining pathfinding, time, and risk calculations.
 *
 * @param {string} from - Starting system
 * @param {string} to - Destination system
 * @param {Object} options - {jumpRating: number, fuelPreference: string}
 * @returns {Object} Complete analysis
 */
function analyzeRoute(from, to, options = {}) {
  const jumpRating = options.jumpRating || 1;
  const fuelPreference = options.fuelPreference || 'refined';

  const route = fuelPreference === 'any'
    ? findShortestPath(from, to, jumpRating)
    : findSafestPath(from, to, jumpRating, fuelPreference);

  if (!route.path) {
    return { error: route.error || `No route found from ${from} to ${to} with Jump-${jumpRating}` };
  }

  const time = calculateTravelTime(route.jumps);
  const risk = calculateFuelRisk(route.jumps);

  return {
    route: {
      from,
      to,
      path: route.path,
      jumps: route.jumps,
      totalParsecs: route.totalParsecs
    },
    time,
    fuelRisk: risk,
    summary: {
      jumps: route.jumps.length,
      parsecs: route.totalParsecs,
      weeks: time.totalWeeks,
      unrefinedFuelStops: risk.unrefinedJumps,
      damageRisk: `${(risk.probabilityOfDamage * 100).toFixed(1)}%`
    }
  };
}

/**
 * Get the hex distance between two systems.
 *
 * @param {string} from - System key
 * @param {string} to - System key
 * @returns {number} Distance in parsecs
 */
function getDistance(from, to) {
  const systems = sectorData.systems;
  if (!systems[from] || !systems[to]) return null;
  return hexDistance(systems[from].hex, systems[to].hex);
}

/**
 * List all systems reachable from a given system at various jump ratings.
 *
 * @param {string} from - System key
 * @returns {Object} Systems grouped by distance
 */
function listReachableFrom(from) {
  const systems = sectorData.systems;
  if (!systems[from]) return { error: `Unknown system: ${from}` };

  const result = { 1: [], 2: [], 3: [], 4: [], 5: [] };

  for (const [key, data] of Object.entries(systems)) {
    if (key === from) continue;
    const dist = hexDistance(systems[from].hex, data.hex);
    if (dist <= 5) {
      result[dist].push({
        system: key,
        name: data.name,
        starport: data.starport,
        fuel: data.fuel.refined ? 'refined' : (data.fuel.unrefined || data.fuel.gas_giant) ? 'unrefined' : 'none'
      });
    }
  }

  return result;
}

/**
 * List all systems with their fuel availability.
 */
function listFuelStations() {
  const systems = sectorData.systems;
  const result = { refined: [], unrefined: [], gasGiant: [], none: [] };

  for (const [key, sys] of Object.entries(systems)) {
    if (sys.fuel.refined) result.refined.push(key);
    else if (sys.fuel.unrefined) result.unrefined.push(key);
    else if (sys.fuel.gas_giant) result.gasGiant.push(key);
    else result.none.push(key);
  }

  return result;
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node travel.js <from> <to> [--jump=N] [--fuel=refined|unrefined|any]');
    console.log('       node travel.js --compare <from> <to> [--jump=N]  # Compare safe vs direct routes');
    console.log('       node travel.js --distance <from> <to>');
    console.log('       node travel.js --reachable <from>');
    console.log('\nAvailable systems:', Object.keys(sectorData.systems).join(', '));
    process.exit(1);
  }

  // Handle special commands
  if (args[0] === '--distance' && args.length >= 3) {
    const dist = getDistance(args[1].toLowerCase(), args[2].toLowerCase());
    console.log(JSON.stringify({ from: args[1], to: args[2], parsecs: dist }, null, 2));
    process.exit(0);
  }

  if (args[0] === '--reachable' && args.length >= 2) {
    const result = listReachableFrom(args[1].toLowerCase());
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }

  if (args[0] === '--compare' && args.length >= 3) {
    const from = args[1].toLowerCase();
    const to = args[2].toLowerCase();
    let jumpRating = 1;
    for (const arg of args.slice(3)) {
      if (arg.startsWith('--jump=')) {
        jumpRating = parseInt(arg.split('=')[1], 10);
      }
    }
    const comparison = compareRoutes(from, to, jumpRating);
    console.log(JSON.stringify(comparison, null, 2));
    process.exit(0);
  }

  const from = args[0].toLowerCase();
  const to = args[1].toLowerCase();

  let jumpRating = 1;
  let fuelPreference = 'refined';

  for (const arg of args.slice(2)) {
    if (arg.startsWith('--jump=')) {
      jumpRating = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--fuel=')) {
      fuelPreference = arg.split('=')[1];
    }
  }

  const analysis = analyzeRoute(from, to, { jumpRating, fuelPreference });
  console.log(JSON.stringify(analysis, null, 2));
}

// Exports for use as module
module.exports = {
  sectorData,
  hexDistance,
  getReachableSystems,
  findShortestPath,
  findSafestPath,
  findDirectRoute,
  compareRoutes,
  calculateTravelTime,
  calculateFuelRisk,
  analyzeRoute,
  getDistance,
  listReachableFrom,
  listFuelStations
};
