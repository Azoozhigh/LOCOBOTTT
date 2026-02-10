
import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* 3D Metallic Logo (SVG Implementation) */}
      <div className="relative mb-8 animate-float">
        <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
          <defs>
            <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="50%" stopColor="#A1A1A1" />
              <stop offset="100%" stopColor="#444444" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path d="M50 5 L90 25 V75 L50 95 L10 75 V25 L50 5Z" stroke="url(#metal)" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
          <path d="M50 15 L80 30 V70 L50 85 L20 70 V30 L50 15Z" fill="url(#metal)" />
          <circle cx="50" cy="50" r="12" fill="#000000" />
          <path d="M45 45 L55 55 M55 45 L45 55" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-gradient leading-none">
        LOCOBOT<br/>ARCHITECT
      </h1>
      
      <p className="max-w-2xl text-lg md:text-xl text-zinc-400 font-light mb-12 px-4 leading-relaxed">
        The ultimate creation engine from <span className="text-white font-medium">2045</span>. 
        Synthesize full-stack systems, AAA games, and neural automations with the speed of thought.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-colors text-sm uppercase tracking-widest"
        >
          Initialize Command Center
        </button>
        <button className="px-8 py-4 glass border border-white/10 rounded-full hover:bg-white/5 transition-colors text-sm uppercase tracking-widest">
          View Documentation
        </button>
      </div>

      <div className="absolute bottom-10 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </section>
  );
};
