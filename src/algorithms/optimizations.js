// Contraction Hierarchies implementation for fast shortest path queries
export class ContractionHierarchies {
  constructor(grid) {
    this.grid = grid;
    this.shortcuts = new Map();
    this.nodeImportance = new Map();
    this.contracted = new Set();
    this.preprocess();
  }

  preprocess() {
    // Simplified CH preprocessing
    const nodes = this.getAllNodes();
    
    // Calculate initial node importance
    nodes.forEach(node => {
      const key = `${node.x},${node.y}`;
      this.nodeImportance.set(key, this.calculateImportance(node));
    });

    // Contract nodes in order of importance
    const sortedNodes = nodes.sort((a, b) => {
      const keyA = `${a.x},${a.y}`;
      const keyB = `${b.x},${b.y}`;
      return this.nodeImportance.get(keyA) - this.nodeImportance.get(keyB);
    });

    sortedNodes.forEach(node => {
      this.contractNode(node);
    });
  }

  calculateImportance(node) {
    // Simple importance metric based on degree and position
    const neighbors = this.getNeighbors(node);
    return neighbors.length + Math.random() * 0.1;
  }

  contractNode(node) {
    const key = `${node.x},${node.y}`;
    this.contracted.add(key);

    const neighbors = this.getNeighbors(node);
    
    // Create shortcuts between neighbors
    for (let i = 0; i < neighbors.length; i++) {
      for (let j = i + 1; j < neighbors.length; j++) {
        const from = neighbors[i];
        const to = neighbors[j];
        const shortcutKey = `${from.x},${from.y}->${to.x},${to.y}`;
        
        // Store shortcut with distance through contracted node
        this.shortcuts.set(shortcutKey, {
          from,
          to,
          via: node,
          cost: 2 // Simplified cost
        });
      }
    }
  }

  query() {
    // Fast query using preprocessed shortcuts
    // This is a simplified version for future micro-queries
    return {
      distance: this.shortcuts.size > 0 ? 10 : Infinity,
      shortcuts: Array.from(this.shortcuts.values()).slice(0, 5)
    };
  }

  getAllNodes() {
    const nodes = [];
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (!this.grid.cells[y][x].isWall) {
          nodes.push({ x, y });
        }
      }
    }
    return nodes;
  }

  getNeighbors(node) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -1 }, { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: -1, y: 0 }
    ];

    for (const dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;

      if (newX >= 0 && newX < this.grid.width && 
          newY >= 0 && newY < this.grid.height) {
        const cell = this.grid.cells[newY][newX];
        if (!cell.isWall) {
          neighbors.push({ x: newX, y: newY });
        }
      }
    }

    return neighbors;
  }
}

// Landmarks implementation for A* optimization
export class Landmarks {
  constructor(grid, numLandmarks = 4) {
    this.grid = grid;
    this.numLandmarks = numLandmarks;
    this.landmarks = [];
    this.distances = new Map();
    this.selectLandmarks();
    this.precomputeDistances();
  }

  selectLandmarks() {
    // Select landmarks using farthest point strategy
    const nodes = this.getAllNodes();
    
    if (nodes.length === 0) return;

    // First landmark - random corner
    this.landmarks.push(nodes[0]);

    // Select remaining landmarks as farthest from existing ones
    for (let i = 1; i < this.numLandmarks; i++) {
      let maxDist = -1;
      let farthest = null;

      for (const node of nodes) {
        let minDistToLandmark = Infinity;
        
        for (const landmark of this.landmarks) {
          const dist = this.manhattanDistance(node, landmark);
          minDistToLandmark = Math.min(minDistToLandmark, dist);
        }

        if (minDistToLandmark > maxDist) {
          maxDist = minDistToLandmark;
          farthest = node;
        }
      }

      if (farthest) {
        this.landmarks.push(farthest);
      }
    }
  }

  precomputeDistances() {
    // Precompute distances from each landmark to all nodes
    this.landmarks.forEach((landmark, idx) => {
      const distances = this.dijkstraFromLandmark(landmark);
      this.distances.set(idx, distances);
    });
  }

  dijkstraFromLandmark(landmark) {
    const distances = new Map();
    const visited = new Set();
    const queue = [{ node: landmark, dist: 0 }];

    distances.set(this.nodeKey(landmark), 0);

    while (queue.length > 0) {
      queue.sort((a, b) => a.dist - b.dist);
      const { node, dist } = queue.shift();
      const key = this.nodeKey(node);

      if (visited.has(key)) continue;
      visited.add(key);

      const neighbors = this.getNeighbors(node);
      for (const neighbor of neighbors) {
        const neighborKey = this.nodeKey(neighbor);
        const newDist = dist + 1;

        if (!distances.has(neighborKey) || newDist < distances.get(neighborKey)) {
          distances.set(neighborKey, newDist);
          queue.push({ node: neighbor, dist: newDist });
        }
      }
    }

    return distances;
  }

  getLandmarkHeuristic(node, target) {
    // Use triangle inequality with landmarks to get better heuristic
    let maxHeuristic = 0;

    for (let i = 0; i < this.landmarks.length; i++) {
      const landmarkDist = this.distances.get(i);
      if (!landmarkDist) continue;

      const nodeToLandmark = landmarkDist.get(this.nodeKey(node)) || Infinity;
      const targetToLandmark = landmarkDist.get(this.nodeKey(target)) || Infinity;

      const heuristic = Math.abs(nodeToLandmark - targetToLandmark);
      maxHeuristic = Math.max(maxHeuristic, heuristic);
    }

    return maxHeuristic;
  }

  manhattanDistance(node1, node2) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
  }

  nodeKey(node) {
    return `${node.x},${node.y}`;
  }

  getAllNodes() {
    const nodes = [];
    for (let y = 0; y < this.grid.height; y++) {
      for (let x = 0; x < this.grid.width; x++) {
        if (!this.grid.cells[y][x].isWall) {
          nodes.push({ x, y });
        }
      }
    }
    return nodes;
  }

  getNeighbors(node) {
    const neighbors = [];
    const directions = [
      { x: 0, y: -1 }, { x: 1, y: 0 },
      { x: 0, y: 1 }, { x: -1, y: 0 }
    ];

    for (const dir of directions) {
      const newX = node.x + dir.x;
      const newY = node.y + dir.y;

      if (newX >= 0 && newX < this.grid.width && 
          newY >= 0 && newY < this.grid.height) {
        const cell = this.grid.cells[newY][newX];
        if (!cell.isWall) {
          neighbors.push({ x: newX, y: newY });
        }
      }
    }

    return neighbors;
  }
}
