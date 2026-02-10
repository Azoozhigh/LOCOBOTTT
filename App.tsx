
import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { CommandCenter } from './components/CommandCenter';
import { GenerationConsole } from './components/GenerationConsole';
import { ArchitectMode } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ArchitectMode | null>(null);

  const handleSelectMode = (mode: ArchitectMode) => {
    setActiveMode(mode);
    // Smooth scroll to the console
    setTimeout(() => {
      const consoleEl = document.getElementById('generation-console');
      if (consoleEl) {
        consoleEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen">
      <Hero />
      
      <CommandCenter 
        activeMode={activeMode}
        onSelectMode={handleSelectMode} 
      />

      {activeMode && (
        <div id="generation-console" className="scroll-mt-20">
          <GenerationConsole mode={activeMode} />
        </div>
      )}

      {/* Global Navigation - Persistent CTA */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 glass border border-white/10 px-6 py-4 rounded-full flex items-center gap-8 z-50 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="text-[10px] font-black tracking-widest uppercase">LOCOBOT 2045</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10"></div>
        <div className="flex gap-4">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white transition-colors">Origins</button>
          <button onClick={() => {
            const cmd = document.querySelector('.max-w-7xl');
            if (cmd) cmd.scrollIntoView({ behavior: 'smooth' });
          }} className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white transition-colors">Modules</button>
          <button className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white transition-colors">Settings</button>
        </div>
      </nav>

      <footer className="py-20 text-center border-t border-white/5 mt-20">
        <p className="text-zinc-600 text-xs font-mono tracking-widest uppercase">
          LOCOBOT ARCHITECT v4.0.5 &bull; Built for the Future &bull; &copy; 2045 Neosynthetic Corp
        </p>
      </footer>
    </div>
  );
};

export default App;
