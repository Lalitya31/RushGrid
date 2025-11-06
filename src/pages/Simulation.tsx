import { useState, useRef } from 'react';
import TopNav from '../components/TopNav';
import GridCanvas from '../components/GridCanvas';
import AnalyticsSidebar from '../components/AnalyticsSidebar';
import RushBotPanel from '../components/RushBotPanel';

export default function Simulation() {
  const [isPaused, setIsPaused] = useState(false);
  const [agentCount, setAgentCount] = useState(4);
  const gridCanvasRef = useRef<HTMLDivElement>(null);

  const handleAddTraffic = (active: boolean) => {
    if (active) {
      alert('Click on the grid to place traffic blocks. Press ESC to exit.');
    }
  };

  const handleSpawnAgent = () => {
    setAgentCount(agentCount + 1);
    alert(`New agent spawned! Total: ${agentCount + 1}`);
  };

  const handleEmergency = () => {
    alert('Emergency vehicle dispatched! Priority routing activated.');
  };

  const handleReset = () => {
    setAgentCount(4);
    setIsPaused(false);
    alert('Simulation reset!');
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <TopNav
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        onAddTraffic={handleAddTraffic}
        onSpawnAgent={handleSpawnAgent}
        onEmergency={handleEmergency}
        onReset={handleReset}
      />
      <div className="flex flex-1 overflow-hidden">
        <div ref={gridCanvasRef} className="flex-1">
          <GridCanvas isPaused={isPaused} />
        </div>
        <AnalyticsSidebar />
      </div>
      <RushBotPanel />
    </div>
  );
}