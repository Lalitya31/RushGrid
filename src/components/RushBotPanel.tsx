import { useState } from 'react';
import { Send, Bot } from 'lucide-react';

export default function RushBotPanel() {
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: "Hey! I'm RushBot, your AI co-pilot. I can narrate what's happening, explain algorithms, or execute commands. Try asking me 'What is A*?' or tell me to 'Add traffic' or 'Spawn emergency vehicle'.",
      time: '11:03:25 PM',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { from: 'user', text: input, time: new Date().toLocaleTimeString() }]);
      setInput('');
    }
  };

  return (
    <div className="bg-bg-primary border-t border-border-default p-4 max-h-56 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="w-5 h-5 text-accent-red" />
        <div>
          <h3 className="font-display text-sm font-bold">RushBot</h3>
          <p className="text-xs text-text-muted">AI Co-Pilot • Powered by PathFuel</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-3 space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-lg text-sm ${msg.from === 'bot' ? 'bg-bg-card' : 'bg-accent-red/20'}`}>
            <p>{msg.text}</p>
            {msg.time && <span className="text-xs text-text-muted">{msg.time}</span>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask me anything or give a command..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-3 py-2 bg-bg-card border border-border-default rounded-lg text-text-primary text-sm placeholder:text-text-muted focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-accent-red text-white rounded-lg hover:bg-accent-red/80 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}