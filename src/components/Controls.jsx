import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function ControlPanel({ 
  onAlgorithmChange, 
  onAgentTypeChange, 
  onRun, 
  onClear,
  onAddWalls,
  onToggleEmergency,
  onAutoSwitch,
  agentType,
  selectedAlgorithm,
  emergencyMode,
  autoSwitch
}) {
  return (
    <div className="bg-dark-card rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-orbitron font-bold text-redbull-red mb-4">
        Control Panel
      </h3>

      {/* Algorithm Selection */}
      <div>
        <label className="block text-sm font-inter text-gray-300 mb-2">
          Algorithm
        </label>
        <select
          value={selectedAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          className="w-full px-3 py-2 bg-dark-bg border border-redbull-blue rounded text-white focus:outline-none focus:ring-2 focus:ring-redbull-red font-inter"
          disabled={autoSwitch}
        >
          <option value="A*">A* Algorithm</option>
          <option value="Bi-A*">Bidirectional A*</option>
          <option value="Dynamic A*">Dynamic A*</option>
          <option value="Dijkstra">Dijkstra</option>
        </select>
        {autoSwitch && (
          <p className="text-xs text-redbull-yellow mt-1 font-inter">
            🤖 Auto-switching enabled
          </p>
        )}
      </div>

      {/* Agent Type */}
      <div>
        <label className="block text-sm font-inter text-gray-300 mb-2">
          Agent Behavior
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['aggressive', 'balanced', 'cautious'].map(type => (
            <button
              key={type}
              onClick={() => onAgentTypeChange(type)}
              className={`px-3 py-2 rounded font-inter text-sm capitalize transition-colors ${
                agentType === type
                  ? 'bg-redbull-red text-white'
                  : 'bg-dark-bg text-gray-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Emergency Mode */}
      <div className="flex items-center justify-between p-3 bg-dark-bg rounded">
        <span className="text-sm font-inter text-gray-300">
          🚨 Emergency Mode
        </span>
        <button
          onClick={onToggleEmergency}
          className={`px-4 py-1 rounded font-inter text-sm transition-colors ${
            emergencyMode
              ? 'bg-redbull-red text-white animate-pulse'
              : 'bg-gray-600 text-gray-300'
          }`}
        >
          {emergencyMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Auto Algorithm Switch */}
      <div className="flex items-center justify-between p-3 bg-dark-bg rounded">
        <span className="text-sm font-inter text-gray-300">
          🤖 Auto Algorithm
        </span>
        <button
          onClick={onAutoSwitch}
          className={`px-4 py-1 rounded font-inter text-sm transition-colors ${
            autoSwitch
              ? 'bg-redbull-blue text-white'
              : 'bg-gray-600 text-gray-300'
          }`}
        >
          {autoSwitch ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={onRun}
          className="w-full px-4 py-3 bg-redbull-red hover:bg-red-700 text-white rounded font-orbitron font-bold transition-colors"
        >
          🏁 Run Pathfinding
        </button>
        <button
          onClick={onAddWalls}
          className="w-full px-4 py-2 bg-redbull-blue hover:bg-blue-800 text-white rounded font-inter transition-colors"
        >
          🧱 Add Random Walls
        </button>
        <button
          onClick={onClear}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-inter transition-colors"
        >
          🗑️ Clear Grid
        </button>
      </div>
    </div>
  );
}

function Statistics({ metrics, co2, leaderboard }) {
  return (
    <div className="bg-dark-card rounded-lg p-4 space-y-4">
      <h3 className="text-lg font-orbitron font-bold text-redbull-red mb-4">
        Performance Stats
      </h3>

      {/* Metrics */}
      {metrics && (
        <div className="space-y-2">
          <div className="flex justify-between p-2 bg-dark-bg rounded">
            <span className="text-sm font-inter text-gray-300">Algorithm</span>
            <span className="text-sm font-inter font-bold text-redbull-yellow">
              {metrics.algorithm}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-dark-bg rounded">
            <span className="text-sm font-inter text-gray-300">Path Length</span>
            <span className="text-sm font-inter font-bold text-white">
              {metrics.pathLength}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-dark-bg rounded">
            <span className="text-sm font-inter text-gray-300">Nodes Visited</span>
            <span className="text-sm font-inter font-bold text-white">
              {metrics.nodesVisited}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-dark-bg rounded">
            <span className="text-sm font-inter text-gray-300">Time</span>
            <span className="text-sm font-inter font-bold text-white">
              {metrics.executionTime}
            </span>
          </div>
          <div className="flex justify-between p-2 bg-dark-bg rounded">
            <span className="text-sm font-inter text-gray-300">Efficiency</span>
            <span className="text-sm font-inter font-bold text-green-400">
              {metrics.efficiency}
            </span>
          </div>
        </div>
      )}

      {/* CO2 Bar */}
      {co2 !== null && (
        <div className="p-3 bg-dark-bg rounded">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-inter text-gray-300">CO₂ Emissions</span>
            <span className="text-lg font-orbitron font-bold text-redbull-red">
              {co2} kg
            </span>
          </div>
          <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
              style={{ width: `${Math.min(100, (co2 / 50) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {leaderboard && leaderboard.length > 0 && (
        <div>
          <h4 className="text-sm font-orbitron font-bold text-redbull-yellow mb-2">
            🏆 Algorithm Leaderboard
          </h4>
          <div className="space-y-1">
            {leaderboard.map((entry, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-2 bg-dark-bg rounded text-xs font-inter"
              >
                <span className="text-gray-300">
                  {idx + 1}. {entry.algorithm}
                </span>
                <span className="text-white font-bold">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function HeatmapLegend() {
  return (
    <div className="bg-dark-card rounded-lg p-4">
      <h3 className="text-sm font-orbitron font-bold text-redbull-red mb-3">
        🔥 Traffic Heatmap
      </h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-xs font-inter text-gray-300">Low Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded" />
          <span className="text-xs font-inter text-gray-300">Medium Traffic</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-redbull-red rounded" />
          <span className="text-xs font-inter text-gray-300">High Traffic</span>
        </div>
      </div>
    </div>
  );
}

export { ControlPanel, Statistics, HeatmapLegend };
