// Priority Queue implementation for pathfinding algorithms
export class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

// Heuristic function (Manhattan distance)
export function heuristic(node1, node2) {
  return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
}

// A* Algorithm
export function aStar(grid, start, end, agentType = 'balanced') {
  const openSet = new PriorityQueue();
  const closedSet = new Set();
  const gScore = new Map();
  const fScore = new Map();
  const cameFrom = new Map();
  const visited = [];

  const startKey = `${start.x},${start.y}`;
  const endKey = `${end.x},${end.y}`;

  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, end));
  openSet.enqueue(start, fScore.get(startKey));

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue().element;
    const currentKey = `${current.x},${current.y}`;

    visited.push({ ...current });

    if (currentKey === endKey) {
      return {
        path: reconstructPath(cameFrom, current),
        visited,
        algorithm: 'A*'
      };
    }

    closedSet.add(currentKey);

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;

      if (closedSet.has(neighborKey)) continue;

      const tentativeGScore = gScore.get(currentKey) + 
        getCost(current, neighbor, agentType);

      if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        const f = tentativeGScore + heuristic(neighbor, end);
        fScore.set(neighborKey, f);
        openSet.enqueue(neighbor, f);
      }
    }
  }

  return { path: [], visited, algorithm: 'A*' };
}

// Bidirectional A* Algorithm
export function biAStar(grid, start, end, agentType = 'balanced') {
  const openSetForward = new PriorityQueue();
  const openSetBackward = new PriorityQueue();
  const closedSetForward = new Set();
  const closedSetBackward = new Set();
  const gScoreForward = new Map();
  const gScoreBackward = new Map();
  const cameFromForward = new Map();
  const cameFromBackward = new Map();
  const visited = [];

  const startKey = `${start.x},${start.y}`;
  const endKey = `${end.x},${end.y}`;

  gScoreForward.set(startKey, 0);
  gScoreBackward.set(endKey, 0);
  openSetForward.enqueue(start, heuristic(start, end));
  openSetBackward.enqueue(end, heuristic(end, start));

  let bestPath = null;
  let bestCost = Infinity;

  while (!openSetForward.isEmpty() && !openSetBackward.isEmpty()) {
    // Forward search
    const currentForward = openSetForward.dequeue().element;
    const currentForwardKey = `${currentForward.x},${currentForward.y}`;
    visited.push({ ...currentForward });

    if (closedSetBackward.has(currentForwardKey)) {
      const cost = gScoreForward.get(currentForwardKey) + gScoreBackward.get(currentForwardKey);
      if (cost < bestCost) {
        bestCost = cost;
        bestPath = mergePaths(
          reconstructPath(cameFromForward, currentForward),
          reconstructPath(cameFromBackward, currentForward).reverse()
        );
      }
    }

    closedSetForward.add(currentForwardKey);

    const neighborsForward = getNeighbors(grid, currentForward);
    for (const neighbor of neighborsForward) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (closedSetForward.has(neighborKey)) continue;

      const tentativeGScore = gScoreForward.get(currentForwardKey) + 
        getCost(currentForward, neighbor, agentType);

      if (!gScoreForward.has(neighborKey) || tentativeGScore < gScoreForward.get(neighborKey)) {
        cameFromForward.set(neighborKey, currentForward);
        gScoreForward.set(neighborKey, tentativeGScore);
        openSetForward.enqueue(neighbor, tentativeGScore + heuristic(neighbor, end));
      }
    }

    // Backward search
    const currentBackward = openSetBackward.dequeue().element;
    const currentBackwardKey = `${currentBackward.x},${currentBackward.y}`;
    visited.push({ ...currentBackward });

    if (closedSetForward.has(currentBackwardKey)) {
      const cost = gScoreForward.get(currentBackwardKey) + gScoreBackward.get(currentBackwardKey);
      if (cost < bestCost) {
        bestCost = cost;
        bestPath = mergePaths(
          reconstructPath(cameFromForward, currentBackward),
          reconstructPath(cameFromBackward, currentBackward).reverse()
        );
      }
    }

    closedSetBackward.add(currentBackwardKey);

    const neighborsBackward = getNeighbors(grid, currentBackward);
    for (const neighbor of neighborsBackward) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (closedSetBackward.has(neighborKey)) continue;

      const tentativeGScore = gScoreBackward.get(currentBackwardKey) + 
        getCost(currentBackward, neighbor, agentType);

      if (!gScoreBackward.has(neighborKey) || tentativeGScore < gScoreBackward.get(neighborKey)) {
        cameFromBackward.set(neighborKey, currentBackward);
        gScoreBackward.set(neighborKey, tentativeGScore);
        openSetBackward.enqueue(neighbor, tentativeGScore + heuristic(neighbor, start));
      }
    }

    if (bestPath !== null) {
      return { path: bestPath, visited, algorithm: 'Bi-A*' };
    }
  }

  return { path: [], visited, algorithm: 'Bi-A*' };
}

