import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, UserPlus, AlertTriangle, RotateCcw } from 'lucide-react';
import GridCanvas from '../components/GridCanvas';
import MetricsSidebar from '../components/MetricsSidebar';
import RushBotPanel from '../components/RushBotPanel';
import { Agent, Algorithm } from '../types/agent';
import { aStar, biAStar, dynamicAStar } from '../utils/pathfinding';

const GRID_SIZE = 30;

export default function Simulation() {
  const [isPaused, setIsPaused] = useState(false);
  const [obstacles, setObstacles] = useState<Set<string>>(new Set());
  const [agents, setAgents] = useState<Agent[]>([]);
  const [emergencyAgentId, setEmergencyAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Array<{ from: 'bot' | 'user'; text: string }>>([
    { from: 'bot', text: "Hey! I'm RushBot! Click 'Spawn Agent' to add moving dots, or click grid cells to add obstacles!" },
  ]);

  // Spawn agent with random algorithm
  const spawnAgent = useCallback((algorithm?: Algorithm, isEmergency = false, isManualSpawn = false) => {
    const algorithms: Algorithm[] = ['A*', 'Bi-A*', 'Dynamic A*'];
    const selectedAlgo = algorithm || algorithms[Math.floor(Math.random() * algorithms.length)];
    
    const algorithmColors = {
      'A*': '#d50032', // red
      'Bi-A*': '#3b4cca', // blue
      'Dynamic A*': '#cccccc', // white
    };

    const startX = Math.floor(Math.random() * GRID_SIZE);
    const startY = Math.floor(Math.random() * GRID_SIZE);
    const targetX = Math.floor(Math.random() * GRID_SIZE);
    const targetY = Math.floor(Math.random() * GRID_SIZE);

    const pathfinder = selectedAlgo === 'A*' ? aStar : selectedAlgo === 'Bi-A*' ? biAStar : dynamicAStar;
    const result = pathfinder({ x: startX, y: startY }, { x: targetX, y: targetY }, GRID_SIZE, obstacles);

    // Yellow for manual spawn, cyan for emergency, algorithm color otherwise
    let agentColor = algorithmColors[selectedAlgo];
    if (isEmergency) {
      agentColor = '#00ffff'; // cyan for emergency
    } else if (isManualSpawn) {
      agentColor = '#fbbf24'; // yellow for manual spawn
    }

    const newAgent: Agent = {
      id: `agent-${Date.now()}-${Math.random()}`,
      x: startX,
      y: startY,
      targetX,
      targetY,
      path: result.path.slice(1),
      algorithm: selectedAlgo,
      isEmergency,
      color: agentColor,
      pathCost: result.cost,
      nodesExplored: result.nodesExplored,
      startTime: Date.now(),
    };

    setAgents((prev) => [...prev, newAgent]);
    setMessages((prev) => [
      ...prev,
      { from: 'bot', text: `🎯 Agent spawned using ${selectedAlgo}! Moving from (${startX},${startY}) to (${targetX},${targetY}). Path length: ${result.path.length}` },
    ]);

    return newAgent.id;
  }, [obstacles]);

  // Emergency mode
  const activateEmergency = useCallback(() => {
    const agentId = spawnAgent('A*', true, false);
    setEmergencyAgentId(agentId);
    setMessages((prev) => [...prev, { from: 'bot', text: '🚨 Emergency mode activated! Priority agent dispatched!' }]);
  }, [spawnAgent]);

  // Reset simulation
  const resetSimulation = useCallback(() => {
    setAgents([]);
    setObstacles(new Set());
    setEmergencyAgentId(null);
    setIsPaused(false);
    setMessages((prev) => [...prev, { from: 'bot', text: '✅ Simulation reset! Grid cleared and ready.' }]);
  }, []);

  // Recalculate paths when obstacles change
  useEffect(() => {
    if (obstacles.size === 0) return;

    setAgents((prev) =>
      prev.map((agent) => {
        // Recalculate path from current position to target
        const pathfinder = agent.algorithm === 'A*' ? aStar : agent.algorithm === 'Bi-A*' ? biAStar : dynamicAStar;
        const result = pathfinder({ x: agent.x, y: agent.y }, { x: agent.targetX, y: agent.targetY }, GRID_SIZE, obstacles);
        
        if (result.path.length > 0) {
          setMessages((prev) => [
            ...prev,
            { from: 'bot', text: `⚡ Agent ${agent.id.slice(0, 8)} rerouting using ${agent.algorithm} due to obstacle change!` },
          ]);
        }

        return { 
          ...agent, 
          path: result.path.slice(1), // Remove current position
          pathCost: result.cost, 
          nodesExplored: result.nodesExplored 
        };
      })
    );
  }, [obstacles]);

  // Move agents along path (animation loop)
  useEffect(() => {
    if (isPaused || agents.length === 0) return;

    const interval = setInterval(() => {
      setAgents((prev) =>
        prev.map((agent) => {
          // If path is empty, agent reached destination
          if (agent.path.length === 0) {
            // Generate new random target and path
            const targetX = Math.floor(Math.random() * GRID_SIZE);
            const targetY = Math.floor(Math.random() * GRID_SIZE);
            const pathfinder = agent.algorithm === 'A*' ? aStar : agent.algorithm === 'Bi-A*' ? biAStar : dynamicAStar;
            const result = pathfinder({ x: agent.x, y: agent.y }, { x: targetX, y: targetY }, GRID_SIZE, obstacles);

            return {
              ...agent,
              targetX,
              targetY,
              path: result.path.slice(1),
              pathCost: result.cost,
              nodesExplored: result.nodesExplored,
            };
          }

          // Move to next position in path
          const nextPos = agent.path[0];
          const newPath = agent.path.slice(1);

          return { 
            ...agent, 
            x: nextPos.x, 
            y: nextPos.y, 
            path: newPath 
          };
        })
      );
    }, 300); // Move every 300ms

    return () => clearInterval(interval);
  }, [isPaused, agents.length, obstacles]);

  // Spawn initial agents on mount
  useEffect(() => {
    // Spawn 3 initial agents with algorithm colors (not yellow)
    setTimeout(() => spawnAgent('A*', false, false), 100);
    setTimeout(() => spawnAgent('Bi-A*', false, false), 200);
    setTimeout(() => spawnAgent('Dynamic A*', false, false), 300);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex flex-col">
      {/* Top Nav */}
      <nav className="flex items-center justify-between px-8 py-3 bg-black border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-[#d50032] px-3 py-2 rounded-lg">
            <span className="font-display font-bold text-white text-lg">RG</span>
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-white">RushGrid</h1>
            <span className="text-xs text-gray-400">PathFuel Engine v1.0</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-sm">{isPaused ? 'Resume' : 'Pause'}</span>
          </button>
          <button 
            onClick={() => spawnAgent(undefined, false, true)} 
            className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition"
          >
            <UserPlus className="w-4 h-4" />
            <span className="text-sm">Spawn Agent</span>
          </button>
          <button onClick={activateEmergency} className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Emergency</span>
          </button>
          <button onClick={resetSimulation} className="px-3 py-2 text-white hover:bg-gray-800 rounded-lg flex items-center gap-2 transition">
            <RotateCcw className="w-4 h-4" />
            <span className="text-sm">Reset</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <GridCanvas
          gridSize={GRID_SIZE}
          obstacles={obstacles}
          setObstacles={setObstacles}
          agents={agents}
        />
        <MetricsSidebar agents={agents} />
      </div>

      <RushBotPanel
        messages={messages}
        onSendMessage={(msg) => {
          setMessages((prev) => [...prev, { from: 'user', text: msg }]);
          
          const lowerMsg = msg.toLowerCase();
          
          if (lowerMsg.includes('spawn') || lowerMsg.includes('agent')) {
            spawnAgent();
          } else if (lowerMsg.includes('emergency')) {
            activateEmergency();
          } else if (lowerMsg.includes('reset')) {
            resetSimulation();
          } else if (lowerMsg.includes('pause')) {
            setIsPaused(true);
            setMessages((prev) => [...prev, { from: 'bot', text: '⏸️ Simulation paused!' }]);
          } else if (lowerMsg.includes('resume') || lowerMsg.includes('play')) {
            setIsPaused(false);
            setMessages((prev) => [...prev, { from: 'bot', text: '▶️ Simulation resumed!' }]);
          } else {
            setMessages((prev) => [...prev, { from: 'bot', text: '💡 Try: "spawn agent", "emergency", "reset", "pause", or "resume"!' }]);
          }
        }}
      />
    </div>
  );
}