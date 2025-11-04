# RushGrid Feature Documentation

## 🎯 Complete Feature List

### 1. Pathfinding Algorithms

#### A* Algorithm
- **Implementation**: `src/algorithms/pathfinding.js`
- **Heuristic**: Manhattan distance
- **Features**: 
  - f(n) = g(n) + h(n) scoring
  - Priority queue implementation
  - Optimal path guarantee
- **Best for**: General pathfinding with good performance

#### Bidirectional A*
- **Implementation**: `src/algorithms/pathfinding.js`
- **Features**:
  - Dual search from start and end
  - Meets in the middle
  - Faster for long distances
  - Path merging logic
- **Best for**: Large grids, distant endpoints

#### Dynamic A*
- **Implementation**: `src/algorithms/pathfinding.js`
- **Features**:
  - Monitors traffic heatmap
  - Triggers rerouting when congestion detected
  - Adapts to changing conditions
- **Best for**: Real-time traffic scenarios

#### Dijkstra's Algorithm
- **Implementation**: `src/algorithms/pathfinding.js`
- **Features**:
  - No heuristic required
  - Uniform exploration
  - Guaranteed optimal
- **Best for**: Baseline comparison

### 2. Optimizations

#### Contraction Hierarchies
- **Implementation**: `src/algorithms/optimizations.js`
- **Features**:
  - Node contraction preprocessing
  - Shortcut creation
  - Hierarchical graph structure
- **Use case**: Micro-queries on preprocessed graphs

#### Landmarks
- **Implementation**: `src/algorithms/optimizations.js`
- **Features**:
  - 4 landmark nodes selected via farthest-point strategy
  - Precomputed distances to all nodes
  - Triangle inequality heuristic enhancement
- **Use case**: Improved A* heuristic estimates

### 3. Agent Behavior Modes

#### Aggressive Agent
- **Cost Modifier**: 0.8x
- **Behavior**: Takes riskier, faster routes
- **Use case**: Time-critical deliveries

#### Cautious Agent
- **Cost Modifier**: 1.3x
- **Behavior**: Prefers safer, more predictable paths
- **Use case**: Heavy vehicles, passenger transport

#### Balanced Agent
- **Cost Modifier**: 1.0x
- **Behavior**: Optimal balance
- **Use case**: General traffic

### 4. Real-Time Features

#### Predictive Traffic Heatmap
- **Visualization**: Color gradient overlay on grid
- **Colors**:
  - Green (Low): 0-30% congestion
  - Yellow (Medium): 30-70% congestion
  - Red (High): 70-100% congestion
- **Updates**: Every 5 seconds
- **Factors**: Random traffic + agent paths

#### Auto Algorithm Selection
- **Logic**:
  - Emergency mode → Bi-A*
  - Small grids (<100 cells) → Dijkstra
  - Long distances → Bi-A*
  - Dynamic traffic → Dynamic A*
  - Default → A*

#### Emergency Mode
- **Visual**: Pulsing red indicator
- **Behavior**: Forces fastest algorithm (Bi-A*)
- **Use case**: Ambulances, fire trucks

#### CO₂ Emissions Calculator
- **Formula**: path_length × 0.2 × traffic_multiplier
- **Visualization**: Gradient bar (green → yellow → red)
- **Range**: 0-50kg baseline

#### Algorithm Leaderboard
- **Metrics**: Execution time
- **Display**: Top 5 runs
- **Sorting**: Fastest to slowest

### 5. RushBot AI Co-Pilot

#### Explain Mode
Commands:
- `explain a*` - A* algorithm details
- `explain dijkstra` - Dijkstra's algorithm
- `explain bi-a*` - Bidirectional A*
- `explain dynamic a*` - Dynamic A*

#### Command Mode
Commands:
- `run [algorithm]` - Execute pathfinding
- `clear grid` - Reset simulation
- `add walls` - Random obstacles
- `set aggressive` - Aggressive agent
- `set cautious` - Cautious agent
- `set balanced` - Balanced agent
- `emergency on/off` - Toggle emergency

#### Scenario Mode
Scenarios:
- `scenario rush hour` - Heavy traffic (80%+ congestion)
- `scenario clear roads` - No traffic
- `scenario heavy traffic` - Dense congestion
- `scenario multi-agent` - 3 agents with different behaviors

### 6. UI Components

#### Grid Component
- **Technology**: HTML5 Canvas
- **Size**: 30×30 cells, 600×600 pixels
- **Rendering**:
  - Traffic heatmap layer
  - Visited nodes (blue tint)
  - Path visualization (yellow line)
  - Start point (green circle)
  - End point (red circle)
  - Grid lines
- **Interaction**: Click to set start/end

#### Control Panel
- Algorithm dropdown
- Agent behavior buttons
- Emergency mode toggle
- Auto algorithm toggle
- Action buttons (Run, Add Walls, Clear)

#### Performance Stats Panel
- Algorithm name
- Path length
- Nodes visited
- Execution time
- Efficiency percentage
- CO₂ emissions with bar
- Algorithm leaderboard

#### RushBot Panel
- Mode selector (Explain/Command/Scenario)
- Message history
- Input field
- Send button
- Auto-scroll

### 7. Styling & Theme

#### Colors
- **Primary Red**: #DC0A2D (Red Bull Red)
- **Primary Blue**: #1E3A8A (Red Bull Blue)
- **Yellow**: #FDB913 (Red Bull Yellow)
- **Dark BG**: #0A0E27
- **Dark Card**: #1A1F3A

#### Typography
- **Headers**: Orbitron (400, 700, 900)
- **Body**: Inter (300-700)

#### Animations
- Emergency mode pulse
- Smooth transitions
- Hover effects

### 8. Performance Metrics

#### Build Size
- HTML: 0.77 kB (gzip: 0.43 kB)
- CSS: 12.22 kB (gzip: 3.09 kB)
- JS: 314.66 kB (gzip: 104.87 kB)
- **Total**: ~105 kB gzipped

#### Algorithm Performance (30×30 grid)
- A*: ~4-6ms
- Bi-A*: ~5-8ms
- Dynamic A*: ~4-7ms
- Dijkstra: ~8-12ms

### 9. Deployment

#### Vercel Configuration
- Auto-detected Vite framework
- Optimized build command
- CDN distribution
- Automatic HTTPS

#### Build Process
1. `npm install` - Dependencies
2. `npm run build` - Production build
3. `npm run preview` - Local preview
4. Deploy to Vercel

### 10. Extensibility

#### Easy to Add
- New algorithms (add to pathfinding.js)
- New agent types (modify getCost function)
- New scenarios (extend loadScenario)
- New RushBot commands (extend processInput)
- Custom color themes (tailwind.config.js)

#### API Surface
- Grid creation utilities
- Algorithm functions
- Metric calculators
- Heatmap generators

## 📊 Technical Specifications

- **React Version**: 18.2.0
- **Vite Version**: 5.0.8
- **Tailwind**: 3.4.0
- **Chart.js**: 4.4.0
- **Grid Size**: Configurable (default 30×30)
- **Cell Size**: Auto-calculated based on canvas
- **Update Frequency**: 5s for heatmap
- **Max Agents**: Unlimited (tested with 3)

## 🎓 Educational Value

RushGrid serves as:
- Interactive algorithm visualization
- Traffic routing education tool
- Performance comparison platform
- Real-time simulation environment
- Pathfinding research sandbox