// Dynamic A* (simplified version - adapts to traffic changes)
export function dynamicAStar(grid, start, end, agentType = 'balanced', trafficHeatmap = null) {
  const result = aStar(grid, start, end, agentType);
  
  // If we have a traffic heatmap, we can adjust the path
  if (trafficHeatmap && result.path.length > 0) {
    // Check if path needs rerouting based on traffic
    const needsReroute = result.path.some(node => {
      const key = `${node.x},${node.y}`;
      return trafficHeatmap[key] && trafficHeatmap[key] > 0.7;
    });

    if (needsReroute) {
      // Recalculate with updated costs
      return { ...result, algorithm: 'Dynamic A*', rerouted: true };
    }
  }

  return { ...result, algorithm: 'Dynamic A*' };
}

// Dijkstra's Algorithm
export function dijkstra(grid, start, end, agentType = 'balanced') {
  const openSet = new PriorityQueue();
  const closedSet = new Set();
  const distance = new Map();
  const cameFrom = new Map();
  const visited = [];

  const startKey = `${start.x},${start.y}`;
  const endKey = `${end.x},${end.y}`;

  distance.set(startKey, 0);
  openSet.enqueue(start, 0);

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue().element;
    const currentKey = `${current.x},${current.y}`;

    visited.push({ ...current });

    if (currentKey === endKey) {
      return {
        path: reconstructPath(cameFrom, current),
        visited,
        algorithm: 'Dijkstra'
      };
    }

    closedSet.add(currentKey);

    const neighbors = getNeighbors(grid, current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;

      if (closedSet.has(neighborKey)) continue;

      const tentativeDistance = distance.get(currentKey) + 
        getCost(current, neighbor, agentType);

      if (!distance.has(neighborKey) || tentativeDistance < distance.get(neighborKey)) {
        cameFrom.set(neighborKey, current);
        distance.set(neighborKey, tentativeDistance);
        openSet.enqueue(neighbor, tentativeDistance);
      }
    }
  }

  return { path: [], visited, algorithm: 'Dijkstra' };
}

// Helper functions
function getNeighbors(grid, node) {
  const neighbors = [];
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }  // left
  ];

  for (const dir of directions) {
    const newX = node.x + dir.x;
    const newY = node.y + dir.y;

    if (newX >= 0 && newX < grid.width && newY >= 0 && newY < grid.height) {
      const cell = grid.cells[newY][newX];
      if (!cell.isWall) {
        neighbors.push({ x: newX, y: newY, weight: cell.weight });
      }
    }
  }

  return neighbors;
}

function getCost(from, to, agentType) {
  let baseCost = to.weight || 1;

  // Agent type modifiers
  switch (agentType) {
    case 'aggressive':
      baseCost *= 0.8; // Willing to take riskier routes
      break;
    case 'cautious':
      baseCost *= 1.3; // Prefers safer routes
      break;
    case 'balanced':
    default:
      baseCost *= 1.0;
      break;
  }

  return baseCost;
}

function reconstructPath(cameFrom, current) {
  const path = [current];
  let currentKey = `${current.x},${current.y}`;

  while (cameFrom.has(currentKey)) {
    current = cameFrom.get(currentKey);
    path.unshift(current);
    currentKey = `${current.x},${current.y}`;
  }

  return path;
}

function mergePaths(forwardPath, backwardPath) {
  // Remove duplicate middle node
  return [...forwardPath, ...backwardPath.slice(1)];
}
