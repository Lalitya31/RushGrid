// Create a grid with cells
export function createGrid(width, height) {
  const cells = [];
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push({
        x,
        y,
        isWall: false,
        isStart: false,
        isEnd: false,
        weight: 1,
        traffic: 0,
        visited: false,
        inPath: false
      });
    }
    cells.push(row);
  }

  return { width, height, cells };
}

// Add random walls/obstacles to grid
export function addRandomWalls(grid, probability = 0.2) {
  const newGrid = JSON.parse(JSON.stringify(grid));
  
  for (let y = 0; y < newGrid.height; y++) {
    for (let x = 0; x < newGrid.width; x++) {
      if (Math.random() < probability) {
        newGrid.cells[y][x].isWall = true;
        newGrid.cells[y][x].weight = Infinity;
      }
    }
  }

  return newGrid;
}

// Calculate CO2 emissions based on path length and traffic
export function calculateCO2(path, trafficLevel = 1) {
  const baseEmission = 0.2; // kg CO2 per unit distance
  const pathLength = path.length;
  const trafficMultiplier = 1 + (trafficLevel - 1) * 0.5;
  
  return (pathLength * baseEmission * trafficMultiplier).toFixed(2);
}

// Generate predictive traffic heatmap
export function generateTrafficHeatmap(grid, agents = []) {
  const heatmap = {};
  
  // Base random traffic
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      const key = `${x},${y}`;
      heatmap[key] = Math.random() * 0.3;
    }
  }

  // Add traffic from agents
  agents.forEach(agent => {
    if (agent.path) {
      agent.path.forEach(node => {
        const key = `${node.x},${node.y}`;
        heatmap[key] = Math.min(1, (heatmap[key] || 0) + 0.2);
      });
    }
  });

  return heatmap;
}

// Auto-select best algorithm based on grid size and conditions
export function selectBestAlgorithm(grid, start, end, conditions = {}) {
  const { width, height } = grid;
  const gridSize = width * height;
  const distance = Math.abs(end.x - start.x) + Math.abs(end.y - start.y);

  // Emergency mode - use fastest
  if (conditions.emergency) {
    return 'Bi-A*';
  }

  // Small grids - Dijkstra is fine
  if (gridSize < 100) {
    return 'Dijkstra';
  }

  // Long distances - use Bidirectional A*
  if (distance > Math.max(width, height) * 0.7) {
    return 'Bi-A*';
  }

  // Dynamic traffic - use Dynamic A*
  if (conditions.dynamicTraffic) {
    return 'Dynamic A*';
  }

  // Default to A*
  return 'A*';
}

// Calculate algorithm performance metrics
export function calculateMetrics(result, startTime) {
  const endTime = performance.now();
  const executionTime = (endTime - startTime).toFixed(2);
  
  return {
    algorithm: result.algorithm,
    pathLength: result.path.length,
    nodesVisited: result.visited.length,
    executionTime: `${executionTime}ms`,
    efficiency: result.path.length > 0 
      ? (result.path.length / result.visited.length * 100).toFixed(1) + '%'
      : '0%'
  };
}

// Format time for display
export function formatTime(ms) {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

// Generate random color for agents
export function getAgentColor(index) {
  const colors = [
    '#DC0A2D', // Red Bull Red
    '#1E3A8A', // Red Bull Blue
    '#FDB913', // Red Bull Yellow
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Amber
  ];
  return colors[index % colors.length];
}
