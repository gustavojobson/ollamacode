'use client';

import { useStore } from '@/lib/store';
import { Globe, RefreshCw, X, Maximize2, TerminalSquare, AlertTriangle, MonitorPlay, Wifi, Activity, CheckCircle2, Cpu, Server, Database, CheckSquare, Layers, Sparkles, Play, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function PreviewPane({ forceShow }: { forceShow?: boolean }) {
  const { previewOpen, togglePreview, sysLogs } = useStore();
  const [url, setUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'console' | 'network' | 'lighthouse'>('preview');
  const [isLoading, setIsLoading] = useState(false);
  const urlRef = useRef('');

  // Auto-detect server link or port from the terminal logs (sysLogs)
  useEffect(() => {
    const serverLog = [...sysLogs].reverse().find(
      log => log.includes('http://localhost:') || log.includes('http://127.0.0.1:')
    );
    if (serverLog) {
      const match = serverLog.match(/(https?:\/\/(localhost|127\.0\.0\.1):\d+)/i);
      if (match && match[0] && urlRef.current !== match[0]) {
        urlRef.current = match[0];
        setTimeout(() => {
          setIsLoading(true);
          setUrl(match[0]);
          setTimeout(() => {
            setIsLoading(false);
          }, 1200);
        }, 0);
      }
    }
  }, [sysLogs]);

  // Task lists state for Vite / 5173 template
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Implement Clean Architecture', completed: false, tag: 'Feature' as const },
    { id: 2, title: 'Setup Zustand Store', completed: false, tag: 'Feature' as const },
    { id: 3, title: 'Configure Tailwind CSS', completed: true, tag: 'UI/UX' as const }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks([...tasks, { id: Date.now(), title: newTaskText.trim(), completed: false, tag: 'Feature' }]);
    setNewTaskText('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // NextJS Prompt states for NEXT / 3000 template
  const [prompt, setPrompt] = useState('Gere um CRUD simples usando Next.js 15');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const triggerMockGeneration = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setAiResponse(`// Código gerado para: ${prompt}
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ success: true, message: "CRUD Ready" });
}`);
      setIsGenerating(false);
    }, 1500);
  };

  if (!previewOpen && !forceShow) return null;

  return (
    <div className="w-full md:w-[400px] flex-shrink-0 flex flex-col border-l border-[#1e1e1e] bg-[#0d0d0d] h-full z-10 shadow-2xl">
      {/* Header */}
      <div className="p-3 border-b border-[#1e1e1e] flex flex-col space-y-3 bg-[#0a0a0a]">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MonitorPlay size={14} className="text-blue-400" />
            <span className="text-xs font-bold text-[#e1e1e1] font-sans">PREVIEW</span>
            {isLoading && <span className="text-[10px] text-yellow-500 animate-pulse ml-2 font-mono">Building...</span>}
          </div>
          <div className="flex space-x-1 text-[#cccccc]">
            <button className="p-1 hover:text-white hover:bg-[#1e1e1e] rounded transition-colors" onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 800); }} title="Recarregar">
               <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
            </button>
            <button className="p-1 hover:text-white hover:bg-[#1e1e1e] rounded transition-colors" title="Maximizar">
               <Maximize2 size={12} />
            </button>
            <button className="p-1 hover:text-white hover:bg-[#1e1e1e] rounded transition-colors" onClick={togglePreview} title="Fechar">
               <X size={12} />
            </button>
          </div>
        </div>

        {/* Browser URL Bar */}
        <div className="flex items-center space-x-2 bg-[#1e1e1e] border border-[#2d2d2d] rounded-md px-2 py-1">
          <Globe size={12} className="opacity-40 text-gray-300" />
          <input 
            type="text" 
            value={url}
            placeholder="Aguardando servidor... Ex: http://localhost:5173"
            onChange={(e) => setUrl(e.target.value)}
            className="bg-transparent border-none outline-none text-xs text-[#cccccc] w-full font-mono placeholder:text-gray-600"
          />
          <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${url ? 'bg-green-500' : 'bg-neutral-700 animate-pulse'}`} title={url ? "Servidor Conectado" : "Disconnected / Em Branco"}></div>
        </div>

        <div className="flex items-center space-x-4 text-[10px] uppercase font-bold tracking-wider pt-1 font-sans">
          <button 
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'preview' ? 'border-blue-400 text-blue-400' : 'border-transparent text-[#cccccc] opacity-60 hover:opacity-100'}`}
            onClick={() => setActiveTab('preview')}
          >
            App
          </button>
          <button 
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'console' ? 'border-purple-400 text-purple-400' : 'border-transparent text-[#cccccc] opacity-60 hover:opacity-100 flex items-center space-x-1'}`}
            onClick={() => setActiveTab('console')}
          >
            <TerminalSquare size={10} className="mr-1"/> Console <span className="ml-1 bg-red-500/20 text-red-400 px-1 rounded-sm font-mono">1</span>
          </button>
          <button 
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'network' ? 'border-green-400 text-green-400' : 'border-transparent text-[#cccccc] opacity-60 hover:opacity-100 flex items-center space-x-1'}`}
            onClick={() => setActiveTab('network')}
          >
            <Wifi size={10} className="mr-1"/> Network
          </button>
          <button 
            className={`pb-1 border-b-2 transition-colors ${activeTab === 'lighthouse' ? 'border-orange-400 text-orange-400' : 'border-transparent text-[#cccccc] opacity-60 hover:opacity-100 flex items-center space-x-1'}`}
            onClick={() => setActiveTab('lighthouse')}
          >
            <Activity size={10} className="mr-1"/> Audit
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white relative overflow-hidden">
        {activeTab === 'preview' && (
          <div className="w-full h-full flex items-center justify-center bg-white text-black text-center relative overflow-y-auto">
            {isLoading ? (
               <div className="flex flex-col items-center space-y-4">
                 <RefreshCw size={24} className="animate-spin text-blue-500" />
                 <span className="text-sm font-medium text-gray-500 font-sans">Conectando ao runtime container...</span>
               </div>
            ) : url === '' ? (
              /* BLANK STATE: Starts completely "em branco" */
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 text-white font-sans p-6 text-center select-none relative">
                {/* Elegant tech grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.35] pointer-events-none"></div>

                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 relative z-10 shadow-xl animate-pulse">
                  <Globe size={24} className="text-zinc-500" />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-zinc-700 rounded-full border-2 border-zinc-950"></span>
                </div>

                <div className="relative z-10 max-w-xs">
                  <h3 className="text-xs font-bold text-zinc-100 tracking-wider uppercase font-mono mb-2">
                    Visualizador Em Branco
                  </h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed mb-6 font-sans text-center">
                    Aguardando a inicialização de um servidor no terminal. Uma vez iniciado, a porta será vinculada automaticamente.
                  </p>

                  {/* Manual testing shortcuts */}
                  <div className="bg-zinc-900/50 border border-zinc-800/80 p-3 rounded-xl backdrop-blur-md">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block mb-2 font-mono">
                      Simular Portas de Desenvolvimento
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setUrl('http://localhost:5173')}
                        className="px-2 py-1.5 bg-zinc-800 hover:bg-[#1a56db] text-zinc-300 hover:text-white rounded-lg text-[10px] font-mono transition-all border border-zinc-700 active:scale-95 flex items-center justify-center gap-1.5 focus:outline-none"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                        Vite: 5173
                      </button>
                      <button 
                        onClick={() => setUrl('http://localhost:3000')}
                        className="px-2 py-1.5 bg-zinc-800 hover:bg-[#7e3af2] text-zinc-300 hover:text-white rounded-lg text-[10px] font-mono transition-all border border-zinc-700 active:scale-95 flex items-center justify-center gap-1.5 focus:outline-none"
                      >
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                        Next: 3000
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : url.includes('5173') ? (
              /* VITE / 5173 APP PREVIEW */
              <div className="w-full h-full border-4 border-dashed border-gray-200 rounded-2xl flex flex-col pt-6 bg-gray-50 items-center overflow-y-auto px-4 pb-4 select-text relative">
                <div className="w-full max-w-[95%] bg-white shadow-xl rounded-xl border border-gray-100 p-5 flex flex-col mb-4 relative z-10 transition-all">
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 bg-blue-600 rounded-lg shadow-inner flex items-center justify-center text-white font-bold">
                        V
                      </div>
                      <h1 className="text-md font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-purple-600">TaskFlow Vite</h1>
                    </div>
                    <div className="text-[10px] font-semibold px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Local: 5173</div>
                  </div>
                  
                  <div className="space-y-2 w-full text-left font-sans">
                    {tasks.map(t => (
                      <div 
                        key={t.id} 
                        className="p-2.5 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-between group hover:border-blue-200 transition-colors"
                      >
                        <div className="flex items-center space-x-2.5">
                          <button 
                            onClick={() => toggleTask(t.id)}
                            className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${t.completed ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 bg-white'}`}
                          >
                            {t.completed && <CheckCircle2 size={12} />}
                          </button>
                          <span className={`text-xs font-medium ${t.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                            {t.title}
                          </span>
                        </div>
                        {t.tag && (
                          <span className="bg-purple-50 text-purple-600 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                            {t.tag}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleAddTask} className="mt-5 flex space-x-2 w-full">
                    <input 
                      type="text" 
                      value={newTaskText} 
                      onChange={e => setNewTaskText(e.target.value)}
                      placeholder="Criar nova tarefa..." 
                      className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1.5 focus:ring-blue-500/50 bg-gray-50/50" 
                    />
                    <button type="submit" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-md transition-all active:scale-95">
                      Adicionar
                    </button>
                  </form>
                </div>
                
                <div className="absolute inset-0 pointer-events-none grid-bg opacity-[0.03]"></div>
                
                <div className="mt-auto mb-2 text-[9px] text-gray-400 font-mono bg-white/80 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-gray-100 z-10 flex items-center gap-1.5 select-none font-sans">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                  HMR Vite Ativo
                </div>
              </div>
            ) : url.includes('3000') ? (
              /* NEXT.JS / 3000 APP PREVIEW */
              <div className="w-full h-full flex flex-col bg-slate-900 text-slate-100 font-sans p-4 overflow-y-auto select-text relative font-sans">
                <div className="flex justify-between items-center bg-slate-800/80 rounded-xl p-3 mb-4 border border-slate-700/50">
                  <div className="flex items-center space-x-2">
                    <Layers className="text-indigo-400 w-4 h-4" />
                    <span className="text-xs font-semibold tracking-tight text-white">Next.js Dev Workspace</span>
                  </div>
                  <div className="flex items-center space-x-1.5 font-sans">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping"></span>
                    <span className="text-[9px] font-bold text-indigo-400">Port 3000</span>
                  </div>
                </div>

                <div className="text-left mb-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
                    AI Agent LLM Sandbox
                  </h4>
                  <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                    Painel local de testes para criação de componentes e consultas na API server-side do ecossistema.
                  </p>
                </div>

                {/* Simulated dynamic generative widget */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 mb-4 text-left">
                  <label className="text-[9px] font-bold text-slate-500 uppercase block mb-1 font-sans">
                    Prompt de Geração do Código
                  </label>
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      value={prompt}
                      onChange={e => setPrompt(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <button 
                      onClick={triggerMockGeneration}
                      disabled={isGenerating}
                      className="px-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs flex items-center justify-center transition-colors active:scale-95 focus:outline-none disabled:opacity-50"
                    >
                      {isGenerating ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
                    </button>
                  </div>

                  {aiResponse && (
                    <div className="mt-3 bg-slate-900 rounded-lg p-2.5 border border-slate-800 overflow-x-auto max-h-24">
                      <pre className="text-[9px] font-mono text-emerald-400 leading-tight">
                        {aiResponse}
                      </pre>
                    </div>
                  )}
                </div>

                {/* RAM / System metrics */}
                <div className="mt-auto grid grid-cols-2 gap-2 select-none">
                  <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-[8px] text-slate-500 font-mono uppercase">VRAM Alloc</span>
                    <span className="text-xs font-semibold text-white mt-1 font-sans">4.21 GB / 8.00 GB</span>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full" style={{ width: '52%' }}></div>
                    </div>
                  </div>
                  <div className="p-2 bg-slate-950/40 rounded-lg border border-slate-800 flex flex-col">
                    <span className="text-[8px] text-slate-500 font-mono uppercase">Next.js Cache</span>
                    <span className="text-xs font-semibold text-emerald-400 mt-1 font-sans">94% Hit Rate</span>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div className="bg-emerald-500 h-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* OTHER PORTS / BACKEND PREVIEW */
              <div className="w-full h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans p-4 overflow-y-auto select-text relative">
                <div className="flex justify-between items-center bg-zinc-900 border border-zinc-800 rounded-xl p-3 mb-4 font-sans">
                  <div className="flex items-center space-x-2">
                    <Server className="text-amber-500 w-4 h-4" />
                    <span className="text-xs font-semibold text-white truncate max-w-[150px]">{url}</span>
                  </div>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-amber-950 text-amber-400 rounded-md uppercase tracking-wider font-mono">Backend Pit</span>
                </div>

                <div className="text-left space-y-3 mb-4 font-sans max-w-full">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono">HTTP Gateway Monitor</h4>
                    <p className="text-[10px] text-zinc-500">Conexão REST/WebSocket detectada com sucesso na porta informada.</p>
                  </div>

                  <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800 text-[10px] space-y-2 font-mono">
                    <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
                      <span className="text-zinc-500">HTTP Status</span>
                      <span className="text-emerald-400 font-bold">200 OK</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800/80 pb-1.5">
                      <span className="text-zinc-500">CORS Policy</span>
                      <span className="text-amber-400 font-mono">Allow All (*)</span>
                    </div>
                    <div className="flex justify-between pb-0.5">
                      <span className="text-zinc-500">Database Engine</span>
                      <span className="text-zinc-300 font-mono flex items-center gap-1">
                        <Database size={10} className="text-blue-400" />
                        Ollama DB (Lite)
                      </span>
                    </div>
                  </div>

                  {/* REST client tester */}
                  <div className="bg-zinc-900/40 p-2.5 border border-zinc-800/80 rounded-xl">
                    <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase block mb-1.5">Enviar Teste GET Request</span>
                    <div className="flex gap-1 w-full">
                      <span className="bg-zinc-800 px-2 py-1 text-[9px] text-[#cccccc] rounded-lg font-mono flex items-center justify-center select-none">GET</span>
                      <input 
                        type="text" 
                        readOnly 
                        value="/api/v1/health" 
                        className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded-lg px-2 text-[10px] text-zinc-400 focus:outline-none font-mono" 
                      />
                      <button 
                        onClick={() => alert('Parabéns! O endpoint respondeu com sucesso: {"status": "ok", "db": "healthy"}')}
                        className="p-1 px-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold rounded-lg text-xs"
                      >
                        Ping
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-center gap-1.5 text-[9px] text-zinc-500 font-mono select-none">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  SSL Bypass (Simulated Sandbox)
                </div>
              </div>
            )}
            
            {/* Dev overlay indicating internal server */}
            {url && (
              <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-2 py-1 rounded shadow-lg backdrop-blur flex items-center space-x-1 select-none pointer-events-none font-mono">
                 <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                 <span>Conectado</span>
              </div>
            )}
          </div>
        )}

        {activeTab === 'console' && (
          <div className="w-full h-full bg-[#1e1e1e] p-3 font-mono text-[11px] overflow-y-auto">
            <div className="flex space-x-2 text-[#cccccc] mb-2 border-b border-[#2d2d2d] pb-2">
              <span className="opacity-40">Info</span>
              <span>[HMR] connected</span>
            </div>
            <div className="flex space-x-2 text-yellow-400 mb-2 border-b border-[#2d2d2d] pb-2">
              <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
              <span>[Deprecation] SharedArrayBuffer will require cross-origin isolation.</span>
            </div>
            <div className="flex space-x-2 text-red-400 bg-red-900/10 p-2 rounded border border-red-900/30">
              <X size={12} className="flex-shrink-0 mt-0.5 text-red-500" />
              <div className="flex flex-col">
                <span className="font-bold">TypeError: Cannot read properties of undefined (reading &apos;map&apos;)</span>
                <span className="opacity-60 mt-1">at App (webpack-internal:///./app/page.tsx:24:15)</span>
                <span className="opacity-60">at renderWithHooks (react-dom.development.js:16305:18)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="w-full h-full bg-[#1e1e1e] p-0 font-sans text-[10px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2d2d2d] text-[#cccccc] opacity-60">
                   <th className="p-2 font-medium">Name</th>
                   <th className="p-2 font-medium">Status</th>
                   <th className="p-2 font-medium">Type</th>
                   <th className="p-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="text-[#cccccc]">
                <tr className="border-b border-[#2d2d2d]/50 hover:bg-[#2d2d2d]/30">
                  <td className="p-2 truncate font-mono">localhost</td>
                  <td className="p-2 text-green-400">200</td>
                  <td className="p-2">document</td>
                  <td className="p-2">12ms</td>
                </tr>
                <tr className="border-b border-[#2d2d2d]/50 hover:bg-[#2d2d2d]/30">
                  <td className="p-2 truncate font-mono">page.js</td>
                  <td className="p-2 text-green-400">200</td>
                  <td className="p-2 font-mono">script</td>
                  <td className="p-2 font-mono">45ms</td>
                </tr>
                <tr className="border-b border-[#2d2d2d]/50 hover:bg-[#2d2d2d]/30">
                  <td className="p-2 truncate font-mono">api/generate</td>
                  <td className="p-2 text-blue-400 font-mono">201</td>
                  <td className="p-2">fetch/SSE</td>
                  <td className="p-2 text-yellow-400 font-mono">1204ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'lighthouse' && (
          <div className="w-full h-full bg-[#0a0a0a] p-4 flex flex-col items-center justify-center font-sans select-none">
             <div className="grid grid-cols-2 gap-4 w-full max-w-[300px]">
                <div className="flex flex-col items-center p-3 bg-[#1e1e1e] rounded-xl border border-green-500/30">
                   <div className="text-3xl font-bold text-green-400">98</div>
                   <div className="text-[10px] text-[#cccccc] uppercase mt-1">Performance</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-[#1e1e1e] rounded-xl border border-green-500/30">
                   <div className="text-3xl font-bold text-green-400">100</div>
                   <div className="text-[10px] text-[#cccccc] uppercase mt-1">Accessibility</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-[#1e1e1e] rounded-xl border border-green-500/30">
                   <div className="text-3xl font-bold text-green-400">100</div>
                   <div className="text-[10px] text-[#cccccc] uppercase mt-1">Best Practices</div>
                </div>
                <div className="flex flex-col items-center p-3 bg-[#1e1e1e] rounded-xl border border-green-500/30">
                   <div className="text-3xl font-bold text-green-400">100</div>
                   <div className="text-[10px] text-[#cccccc] uppercase mt-1">SEO</div>
                </div>
             </div>
             
             <div className="mt-8 text-center text-xs text-[#cccccc] opacity-60 max-w-[250px] font-sans">
                These scores are calculated from your local Internal Runtime Server. Performance might differ in production.
             </div>
             <button className="mt-4 px-4 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-500 transition-colors focus:outline-none">
                Generate New Report
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
