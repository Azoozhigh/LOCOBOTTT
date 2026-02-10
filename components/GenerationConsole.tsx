import React, { useState, useEffect, useRef } from 'react';
import { ArchitectMode } from '../types';
import { generateBlueprint } from '../services/geminiService';
import { GlassCard } from './GlassCard';
import { marked } from 'marked';

interface GenerationConsoleProps {
  mode: ArchitectMode;
}

export const GenerationConsole: React.FC<GenerationConsoleProps> = ({ mode }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const modeConfig = {
    [ArchitectMode.WEB]: { placeholder: "E.g., High-performance SaaS landing page with user dashboard...", color: "text-blue-400" },
    [ArchitectMode.GAMES]: { placeholder: "E.g., Multiplayer Cyberpunk RPG with advanced inventory systems...", color: "text-purple-400" },
    [ArchitectMode.APPS]: { placeholder: "E.g., Fintech mobile app with biometric security and crypto wallet...", color: "text-emerald-400" },
    [ArchitectMode.AUTOMATION]: { placeholder: "E.g., Local Node.js service that auto-syncs cloud storage to WhatsApp...", color: "text-orange-400" },
    [ArchitectMode.LEARNING]: { placeholder: "What would you like to master today? E.g., How does LOCOBOT handle state management?", color: "text-pink-400" },
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    setLogs(["Initializing LOCOBOT Neural Interface...", "Accessing 2045 Repository...", "Synthesizing Architecture..."]);

    try {
      const output = await generateBlueprint(mode, prompt);
      setResult(output);
      setLogs(prev => [...prev, "Synthesis Complete.", "Ready for Deployment."]);
    } catch (error: any) {
      setLogs(prev => [...prev, "ERROR: Synthesis Interrupted.", String(error.message || error)]);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Configure marked options
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-40">
      <GlassCard hoverable={false} className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-full bg-current ${modeConfig[mode].color} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
          <span className={`text-sm font-bold uppercase tracking-widest ${modeConfig[mode].color}`}>
            {mode} Synthesis Active
          </span>
        </div>

        <div className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={modeConfig[mode].placeholder}
            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:outline-none focus:ring-1 focus:ring-white/30 transition-all resize-none font-light placeholder:text-zinc-600"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`
              absolute bottom-6 right-6 px-6 py-3 rounded-xl font-bold transition-all
              ${isGenerating || !prompt ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:scale-105 active:scale-95'}
            `}
          >
            {isGenerating ? 'Synthesizing...' : 'Snythesize Project'}
          </button>
        </div>
      </GlassCard>

      {/* Output Console */}
      {(logs.length > 0 || result) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard hoverable={false} className="lg:col-span-1 h-[600px] flex flex-col">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Neural Logs</h4>
            <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-[11px] space-y-2 text-zinc-400">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-zinc-600">[{new Date().toLocaleTimeString()}]</span>
                  <span>{log}</span>
                </div>
              ))}
              {isGenerating && <div className="animate-pulse">_</div>}
            </div>
          </GlassCard>

          <GlassCard hoverable={false} className="lg:col-span-2 h-[600px] flex flex-col p-0 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
              <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Architectural Output</h4>
              {result && (
                <button 
                  onClick={() => alert("Connecting to Vercel/Netlify/AWS via Secure Tunnel...")}
                  className="px-4 py-1.5 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-widest"
                >
                  Direct Deploy
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto p-8 text-sm leading-relaxed text-zinc-300 scroll-smooth">
              {result ? (
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
                />
              ) : (isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600">
                  <div className="w-12 h-12 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <p className="animate-pulse font-mono uppercase tracking-tighter">Decoding Future Blueprint...</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-600 font-mono">
                  Awaiting Synthesis Command...
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};