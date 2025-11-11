import { motion } from 'framer-motion';
import { Agent } from '../types/agent';
import { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface Zone {
  x: { min: number; max: number };
  y: { min: number; max: number };
}

interface GridCanvasProps {
  gridSize: number;
  obstacles: Set<string>;
  setObstacles: (obstacles: Set<string>) => void;
  agents: Agent[];
  sourceZone: Zone;
  destinationZone: Zone;
  // optional selection mode and handler for clicking to set zones
  selectMode?: 'none' | 'source' | 'destination';
  onSelectCell?: (x: number, y: number) => void;
}

export default function GridCanvas({ gridSize, obstacles, setObstacles, agents, sourceZone, destinationZone, selectMode = 'none', onSelectCell }: GridCanvasProps) {
  const [agentTrails, setAgentTrails] = useState<Map<string, Array<{ x: number; y: number }>>>(new Map());
  const [hovered, setHovered] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const cellSize = 20;

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

  // Handle zoom with mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.5), 4));
  };

  // Handle panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2 || e.ctrlKey) { // Right click or Ctrl+left click for pan
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCellClick = (x: number, y: number, isRightClick: boolean) => {
    // If selection mode is active, use selection callback instead of toggling obstacles
    if (selectMode && selectMode !== 'none' && onSelectCell) {
      onSelectCell(x, y);
      return;
    }

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
    <div className="flex-1 p-4 overflow-hidden bg-[#0d0d0d] flex flex-col">
      {/* Zoom Controls */}
      <div className="mb-4 flex gap-2 items-center">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm flex items-center gap-1 transition"
          title="Zoom In (Scroll Up)"
        >
          <ZoomIn size={16} /> Zoom In
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm flex items-center gap-1 transition"
          title="Zoom Out (Scroll Down)"
        >
          <ZoomOut size={16} /> Zoom Out
        </button>
        <button
          onClick={handleResetView}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm flex items-center gap-1 transition"
          title="Reset View"
        >
          <RotateCcw size={16} /> Reset
        </button>
        <span className="text-gray-400 text-sm ml-auto">Zoom: {(zoom * 100).toFixed(0)}%</span>
        <span className="text-gray-500 text-xs">| Scroll: Zoom | Middle-click: Pan</span>
      </div>

      {/* Legend */}
      <div className="mb-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-900 rounded"></div>
          <span className="text-gray-300">Source Zone</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-900 rounded"></div>
          <span className="text-gray-300">Destination Zone</span>
        </div>
      </div>

      {/* Grid Container with Zoom & Pan */}
      <div
        ref={gridContainerRef}
        className="flex-1 overflow-auto bg-gray-900 rounded-lg relative"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div
          className="grid gap-[1px] bg-gray-800 p-1 rounded-lg mx-auto relative inline-block"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            cursor: isPanning ? 'grabbing' : selectMode && selectMode !== 'none' ? 'crosshair' : 'default',
          }}
      >
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => {
          const x = idx % gridSize;
          const y = Math.floor(idx / gridSize);
          const key = `${x},${y}`;
          const isObstacle = obstacles.has(key);
          
          // Check if cell is in source or destination zone
          const isSourceZone = x >= sourceZone.x.min && x <= sourceZone.x.max && 
                               y >= sourceZone.y.min && y <= sourceZone.y.max;
          const isDestinationZone = x >= destinationZone.x.min && x <= destinationZone.x.max && 
                                   y >= destinationZone.y.min && y <= destinationZone.y.max;

          return (
            <div
              key={key}
              onClick={() => handleCellClick(x, y, false)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleCellClick(x, y, true);
              }}
              onMouseEnter={() => setHovered({ x, y })}
              onMouseLeave={() => setHovered(null)}
              className={`relative w-5 h-5 ${selectMode && selectMode !== 'none' ? 'cursor-crosshair' : 'cursor-pointer'} transition-colors ${
                isObstacle 
                  ? 'bg-gray-700' 
                  : isSourceZone 
                  ? 'bg-green-900 hover:bg-green-800' 
                  : isDestinationZone 
                  ? 'bg-purple-900 hover:bg-purple-800' 
                  : 'bg-[#1a1a1a] hover:bg-gray-900'
              }`}
            />
          );
        })}

        {/* Hover preview for select mode */}
        {selectMode && selectMode !== 'none' && hovered && (
          <div
            className="pointer-events-none"
            style={{
              left: `${hovered.x * 21 + 1}px`,
              top: `${hovered.y * 21 + 1}px`,
              width: '20px',
              height: '20px',
              position: 'absolute',
              border: `2px solid ${selectMode === 'source' ? '#34D399' : '#A78BFA'}`,
              boxSizing: 'border-box',
            }}
          />
        )}

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
    </div>
  );
}