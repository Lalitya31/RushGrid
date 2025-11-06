import { useEffect, useRef, useState } from 'react';

interface Agent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: Array<{ x: number; y: number }>;
  destinationX: number;
  destinationY: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GridCanvasProps {
  isPaused: boolean;
}

export default function GridCanvas({ isPaused }: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    if (agents.length === 0) {
      const newAgents: Agent[] = Array.from({ length: 4 }, () => ({
        x: Math.random() * canvas.width * 0.7 + canvas.width * 0.15,
        y: Math.random() * canvas.height * 0.7 + canvas.height * 0.15,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        trail: [],
        destinationX: Math.random() * canvas.width,
        destinationY: Math.random() * canvas.height,
      }));
      setAgents(newAgents);
    }
  }, [agents.length]);

  const isColliding = (x: number, y: number, radius: number): boolean => {
    return obstacles.some(obs => {
      return (
        x + radius > obs.x &&
        x - radius < obs.x + obs.width &&
        y + radius > obs.y &&
        y - radius < obs.y + obs.height
      );
    });
  };

  const getAvoidanceVector = (x: number, y: number): { x: number; y: number } => {
    let avoidX = 0;
    let avoidY = 0;

    obstacles.forEach(obs => {
      const centerX = obs.x + obs.width / 2;
      const centerY = obs.y + obs.height / 2;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        avoidX += (dx / distance) * force;
        avoidY += (dy / distance) * force;
      }
    });

    return { x: avoidX, y: avoidY };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newObstacle: Obstacle = {
      x: x - 20,
      y: y - 20,
      width: 40,
      height: 40,
    };

    setObstacles([...obstacles, newObstacle]);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = () => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(213, 0, 50, 0.3)';
      ctx.strokeStyle = '#d50032';
      ctx.lineWidth = 2;
      obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);
      });

      if (!isPaused) {
        setAgents(prevAgents =>
          prevAgents.map(agent => {
            const avoidance = getAvoidanceVector(agent.x, agent.y);
            let newVx = agent.vx + avoidance.x * 0.1;
            let newVy = agent.vy + avoidance.y * 0.1;

            let newX = agent.x + newVx;
            let newY = agent.y + newVy;

            if (newX < 20 || newX > canvas.width - 20) {
              newVx *= -1;
            }
            if (newY < 20 || newY > canvas.height - 20) {
              newVy *= -1;
            }

            newX = Math.max(20, Math.min(canvas.width - 20, newX));
            newY = Math.max(20, Math.min(canvas.height - 20, newY));

            if (isColliding(newX, newY, 8)) {
              newVx *= -0.5;
              newVy *= -0.5;
              newX = agent.x;
              newY = agent.y;
            }

            const newTrail = [...agent.trail, { x: agent.x, y: agent.y }];
            if (newTrail.length > 50) {
              newTrail.shift();
            }

            return { ...agent, x: newX, y: newY, vx: newVx, vy: newVy, trail: newTrail };
          })
        );
      }

      agents.forEach(agent => {
        ctx.strokeStyle = 'rgba(213, 0, 50, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        agent.trail.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();

        ctx.fillStyle = '#d50032';
        ctx.beginPath();
        ctx.arc(agent.x, agent.y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(213, 0, 50, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(agent.destinationX, agent.destinationY, 5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(213, 0, 50, 0.2)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(agent.x, agent.y);
        ctx.lineTo(agent.destinationX, agent.destinationY);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPaused, agents, obstacles]);

  return (
    <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
      <div className="w-full h-full relative">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          className={`w-full h-full border-2 border-accent-red rounded-lg shadow-glow-red bg-bg-card ${
            isDrawingMode ? 'cursor-crosshair' : 'cursor-default'
          }`}
        />
        {isDrawingMode && (
          <div className="absolute bottom-4 left-4 text-sm text-accent-red bg-bg-card px-3 py-1 rounded">
            Click to add traffic blocks • Press ESC to exit
          </div>
        )}
      </div>
    </div>
  );
}