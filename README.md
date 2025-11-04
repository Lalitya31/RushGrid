# 🏎️ RushGrid

**Red Bull-Themed Adaptive Multi-Agent Traffic Routing Simulator**

RushGrid is an adaptive multi-agent urban traffic routing simulator powered by A*, Bi-A*, and Dynamic A* algorithms with real-time predictive re-routing, guided by our AI co-pilot RushBot. Built to help city planners, everyday travelers, and millennials save their time and work efficiently.

![RushGrid Screenshot](https://github.com/user-attachments/assets/fca89a69-6938-488e-b834-f18ba79cc5f2)

## ✨ Features

### 🧠 Advanced Pathfinding Algorithms
- **A* Algorithm** - Optimal pathfinding with heuristics
- **Bidirectional A*** - Faster search by meeting in the middle
- **Dynamic A*** - Adapts to real-time traffic changes
- **Dijkstra's Algorithm** - Classic shortest path baseline
- **Contraction Hierarchies** - Optimized for micro-queries
- **Landmarks** - Enhanced A* with preprocessed distances

### 🤖 Intelligent Agent System
- **Aggressive Mode** - Takes riskier routes for faster arrival
- **Cautious Mode** - Prefers safer, more predictable paths
- **Balanced Mode** - Optimal balance between speed and safety

### 🔥 Real-Time Traffic Features
- **Predictive Heatmap** - Visual traffic density overlay
- **Auto Algorithm Switching** - Automatically selects best algorithm
- **Emergency Mode** - Prioritizes fastest route immediately
- **Dynamic Rerouting** - Adapts to changing traffic conditions

### 📊 Performance Analytics
- **CO₂ Emissions Bar** - Environmental impact visualization
- **Algorithm Leaderboard** - Performance comparison
- **Execution Metrics** - Path length, nodes visited, efficiency
- **Real-time Statistics** - Live performance tracking

### 💬 RushBot AI Co-Pilot
Interactive chat interface with three modes:
- **Explain Mode** - Learn about algorithms and concepts
- **Command Mode** - Execute operations via natural language
- **Scenario Mode** - Load predefined traffic scenarios

### 🎨 Red Bull-Themed UI
- Dark mode with Red Bull red (#DC0A2D) and blue (#1E3A8A)
- Orbitron font for headers, Inter for body text
- Smooth animations and transitions
- Responsive design for all screen sizes

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Lalitya31/RushGrid.git
cd RushGrid

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎮 Usage

### Basic Operations
1. **Set Start Point** - Click on grid to place green start marker
2. **Set End Point** - Click again to place red end marker
3. **Run Pathfinding** - Click "Run Pathfinding" button
4. **View Results** - See path visualization and performance stats

### Control Panel
- **Algorithm Selection** - Choose between A*, Bi-A*, Dynamic A*, or Dijkstra
- **Agent Behavior** - Select Aggressive, Balanced, or Cautious mode
- **Emergency Mode** - Toggle for urgent routing
- **Auto Algorithm** - Let the system choose the best algorithm
- **Add Random Walls** - Create obstacles on the grid
- **Clear Grid** - Reset the simulation

### RushBot Commands

```
# Explain algorithms
explain a*
explain dijkstra
explain bi-a*
explain dynamic a*

# Execute commands
run a*
clear grid
add walls
set aggressive
set cautious
set balanced
emergency on
emergency off

# Load scenarios
scenario rush hour
scenario clear roads
scenario heavy traffic
scenario multi-agent
```

## 📁 Project Structure

```
RushGrid/
├── src/
│   ├── algorithms/
│   │   ├── pathfinding.js       # A*, Bi-A*, Dynamic A*, Dijkstra
│   │   └── optimizations.js     # CH + Landmarks
│   ├── components/
│   │   ├── Grid.jsx             # Canvas-based grid visualization
│   │   ├── RushBot.jsx          # AI chat interface
│   │   └── Controls.jsx         # Control panel & statistics
│   ├── utils/
│   │   └── gridHelpers.js       # Grid utilities & helpers
│   ├── App.jsx                  # Main application
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── public/                      # Static assets
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js               # Vite configuration
└── vercel.json                  # Vercel deployment config
```

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Charts:** Chart.js with react-chartjs-2
- **Fonts:** Orbitron + Inter (Google Fonts)
- **Deployment:** Vercel-ready

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Vite and deploy

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

## 🧪 Algorithm Details

### A* Algorithm
Uses heuristic (Manhattan distance) to guide search efficiently. Guarantees optimal path with admissible heuristic.

### Bidirectional A*
Runs two searches simultaneously from start and goal, meeting in the middle. Much faster for long distances.

### Dynamic A*
Adapts to changing traffic conditions by monitoring heatmap and rerouting when necessary.

### Dijkstra's Algorithm
Explores uniformly in all directions. Slower but doesn't require heuristic.

### Contraction Hierarchies
Preprocesses graph by contracting nodes in order of importance, creating shortcuts for faster queries.

### Landmarks
Precomputes distances from landmark nodes to improve A* heuristic using triangle inequality.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 👥 Authors

Built with ❤️ for urban traffic optimization and pathfinding education.

## 🙏 Acknowledgments

- Inspired by Red Bull Racing's precision and speed
- Built with modern web technologies
- Designed for both education and practical use
