
import React from 'react';
import { GlassCard } from './GlassCard';
import { ArchitectMode } from '../types';

interface CommandCenterProps {
  onSelectMode: (mode: ArchitectMode) => void;
  activeMode: ArchitectMode | null;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ onSelectMode, activeMode }) => {
  const tools = [
    {
      id: ArchitectMode.WEB,
      title: 'Web Architect',
      desc: 'Next.js 14, Supabase, Stripe Integration',
      icon: '🌐',
      colSpan: 'md:col-span-2',
      rowSpan: 'md:row-span-2',
      color: 'from-blue-500/20 to-transparent'
    },
    {
      id: ArchitectMode.GAMES,
      title: 'Game Engine',
      desc: 'High-Fidelity Scaffolding',
      icon: '🎮',
      colSpan: 'md:col-span-1',
      rowSpan: 'md:row-span-1',
      color: 'from-purple-500/20 to-transparent'
    },
    {
      id: ArchitectMode.APPS,
      title: 'App Forge',
      desc: 'iOS & Android Native Systems',
      icon: '📱',
      colSpan: 'md:col-span-1',
      rowSpan: 'md:row-span-1',
      color: 'from-emerald-500/20 to-transparent'
    },
    {
      id: ArchitectMode.AUTOMATION,
      title: 'Neural Automation',
      desc: 'Python/Node Local Scripts',
      icon: '🧠',
      colSpan: 'md:col-span-1',
      rowSpan: 'md:row-span-1',
      color: 'from-orange-500/20 to-transparent'
    },
    {
      id: ArchitectMode.LEARNING,
      title: 'Omni-Mentor',
      desc: 'Step-by-Step Interactive Learning',
      icon: '🎓',
      colSpan: 'md:col-span-1',
      rowSpan: 'md:row-span-1',
      color: 'from-pink-500/20 to-transparent'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Command Center</h2>
          <p className="text-zinc-500">Select a synthesis module to begin construction.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono uppercase tracking-widest text-zinc-500">System: Operational</div>
           <div className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono uppercase tracking-widest text-emerald-500">Latency: 24ms</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
        {tools.map((tool) => (
          <GlassCard 
            key={tool.id}
            onClick={() => onSelectMode(tool.id)}
            className={`
              ${tool.colSpan} ${tool.rowSpan}
              relative group overflow-hidden
              ${activeMode === tool.id ? 'ring-2 ring-white scale-[1.02]' : ''}
            `}
          >
            {/* Ambient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
            
            <div className="relative h-full flex flex-col justify-between">
              <div className="text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 origin-left">
                {tool.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-1 group-hover:translate-x-1 transition-transform">{tool.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">{tool.desc}</p>
              </div>
              
              <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
