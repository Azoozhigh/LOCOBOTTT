import React, { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { CommandCenter } from './components/CommandCenter';
import { GenerationConsole } from './components/GenerationConsole';
import { ArchitectMode } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ArchitectMode | null>(null);

  useEffect(() => {
    // Reveal app once mounted
    const loader = document.getElementById('initial-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 800);
    }
  }, []);

  const handleSelectMode = (mode: ArchitectMode) => {
    setActiveMode(mode);
    setTimeout(() => {
      const consoleEl = document.getElementById('generation-console');
      if (consoleEl) {
        consoleEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Hero />
      
      <CommandCenter 
        activeMode={activeMode}
        onSelectMode={handleSelectMode} 
      />

      {activeMode && (
        <div id="generation-console" className="scroll-mt-12 transition-all duration-1000">
          <GenerationConsole mode={activeMode} />
        </div>
      )}

      {/* Global Persistence Nav */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 glass px-10 py-5 rounded-full flex items-center gap-12 z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase">LOCOBOT_45</span>
        </div>
        <div className="h-4 w-[1px] bg-white/10"></div>
        <div className="flex gap-8">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-[10px] uppercase font-black text-zinc-500 hover:text-white transition-all hover:tracking-widest">Home</button>
          <button onClick={() => document.getElementById('command-center-header')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] uppercase font-black text-zinc-500 hover:text-white transition-all hover:tracking-widest">Modules</button>
          <button className="text-[10px] uppercase font-black text-zinc-800 cursor-not-allowed">v4.0.9</button>
        </div>
      </nav>

      <footer className="py-32 text-center border-t border-white/5 mt-20">
        <div className="mb-8 flex justify-center gap-10 opacity-20">
          <span className="text-[9px] font-mono uppercase tracking-widest">Quantum Encryption</span>
          <span className="text-[9px] font-mono uppercase tracking-widest">Neural Link v2</span>
          <span className="text-[9px] font-mono uppercase tracking-widest">2045 Protocol</span>
        </div>
        <p className="text-zinc-700 text-[10px] font-mono tracking-[0.5em] uppercase">
          LOCOBOT ARCHITECT &bull; THE FUTURE IS SYNTHETIC &bull; &copy; 2045
        </p>
      </footer>
    </div>
  );
};

export default App;