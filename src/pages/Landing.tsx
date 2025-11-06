import { useNavigate } from 'react-router-dom';
import { Activity, Navigation, Brain, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-primary relative overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Animated particles */}
      <Particles />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-12 h-12 text-accent-red" />
          <h1 className="text-7xl font-display font-black gradient-text">RushGrid</h1>
        </div>
        <h2 className="text-2xl font-display text-text-secondary uppercase tracking-wider">
          Adaptive Multi-Agent Dynamic Routing Visualizer
        </h2>
        <p className="mt-8 text-lg text-text-secondary max-w-3xl mx-auto">
          Powered by the <span className="text-blue-400 font-semibold">PathFuel Engine v1.0</span> and guided by our AI co-pilot{' '}
          <span className="text-red-500 font-semibold">RushBot</span>, demonstrating how modern pathfinding algorithms solve real-time urban congestion.
        </p>
      </motion.div>

      {/* Feature cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl z-10"
      >
        <FeatureCard
          icon={<Activity className="w-8 h-8 text-accent-red" />}
          title="A*, Bi-A*, Dynamic A*"
          description="Advanced pathfinding algorithms that adapt to real-time traffic"
        />
        <FeatureCard
          icon={<Navigation className="w-8 h-8 text-accent-blue" />}
          title="Multi-Agent System"
          description="Autonomous vehicles with unique personalities and routing strategies"
        />
        <FeatureCard
          icon={<Brain className="w-8 h-8 text-accent-purple" />}
          title="RushBot AI Co-Pilot"
          description="Intelligent assistant that narrates, explains, and controls simulations"
        />
      </motion.div>

      {/* CTA - Punching Red Button */}
      <button
        onClick={() => navigate('/simulation')}
        className="mt-12 px-8 py-4 bg-accent-red text-white font-display text-lg rounded-lg shadow-lg flex items-center gap-2 z-10 btn-punch cursor-pointer hover:scale-110 transition-transform"
      >
        <Zap className="w-5 h-5" />
        Launch Simulation
      </button>

      <p className="mt-8 text-sm text-text-muted z-10">
        Click anywhere on the grid to block roads • Spawn agents • Watch adaptive routing in action
      </p>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: 'var(--shadow-glow-purple)' }}
      className="glass-card p-6 text-center"
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="font-display text-xl mb-2">{title}</h3>
      <p className="text-text-secondary text-sm">{description}</p>
    </motion.div>
  );
}

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}