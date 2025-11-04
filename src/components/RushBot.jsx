import { useState, useRef, useEffect } from 'react';

function RushBot({ onCommand }) {
  const [messages, setMessages] = useState([
    { 
      type: 'bot', 
      text: '🏎️ Welcome to RushBot! I can help you Explain algorithms, execute Commands, or load Scenarios. Type "help" for options!' 
    }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('command'); // 'explain', 'command', 'scenario'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { type: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);

    const response = processInput(input.toLowerCase().trim());
    setTimeout(() => {
      setMessages(prev => [...prev, { type: 'bot', text: response }]);
    }, 300);

    setInput('');
  };

  const processInput = (input) => {
    // Help command
    if (input === 'help') {
      return `🏎️ **RushBot Commands:**

**Explain Mode:**
- "explain a*" - Learn about A* algorithm
- "explain dijkstra" - Learn about Dijkstra's algorithm
- "explain bi-a*" - Learn about Bidirectional A*
- "explain dynamic a*" - Learn about Dynamic A*

**Command Mode:**
- "run [algorithm]" - Execute pathfinding
- "clear grid" - Clear the grid
- "add walls" - Add random obstacles
- "set aggressive/cautious/balanced" - Set agent type
- "emergency on/off" - Toggle emergency mode

**Scenario Mode:**
- "scenario rush hour" - Load rush hour traffic
- "scenario clear roads" - Load clear roads
- "scenario heavy traffic" - Load heavy traffic
- "scenario multi-agent" - Multi-agent simulation`;
    }

    // Explain mode
    if (input.startsWith('explain')) {
      const topic = input.replace('explain', '').trim();
      return getExplanation(topic);
    }

    // Command mode
    if (input.startsWith('run')) {
      const algo = input.replace('run', '').trim();
      if (onCommand) {
        onCommand({ type: 'run', algorithm: algo });
      }
      return `🚀 Running ${algo} algorithm...`;
    }

    if (input === 'clear grid') {
      if (onCommand) onCommand({ type: 'clear' });
      return '✨ Grid cleared!';
    }

    if (input === 'add walls') {
      if (onCommand) onCommand({ type: 'addWalls' });
      return '🧱 Random walls added!';
    }

    if (input.includes('set aggressive')) {
      if (onCommand) onCommand({ type: 'setAgent', agentType: 'aggressive' });
      return '⚡ Agent set to AGGRESSIVE mode - faster but riskier routes!';
    }

    if (input.includes('set cautious')) {
      if (onCommand) onCommand({ type: 'setAgent', agentType: 'cautious' });
      return '🛡️ Agent set to CAUTIOUS mode - safer but slower routes!';
    }

    if (input.includes('set balanced')) {
      if (onCommand) onCommand({ type: 'setAgent', agentType: 'balanced' });
      return '⚖️ Agent set to BALANCED mode - optimal balance!';
    }

    if (input.includes('emergency on')) {
      if (onCommand) onCommand({ type: 'emergency', value: true });
      return '🚨 EMERGENCY MODE ACTIVATED - Using fastest algorithm!';
    }

    if (input.includes('emergency off')) {
      if (onCommand) onCommand({ type: 'emergency', value: false });
      return '✅ Emergency mode deactivated.';
    }

    // Scenario mode
    if (input.startsWith('scenario')) {
      const scenario = input.replace('scenario', '').trim();
      if (onCommand) onCommand({ type: 'scenario', scenario });
      return `🎬 Loading "${scenario}" scenario...`;
    }

    return `🤔 I didn't understand that. Type "help" for available commands!`;
  };

  const getExplanation = (topic) => {
    const explanations = {
      'a*': `🎯 **A* Algorithm**

A* is a best-first search algorithm that uses a heuristic to efficiently find the shortest path. It combines:
- **g(n)**: Actual cost from start to node n
- **h(n)**: Estimated cost from node n to goal (heuristic)
- **f(n) = g(n) + h(n)**: Total estimated cost

**Pros:** Optimal and efficient, guarantees shortest path
**Cons:** Can explore many nodes in complex scenarios
**Best for:** General pathfinding with good heuristics`,

      'dijkstra': `📊 **Dijkstra's Algorithm**

Dijkstra's algorithm explores all directions equally, finding the shortest path without using heuristics.

**How it works:**
1. Start with distance 0 at source
2. Visit unvisited node with smallest distance
3. Update distances to neighbors
4. Repeat until destination reached

**Pros:** Always finds shortest path, no heuristic needed
**Cons:** Explores more nodes than A*, slower
**Best for:** When you don't have a good heuristic`,

      'bi-a*': `↔️ **Bidirectional A***

Bi-A* runs two A* searches simultaneously - one from start and one from goal, meeting in the middle.

**Advantages:**
- Much faster for long distances
- Explores fewer nodes overall
- Still guarantees optimal path

**How it works:**
1. Forward search from start
2. Backward search from goal
3. Stop when searches meet
4. Combine paths

**Best for:** Long-distance routing, large grids`,

      'dynamic a*': `🔄 **Dynamic A* (D*)**

Dynamic A* adapts to changing conditions in real-time, perfect for traffic simulations.

**Key features:**
- Handles dynamic obstacles
- Updates path when conditions change
- Efficiently re-plans routes
- Monitors traffic patterns

**Use cases:**
- Real-time traffic navigation
- Changing road conditions
- Adaptive routing

**Best for:** Dynamic environments, live traffic updates`,
    };

    return explanations[topic] || `I don't have information about "${topic}". Try: a*, dijkstra, bi-a*, or dynamic a*`;
  };

  return (
    <div className="bg-dark-card rounded-lg p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-orbitron font-bold text-redbull-red">
          🏎️ RushBot
        </h3>
        <div className="flex gap-2">
          {['explain', 'command', 'scenario'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 py-1 rounded text-xs font-inter ${
                mode === m
                  ? 'bg-redbull-red text-white'
                  : 'bg-dark-bg text-gray-400 hover:text-white'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-3 scrollbar-hide">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-redbull-blue text-white'
                  : 'bg-dark-bg text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-line font-inter">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`${mode} mode - type "help" for commands...`}
          className="flex-1 px-4 py-2 bg-dark-bg border border-redbull-blue rounded text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-redbull-red font-inter"
        />
        <button
          onClick={handleSend}
          className="px-6 py-2 bg-redbull-red hover:bg-red-700 text-white rounded font-orbitron font-bold transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default RushBot;
