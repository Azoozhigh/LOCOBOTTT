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
    [ArchitectMode.WEB]: { placeholder: "E.g., High-performance SaaS landing page with dark mode...", color: "text-blue-400" },
    [ArchitectMode.GAMES]: { placeholder: "E.g., Retro 2D space shooter with scoring system...", color: "text-purple-400" },
    [ArchitectMode.APPS]: { placeholder: "E.g., Modern finance dashboard with transaction history...", color: "text-emerald-400" },
    [ArchitectMode.AUTOMATION]: { placeholder: "E.g., Local service that monitors files and auto-syncs...", color: "text-orange-400" },
    [ArchitectMode.LEARNING]: { placeholder: "What would you like to master today?", color: "text-pink-400" },
  };

  const extractCode = (markdown: string) => {
    // Looks for the first large code block, assuming it's the executable part
    const codeMatch = markdown.match(/```(?:html|javascript|typescript|jsx|tsx|css)?\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1] : null;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setViewMode('blueprint');
    setLogs(["Uplinking to Neural Core...", "Gathering Data Fragments...", "Synthesizing Single-File Architecture..."]);

    try {
      const output = await generateBlueprint(mode, prompt);
      setResult(output);
      setLogs(prev => [...prev, "Synthesis Complete.", "Live Preview Initialized.", "Ready for Deployment."]);
      
      const executable = extractCode(output);
      if (executable) {
        // Auto-switch to preview after a short delay for dramatic effect
        setTimeout(() => setViewMode('preview'), 800);
      }
    } catch (error: any) {
      setLogs(prev => [...prev, "ERROR: Neural Link Interrupted.", String(error.message || error)]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const code = extractCode(result) || result;
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `locobot-${mode.toLowerCase()}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!result) return;
    const code = extractCode(result) || result;
    navigator.clipboard.writeText(code);
    alert("Full code copied to clipboard.");
  };

  const handleGitHubPush = () => {
    if (!result) return;
    const repoName = prompt.split(' ').slice(0, 3).join('-').toLowerCase() || 'locobot-project';
    const confirm = window.confirm(`Proceed to push this build to github.com/locobot-architect/${repoName}?`);
    if (confirm) {
      setLogs(prev => [...prev, "Creating Virtual Repository...", "Pushing Neural Commits...", "Success: GitHub link generated (Virtual)."]);
      alert("Project pushed to LOCOBOT Virtual Repository.");
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-40">
      <GlassCard hoverable={false} className="mb-8 border border-white/5">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-full bg-current ${modeConfig[mode].color} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
          <span className={`text-sm font-bold uppercase tracking-widest ${modeConfig[mode].color}`}>
            {mode} MODULE ONLINE
          </span>
        </div>

        <div className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={modeConfig[mode].placeholder}
            className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-xl focus:outline-none focus:ring-1 focus:ring-white/30 transition-all resize-none font-light placeholder:text-zinc-700"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`
              absolute bottom-6 right-6 px-8 py-3 rounded-xl font-bold transition-all shadow-xl
              ${isGenerating || !prompt ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:scale-105 active:scale-95'}
            `}
          >
            {isGenerating ? 'Synthesizing...' : 'Snythesize'}
          </button>
        </div>
      </GlassCard>

      {(logs.length > 0 || result) && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Telemetry Sidebar */}
          <GlassCard hoverable={false} className="lg:col-span-1 h-[700px] flex flex-col border border-white/5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4 border-b border-white/5 pb-2">Telemetry</h4>
            <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-[10px] space-y-2 text-zinc-400">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-zinc-700">[{new Date().toLocaleTimeString([], {hour12: false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                  <span className={log.startsWith('ERROR') ? 'text-red-500' : ''}>{log}</span>
                </div>
              ))}
              {isGenerating && <div className="animate-pulse text-zinc-600">_BUFFERING_STREAM</div>}
            </div>
          </GlassCard>

          {/* Execution Environment */}
          <GlassCard hoverable={false} className="lg:col-span-3 h-[700px] flex flex-col p-0 overflow-hidden relative border border-white/10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-10">
              <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
                <button 
                  onClick={() => setViewMode('blueprint')}
                  className={`px-4 py-2 text-[10px] font-bold rounded-md uppercase tracking-widest transition-all ${viewMode === 'blueprint' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  Blueprint
                </button>
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-2 text-[10px] font-bold rounded-md uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  Live Preview
                </button>
              </div>

              {result && !isGenerating && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="p-2 bg-zinc-900 text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-colors" title="Copy Full Code">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                  <button onClick={handleDownload} className="p-2 bg-zinc-900 text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-colors" title="Download HTML">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </button>
                  <button onClick={handleGitHubPush} className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-zinc-200 transition-all uppercase tracking-widest">
                    <span>Push to GitHub</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-black/10">
              {result ? (
                viewMode === 'blueprint' ? (
                  <div 
                    className="markdown-content p-8 text-sm leading-relaxed text-zinc-300"
                    dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
                  />
                ) : (
                  <iframe 
                    title="Neural Preview"
                    srcDoc={extractCode(result) || `<html><body style="background:#000;color:#555;font-family:monospace;display:flex;justify-content:center;align-items:center;height:95vh;"><h3>_NO_EXECUTABLE_FOUND_</h3></body></html>`}
                    className="w-full h-full border-none bg-white rounded-b-3xl"
                    sandbox="allow-scripts"
                  />
                )
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 text-zinc-600">
                  <div className="relative">
                    <div className="w-16 h-16 border-b-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white/5 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="animate-pulse font-mono text-xs uppercase tracking-[0.4em]">Decoding High-Level Architecture...</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-800 font-mono text-[10px] uppercase tracking-[0.5em]">
                  Awaiting Neural Sequence
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};