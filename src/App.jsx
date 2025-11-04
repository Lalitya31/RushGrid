import { useState, useEffect } from 'react';
import Grid from './components/Grid';
import RushBot from './components/RushBot';
import { ControlPanel, Statistics, HeatmapLegend } from './components/Controls';
import { aStar, biAStar, dynamicAStar, dijkstra } from './algorithms/pathfinding';
import { ContractionHierarchies, Landmarks } from './algorithms/optimizations';
import { 
  createGrid, 
  addRandomWalls, 
  calculateCO2, 
  generateTrafficHeatmap,
  selectBestAlgorithm,
  calculateMetrics
} from './utils/gridHelpers';

function App() {
  const [grid, setGrid] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);
  const [visited, setVisited] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('A*');
  const [agentType, setAgentType] = useState('balanced');
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [autoSwitch, setAutoSwitch] = useState(false);
  const [trafficHeatmap, setTrafficHeatmap] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [co2, setCo2] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [agents, setAgents] = useState([]);

  // Initialize grid
  useEffect(() => {
    const newGrid = createGrid(30, 30);
    setGrid(newGrid);
    setStart({ x: 2, y: 2 });
    setEnd({ x: 27, y: 27 });

    // Initialize optimizations (CH and Landmarks for future micro-queries)
    new ContractionHierarchies(newGrid);
    new Landmarks(newGrid);

    // Generate initial heatmap
    setTrafficHeatmap(generateTrafficHeatmap(newGrid));
  }, []);

  // Update heatmap periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (grid) {
        setTrafficHeatmap(generateTrafficHeatmap(grid, agents));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [grid, agents]);

  const handleCellClick = (x, y) => {
    if (!grid) return;

    // If shift key, set as wall
    if (grid.cells[y][x].isWall) {
      const newGrid = { ...grid };
      newGrid.cells[y][x].isWall = false;
      setGrid(newGrid);
    } else if (!start) {
      setStart({ x, y });
    } else if (!end) {
      setEnd({ x, y });
    } else {
      setStart({ x, y });
      setEnd(null);
      setPath([]);
      setVisited([]);
    }
  };

  const runAlgorithm = () => {
    if (!grid || !start || !end) return;

    const startTime = performance.now();

    let algorithm = selectedAlgorithm;
    
    // Auto-select best algorithm if enabled
    if (autoSwitch) {
      algorithm = selectBestAlgorithm(grid, start, end, {
        emergency: emergencyMode,
        dynamicTraffic: trafficHeatmap !== null
      });
      setSelectedAlgorithm(algorithm);
    }

    let result;

    switch (algorithm) {
      case 'Bi-A*':
        result = biAStar(grid, start, end, agentType);
        break;
      case 'Dynamic A*':
        result = dynamicAStar(grid, start, end, agentType, trafficHeatmap);
        break;
      case 'Dijkstra':
        result = dijkstra(grid, start, end, agentType);
        break;
      case 'A*':
      default:
        result = aStar(grid, start, end, agentType);
        break;
    }

    setPath(result.path);
    setVisited(result.visited);

    // Calculate metrics
    const performanceMetrics = calculateMetrics(result, startTime);
    setMetrics(performanceMetrics);

    // Calculate CO2
    const emissions = calculateCO2(result.path, 1.5);
    setCo2(emissions);

    // Update leaderboard
    updateLeaderboard(performanceMetrics);
  };

  const updateLeaderboard = (newMetrics) => {
    const entry = {
      algorithm: newMetrics.algorithm,
      time: newMetrics.executionTime,
      timestamp: Date.now()
    };

    const updated = [...leaderboard, entry]
      .sort((a, b) => parseFloat(a.time) - parseFloat(b.time))
      .slice(0, 5);

    setLeaderboard(updated);
  };

  const handleClear = () => {
    if (!grid) return;
    const newGrid = createGrid(30, 30);
    setGrid(newGrid);
    setPath([]);
    setVisited([]);
    setMetrics(null);
    setCo2(null);
    setAgents([]);
  };

  const handleAddWalls = () => {
    if (!grid) return;
    const newGrid = addRandomWalls(grid, 0.2);
    setGrid(newGrid);
    setPath([]);
    setVisited([]);
  };

  const handleBotCommand = (command) => {
    switch (command.type) {
      case 'run':
        setSelectedAlgorithm(command.algorithm || 'A*');
        setTimeout(runAlgorithm, 100);
        break;
      case 'clear':
        handleClear();
        break;
      case 'addWalls':
        handleAddWalls();
        break;
      case 'setAgent':
        setAgentType(command.agentType);
        break;
      case 'emergency':
        setEmergencyMode(command.value);
        break;
      case 'scenario':
        loadScenario(command.scenario);
        break;
      default:
        break;
    }
  };

  const loadScenario = (scenario) => {
    switch (scenario) {
      case 'rush hour':
      case 'heavy traffic': {
        // Generate heavy traffic
        const heavyHeatmap = {};
        for (let y = 0; y < grid.height; y++) {
          for (let x = 0; x < grid.width; x++) {
            heavyHeatmap[`${x},${y}`] = Math.random() * 0.8 + 0.2;
          }
        }
        setTrafficHeatmap(heavyHeatmap);
        break;
      }
      case 'clear roads':
        setTrafficHeatmap({});
        break;
      case 'multi-agent': {
        // Create multiple agents
        const newAgents = [
          { id: 1, start: { x: 2, y: 2 }, end: { x: 27, y: 27 }, type: 'aggressive' },
          { id: 2, start: { x: 27, y: 2 }, end: { x: 2, y: 27 }, type: 'cautious' },
          { id: 3, start: { x: 15, y: 2 }, end: { x: 15, y: 27 }, type: 'balanced' }
        ];
        
        // Calculate paths for all agents
        newAgents.forEach(agent => {
          const result = aStar(grid, agent.start, agent.end, agent.type);
          agent.path = result.path;
        });
        
        setAgents(newAgents);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="bg-dark-card border-b border-redbull-red">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-orbitron font-black text-redbull-red">
                RushGrid
              </h1>
              <p className="text-sm font-inter text-gray-400 mt-1">
                Adaptive Multi-Agent Traffic Simulator
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-inter text-gray-400">Powered by</div>
                <div className="text-sm font-orbitron font-bold text-redbull-yellow">
                  A* • Bi-A* • Dynamic A*
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:col-span-3 space-y-6">
            <ControlPanel
              selectedAlgorithm={selectedAlgorithm}
              agentType={agentType}
              emergencyMode={emergencyMode}
              autoSwitch={autoSwitch}
              onAlgorithmChange={setSelectedAlgorithm}
              onAgentTypeChange={setAgentType}
              onRun={runAlgorithm}
              onClear={handleClear}
              onAddWalls={handleAddWalls}
              onToggleEmergency={() => setEmergencyMode(!emergencyMode)}
              onAutoSwitch={() => setAutoSwitch(!autoSwitch)}
            />
            <HeatmapLegend />
          </div>

          {/* Center - Grid */}
          <div className="lg:col-span-6">
            {grid && (
              <Grid
                grid={grid}
                path={path}
                visited={visited}
                start={start}
                end={end}
                onCellClick={handleCellClick}
                trafficHeatmap={trafficHeatmap}
                agents={agents}
              />
            )}
            <div className="mt-4 p-4 bg-dark-card rounded-lg">
              <p className="text-sm font-inter text-gray-300 text-center">
                💡 Click to set start (green) and end (red) points. 
                {emergencyMode && <span className="text-redbull-red ml-2 animate-pulse">🚨 EMERGENCY MODE ACTIVE</span>}
              </p>
            </div>
          </div>

          {/* Right Sidebar - Stats & RushBot */}
          <div className="lg:col-span-3 space-y-6">
            <Statistics
              metrics={metrics}
              co2={co2}
              leaderboard={leaderboard}
            />
          </div>
        </div>

        {/* RushBot - Full Width Bottom */}
        <div className="mt-6">
          <div className="h-96">
            <RushBot 
              onCommand={handleBotCommand}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-redbull-blue mt-8 py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-inter text-gray-400">
            Built with Vite + React + Tailwind CSS • Chart.js Visualizations
          </p>
          <p className="text-xs font-inter text-gray-500 mt-1">
            Featuring: A*, Bi-A*, Dynamic A*, Dijkstra • CH + Landmarks • Multi-Agent Simulation
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
