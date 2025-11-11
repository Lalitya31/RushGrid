import React from 'react';

const DeveloperFooter: React.FC = () => {
  return (
    <footer className="w-full bg-gray-900 border-t border-gray-700 py-6 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">Developed by</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Developer 1 */}
          <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              LD
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">Lalitya Dodla</p>
              <p className="text-xs text-gray-400">Roll No: 24BCE5289</p>
              <p className="text-xs text-gray-500 mt-1">Core Algorithm Design & Development</p>
            </div>
          </div>

          {/* Developer 2 */}
          <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg hover:bg-gray-750 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              PR
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">Puneeth Reddy T</p>
              <p className="text-xs text-gray-400">Roll No: 24BCE5406</p>
              <p className="text-xs text-gray-500 mt-1">UI/UX & Visualization</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-xs text-gray-500 text-center">
          © 2025 RushGrid. Adaptive Multi-Agent Dynamic Routing Visualizer.
        </div>
      </div>
    </footer>
  );
};

export default DeveloperFooter;
