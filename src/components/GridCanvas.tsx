import { motion } from 'framer-motion';
import { Agent } from '../types/agent';
import { useState, useEffect } from 'react';

interface GridCanvasProps {
  gridSize: number;
  obstacles: Set<string>;
  setObstacles: (obstacles: Set<string>) => void;
  agents: Agent[];
}

export default function GridCanvas({ gridSize, obstacles, setObstacles, agents }: GridCanvasProps) {
  const [agentTrails, setAgentTrails] = useState<Map<string, Array<{ x: number; y: number }>>>(new Map());

  // Track agent trails
  useEffect(() => {
    const newTrails = new Map(agentTrails);
    
    agents.forEach((agent) => {
      const trail = newTrails.get(agent.id) || [];
      trail.push({ x: agent.x, y: agent.y });
      
      // Keep only last 8 positions for trail
      if (trail.length > 8) {
        trail.shift();
      }
      
      newTrails.set(agent.id, trail);
    });

    setAgentTrails(newTrails);
  }, [agents]);

  const handleCellClick = (x: number, y: number, isRightClick: boolean) => {
    const key = `${x},${y}`;
    const newObstacles = new Set(obstacles);
    
    if (isRightClick) {
      newObstacles.delete(key);
    } else {
      newObstacles.add(key);
    }
    
    setObstacles(newObstacles);
  };

  return (
    <div className="flex-1 p-4 overflow-auto bg-[#0d0d0d]">
      <div
        className="grid gap-[1px] bg-gray-800 p-1 rounded-lg mx-auto relative"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          gridTemplateRows: `repeat(${gridSize}, 20px)`,
          maxWidth: 'fit-content',
        }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const x = idx % gridSize;
          const y = Math.floor(idx / gridSize);
          const key = `${x},${y}`;
          const isObstacle = obstacles.has(key);

          return (
            <div
              key={key}
              onClick={() => handleCellClick(x, y, false)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleCellClick(x, y, true);
              }}
              className={`relative w-5 h-5 cursor-pointer transition-colors ${
                isObstacle ? 'bg-gray-700' : 'bg-[#1a1a1a] hover:bg-gray-900'
              }`}
            />
          );
        })}

        {/* Render agent trails */}
        {agents.map((agent) => {
          const trail = agentTrails.get(agent.id) || [];
          return trail.map((pos, idx) => {
            const opacity = (idx + 1) / trail.length * 0.4; // Fade from 0 to 0.4
            return (
              <motion.div
                key={`${agent.id}-trail-${idx}`}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                exit={{ opacity: 0 }}
                className="absolute pointer-events-none rounded-full blur-sm"
                style={{
                  left: `${pos.x * 21 + 2}px`,
                  top: `${pos.y * 21 + 2}px`,
                  width: '16px',
                  height: '16px',
                  backgroundColor: agent.color,
                }}
              />
            );
          });
        })}

        {/* Render agents with glow */}
        {agents.map((agent) => (
          <motion.div
            key={agent.id}
            animate={{
              left: `${agent.x * 21 + 2}px`,
              top: `${agent.y * 21 + 2}px`,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="absolute pointer-events-none"
            style={{
              width: '16px',
              height: '16px',
            }}
          >
            {/* Outer glow */}
            <div
              className="absolute inset-0 rounded-full blur-md animate-pulse"
              style={{
                backgroundColor: agent.color,
                opacity: 0.6,
              }}
            />
            {/* Inner bright dot */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: agent.color,
                boxShadow: `0 0 10px ${agent.color}, 0 0 20px ${agent.color}`,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}