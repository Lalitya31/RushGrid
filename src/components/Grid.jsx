import { useEffect, useRef } from 'react';

function Grid({ 
  grid, 
  path, 
  visited, 
  start, 
  end, 
  onCellClick,
  trafficHeatmap,
  agents = []
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!grid || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const cellSize = Math.min(
      Math.floor(canvas.width / grid.width),
      Math.floor(canvas.height / grid.height)
    );

    // Clear canvas
    ctx.fillStyle = '#0A0E27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid cells
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const cell = grid.cells[y][x];
        const posX = x * cellSize;
        const posY = y * cellSize;

        // Determine cell color
        let color = '#1A1F3A'; // Default dark

        if (cell.isWall) {
          color = '#4B5563'; // Gray for walls
        } else if (trafficHeatmap && trafficHeatmap[`${x},${y}`]) {
          const intensity = trafficHeatmap[`${x},${y}`];
          const red = Math.floor(220 * intensity);
          const alpha = 0.3 + intensity * 0.7;
          color = `rgba(${red}, 10, 45, ${alpha})`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(posX, posY, cellSize - 1, cellSize - 1);
      }
    }

    // Draw visited cells
    if (visited && visited.length > 0) {
      ctx.fillStyle = 'rgba(30, 58, 138, 0.3)'; // Blue tint
      visited.forEach(node => {
        const posX = node.x * cellSize;
        const posY = node.y * cellSize;
        ctx.fillRect(posX, posY, cellSize - 1, cellSize - 1);
      });
    }

    // Draw path
    if (path && path.length > 0) {
      ctx.strokeStyle = '#FDB913'; // Yellow
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      path.forEach((node, i) => {
        const posX = node.x * cellSize + cellSize / 2;
        const posY = node.y * cellSize + cellSize / 2;
        
        if (i === 0) {
          ctx.moveTo(posX, posY);
        } else {
          ctx.lineTo(posX, posY);
        }
      });
      
      ctx.stroke();
    }

    // Draw agent paths
    agents.forEach((agent, idx) => {
      if (agent.path && agent.path.length > 0) {
        const colors = ['#DC0A2D', '#10B981', '#8B5CF6', '#F59E0B'];
        ctx.strokeStyle = colors[idx % colors.length];
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        agent.path.forEach((node, i) => {
          const posX = node.x * cellSize + cellSize / 2;
          const posY = node.y * cellSize + cellSize / 2;
          
          if (i === 0) {
            ctx.moveTo(posX, posY);
          } else {
            ctx.lineTo(posX, posY);
          }
        });
        
        ctx.stroke();
      }
    });

    // Draw start point
    if (start) {
      ctx.fillStyle = '#10B981'; // Green
      const posX = start.x * cellSize + cellSize / 2;
      const posY = start.y * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(posX, posY, cellSize / 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw end point
    if (end) {
      ctx.fillStyle = '#DC0A2D'; // Red
      const posX = end.x * cellSize + cellSize / 2;
      const posY = end.y * cellSize + cellSize / 2;
      ctx.beginPath();
      ctx.arc(posX, posY, cellSize / 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= grid.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, grid.height * cellSize);
      ctx.stroke();
    }
    for (let y = 0; y <= grid.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(grid.width * cellSize, y * cellSize);
      ctx.stroke();
    }

  }, [grid, path, visited, start, end, trafficHeatmap, agents]);

  const handleCanvasClick = (e) => {
    if (!grid || !canvasRef.current || !onCellClick) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const cellSize = Math.min(
      Math.floor(canvas.width / grid.width),
      Math.floor(canvas.height / grid.height)
    );

    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);

    if (x >= 0 && x < grid.width && y >= 0 && y < grid.height) {
      onCellClick(x, y);
    }
  };

  return (
    <div className="bg-dark-card rounded-lg p-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        onClick={handleCanvasClick}
        className="border border-redbull-blue rounded cursor-pointer"
      />
    </div>
  );
}

export default Grid;
