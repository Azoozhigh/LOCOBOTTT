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
    [ArchitectMode.WEB]: { placeholder: "Design a luxury real estate dashboard with glassmorphism...", color: "text-blue-400" },
    [ArchitectMode.GAMES]: { placeholder: "Create a neon-synthwave space shooter game using HTML5 Canvas...", color: "text-purple-400" },
    [ArchitectMode.APPS]: { placeholder: "Build a health tracking app interface with caloric progress bars...", color: "text-emerald-400" },
    [ArchitectMode.AUTOMATION]: { placeholder: "Write a script that visualizes server uptime metrics...", color: "text-orange-400" },
    [ArchitectMode.LEARNING]: { placeholder: "Teach me how to build a 3D renderer using pure JavaScript...", color: "text-pink-400" },
  };

  const extractCode = (markdown: string) => {
    // Looks for the largest HTML/executable block
    const codeMatch = markdown.match(/```(?:html|javascript|typescript|jsx|tsx|css)?\n([\s\S]*?)```/);
    return codeMatch ? codeMatch[1] : null;
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    setViewMode('blueprint');
    setLogs(["Synchronizing with Neosynthetic Neural Hub...", "Sampling 2045 Design Trends...", "Synthesizing Single-File Runtime..."]);

    try {
      const output = await generateBlueprint(mode, prompt);
      setResult(output);
      setLogs(prev => [...prev, "Synthesis successful.", "Execution environment ready.", "Preview generated."]);
      
      if (extractCode(output)) {
        setTimeout(() => setViewMode('preview'), 1200);
      }
    } catch (error: any) {
      setLogs(prev => [...prev, "CRITICAL ERROR: Neural link severed.", String(error.message || error)]);
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
    a.download = `LOCOBOT_${mode}_BUILD_${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!result) return;
    const code = extractCode(result) || result;
    navigator.clipboard.writeText(code);
    alert("Code sequence copied to neural clipboard.");
  };

  const handleGitHub = () => {
    if (!result) return;
    setLogs(prev => [...prev, "Generating Virtual GitHub Repository...", "Authenticating via biometric link...", "Build pushed to locobot-cloud-2045."]);
    alert("Project pushed to LOCOBOT Cloud repository.");
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-40">
      <GlassCard hoverable={false} className="mb-10 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-2.5 h-2.5 rounded-full bg-current ${modeConfig[mode].color} animate-pulse shadow-[0_0_15px_currentColor]`}></div>
          <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${modeConfig[mode].color}`}>
            Synthesis Engine: {mode} Mode
          </span>
        </div>

        <div className="relative">
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={modeConfig[mode].placeholder}
            className="w-full h-48 bg-white/[0.02] border border-white/10 rounded-3xl p-8 text-2xl focus:outline-none focus:ring-1 focus:ring-white/20 transition-all resize-none font-light placeholder:text-zinc-800"
          />
          <button 
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className={`
              absolute bottom-8 right-8 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all
              ${isGenerating || !prompt ? 'bg-zinc-900 text-zinc-700 cursor-not-allowed' : 'bg-white text-black hover:scale-105 active:scale-95 shadow-2xl'}
            `}
          >
            {isGenerating ? 'Synthesizing...' : 'Snythesize Build'}
          </button>
        </div>
      </GlassCard>

      {(logs.length > 0 || result) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[800px]">
          {/* Status Panel */}
          <GlassCard hoverable={false} className="lg:col-span-3 flex flex-col border border-white/10">
            <h4 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-600 mb-6 border-b border-white/5 pb-4">Neural Logs</h4>
            <div ref={scrollRef} className="flex-1 overflow-y-auto font-mono text-[11px] space-y-3 text-zinc-500 pr-4">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-zinc-800 tabular-nums">[{i.toString().padStart(2, '0')}]</span>
                  <span className={log.includes('ERROR') ? 'text-red-500' : ''}>{log}</span>
                </div>
              ))}
              {isGenerating && <div className="animate-pulse text-white/20">ACCESSING_REPO...</div>}
            </div>
          </GlassCard>

          {/* Workbench */}
          <GlassCard hoverable={false} className="lg:col-span-9 flex flex-col p-0 overflow-hidden border border-white/10 relative">
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-black/40 backdrop-blur-3xl sticky top-0 z-10">
              <div className="flex bg-zinc-950 rounded-xl p-1.5 border border-white/5">
                <button 
                  onClick={() => setViewMode('blueprint')}
                  className={`px-6 py-2.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all ${viewMode === 'blueprint' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  Blueprint
                </button>
                <button 
                  onClick={() => setViewMode('preview')}
                  className={`px-6 py-2.5 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all ${viewMode === 'preview' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}
                >
                  Live Runtime
                </button>
              </div>

              {result && !isGenerating && (
                <div className="flex gap-3">
                  <button onClick={handleCopy} className="p-3 bg-zinc-900/50 text-zinc-400 hover:text-white border border-white/5 rounded-xl transition-all" title="Copy Sequence">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                  </button>
                  <button onClick={handleDownload} className="p-3 bg-zinc-900/50 text-zinc-400 hover:text-white border border-white/5 rounded-xl transition-all" title="Export Payload">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  </button>
                  <button onClick={handleGitHub} className="flex items-center gap-3 px-6 py-3 bg-zinc-100 text-black text-[10px] font-black rounded-xl hover:bg-white transition-all uppercase tracking-widest">
                    <span>GitHub Push</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto bg-black/20">
              {result ? (
                viewMode === 'blueprint' ? (
                  <div 
                    className="markdown-content p-10 max-w-4xl mx-auto"
                    dangerouslySetInnerHTML={{ __html: marked.parse(result) }}
                  />
                ) : (
                  <iframe 
                    title="Neural Runtime"
                    srcDoc={extractCode(result) || `<html><body style="background:#000;color:#333;font-family:monospace;display:flex;justify-content:center;align-items:center;height:95vh;font-size:12px;letter-spacing:2px;">_NO_RUNTIME_PAYLOAD_DETECTED_</body></html>`}
                    className="w-full h-full border-none bg-white"
                    sandbox="allow-scripts allow-modals allow-popups"
                  />
                )
              ) : isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full gap-8">
                  <div className="relative">
                    <div className="w-20 h-20 border-b-2 border-white/10 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white/5 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <p className="animate-pulse font-mono text-[10px] uppercase tracking-[0.8em] text-zinc-600">Reconstructing Fragment</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-zinc-900 font-mono text-[11px] uppercase tracking-[0.5em] select-none">
                  Workbench Idle // Ready for Input
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};