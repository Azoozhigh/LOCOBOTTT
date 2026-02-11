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
  const [viewMode, setViewMode] = useState<'blueprint' | 'preview'>('blueprint');
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const modeConfig = {
    [ArchitectMode.WEB]: { placeholder: "E.g., High-performance SaaS landing page...", color: "text-blue-400" },
    [ArchitectMode.GAMES]: { placeholder: "E.g., Side-scrolling space shooter with power-ups...", color: "text-purple-400" },
    [ArchitectMode.APPS]: { placeholder: "E.g., Fitness tracker with visual charts...", color: "text-emerald-400" },
    [ArchitectMode.AUTOMATION]: { placeholder: "E.g., Automated data dashboard with visualization...", color: "text-orange-400" },
    [ArchitectMode.LEARNING]: { placeholder: "What would you like to master?", color: "text-pink-400" },
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setViewMode('blueprint');
    setLogs(["Connecting to LOCOBOT Core...", "Analyzing Synthesis Parameters...", "Synthesizing Neural Code..."]);

    try {
      const output = await generateBlueprint(mode, prompt);
      setResult(output);
      setLogs(prev => [...prev, "Synthesis Successful.", "Preview Generated.", "Awaiting Execution."]);
      // Auto-switch to preview if it looks like there is code
      if (output.includes('```')) {
        setTimeout(() => setViewMode('preview'), 1000);
      }
    } catch (error: any) {
      setLogs(prev => [...prev, "ERROR: Synthesis Failure.", String(error.message || error)]);
    } finally {
      setIsGenerating(false);
    }
  };

  const extractCode = (markdown: string) => {
    const codeMatch = markdown.match(/```(?:html|javascript|typescript|jsx|tsx|css)?\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1] : null;
  };

  const downloadCode = () => {
    if (!result) return;
    const code = extractCode(result) || result;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `locobot-${mode.toLowerCase()}-export.html`;
    a.click();
  };

  const copyToClipboard = () => {
    if (!result) return;
    const code = extractCode(result) || result;
    navigator.clipboard.writeText(code);
    alert("Neural Link Copied: Code is in your clipboard.");
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

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

      {(logs.length > 0 || result) && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Logs Panel */}
          <GlassCard hoverable={false} className="lg:col-span-1 h-[650px] flex flex-col">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">System Telemetry</h4>
            <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 text-zinc-400">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-zinc-700">[{new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                  <span>{log}</span>
                </div>
              ))}
              {isGenerating && <div className="animate-pulse">_SPOOLING_DATA</div>}
            </div>
          </GlassCard>

          {/* Output / Preview Panel */}
          <GlassCard hoverable={false} className="lg:col-span-3 h-[650px] flex flex-col p-0 overflow-hidden relative">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-10">
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
                <button 
                  onClick={() => setViewMode('blueprint')}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-widest transition-all ${viewMode === 'blueprint' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  Blueprint
                </button>
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-1.5 text-[10px] font-bold rounded-md uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  Neural Preview
                </button>
              </div>

              {result && (
                <div className="flex gap-2">
                  <button onClick={copyToClipboard} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-colors uppercase tracking-widest">
                    Copy Code
                  </button>
                  <button onClick={downloadCode} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-[10px] font-bold rounded-lg hover:bg-zinc-700 transition-colors uppercase tracking-widest">
                    Download
                  </button>
                  <button onClick={() => alert("Creating Virtual Repo...")} className="px-4 py-1.5 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-widest">
                    Deploy
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-black/20">
              {result ? (
                viewMode === 'blueprint' ? (
                  <div 
                    className="markdown-content p-8 text-sm leading-relaxed text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
                  />
                ) : (
                  <iframe 
                    title="Neural Preview"
                    srcDoc={extractCode(result) || `<html><body style="background:#000;color:#fff;font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:90vh;"><h2>No preview code found. Check Blueprint.</h2></body></html>`}
                    className="w-full h-full border-none bg-white rounded-b-3xl"
                  />
                )
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-zinc-600">
                  <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                  <p className="animate-pulse font-mono text-xs uppercase tracking-[0.3em]">Decoding Synthesis Stream...</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-700 font-mono text-xs uppercase tracking-widest">
                  System Idle. Awaiting Synthesis.
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};