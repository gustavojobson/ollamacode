'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Smartphone, CheckCircle2, Plus, Sparkles, MessageSquare, ListTodo, ShieldCheck, Flame, Trash2, WifiOff, RefreshCw, Layers, Server, Play, Send } from 'lucide-react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  tag?: 'Feature' | 'UI/UX' | 'Refactor' | 'Test';
};

export function EmulatorPane() {
  const { sysLogs } = useStore();
  const [url, setUrl] = useState('');
  const [systemTime, setSystemTime] = useState('14:15');

  // Parse server URL from sysLogs
  useEffect(() => {
    const serverLog = [...sysLogs].reverse().find(
      log => log.includes('http://localhost:') || log.includes('http://127.0.0.1:')
    );
    if (serverLog) {
      const match = serverLog.match(/(https?:\/\/(localhost|127\.0\.0\.1):\d+)/i);
      if (match && match[0]) {
        setTimeout(() => {
          setUrl(prev => prev !== match[0] ? match[0] : prev);
        }, 0);
      }
    }
  }, [sysLogs]);

  // System clock simulator
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setSystemTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Tasks state for 5173 mobile mockup (Vite)
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Implement Clean Architecture', completed: false, tag: 'Feature' },
    { id: 2, title: 'Setup Zustand Store', completed: false, tag: 'Feature' },
    { id: 3, title: 'Configure Tailwind CSS', completed: true, tag: 'UI/UX' },
    { id: 4, title: 'Write Vitest Unit Tests', completed: false, tag: 'Test' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newTask: Task = {
      id: Date.now(),
      title: inputText.trim(),
      completed: false,
      tag: 'Feature'
    };
    setTasks([...tasks, newTask]);
    setInputText('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  // Chat message states for Port 3000 Mobile Preview (NextJS)
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'assistant', text: string }>>([
    { sender: 'assistant', text: 'Olá! Sou o assistente local do seu projeto. Como posso ajudar com sua API?' },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = { sender: 'user' as const, text: chatInput.trim() };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: 'assistant' as const,
        text: `Entendido! Buscando no runtime local para resolver seu endpoint. Status code: 200 OK.`
      }]);
    }, 1000);
  };

  return (
    <div className="flex-1 bg-[#050505] flex flex-col items-center justify-center p-4 overflow-y-auto w-full h-full relative">
      
      {/* Background Ambience decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Screen title - discrete and high contrast */}
      <div className="mb-4 text-center z-10 select-none">
        <h2 className="text-white text-xs font-mono uppercase tracking-widest flex items-center justify-center gap-1.5 opacity-80 font-semibold">
          <Smartphone size={14} className="text-purple-400" />
          Emulador Mobile iOS/Android
        </h2>
        <p className="text-[10px] text-gray-550 mt-1 font-sans">Simulando rendering de container em tempo de execução</p>
      </div>

      {/* Hardware simulator wrapper */}
      <div className="relative w-[310px] h-[610px] bg-[#121212] rounded-[48px] p-2.5 border-4 border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col z-10 transition-transform duration-300 select-none">
        
        {/* Dynamic Island / Speaker */}
        <div className="absolute top-1 w-24 h-[12px] bg-neutral-950 rounded-full flex items-center justify-between px-3 z-50 left-1/2 -translate-x-1/2 text-white border border-neutral-900 shadow-inner">
          <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-800 self-center"></div>
          <div className="w-1 h-1 rounded-full bg-blue-500/80 self-center animate-pulse"></div>
        </div>

        {/* Side Buttons Visual Only */}
        <div className="absolute -left-[6px] top-24 w-[2px] h-12 bg-neutral-700 rounded-r-sm"></div>
        <div className="absolute -left-[6px] top-[140px] w-[2px] h-10 bg-neutral-700 rounded-r-sm"></div>
        <div className="absolute -left-[6px] top-[190px] w-[2px] h-10 bg-neutral-700 rounded-r-sm"></div>
        <div className="absolute -right-[6px] top-28 w-[2px] h-14 bg-neutral-700 rounded-l-sm"></div>

        {/* Smartphone Screen display area */}
        <div className="w-full h-full rounded-[38px] bg-white overflow-hidden relative border border-neutral-950 flex flex-col">
          
          {/* Mobile Carrier Status Bar */}
          <div className="h-10 bg-white/80 backdrop-blur-md px-5 flex justify-between items-center text-[10px] font-sans font-semibold text-neutral-800 z-40 flex-shrink-0 select-none pointer-events-none">
            <span className="tracking-tight">{systemTime}</span>
            <div className="flex items-center space-x-1.5 font-sans">
              {/* Cellular Signal dots */}
              <div className="flex items-end space-x-0.5 h-2">
                <div className={`w-0.5 h-1 rounded-full ${url ? 'bg-neutral-800' : 'bg-neutral-300'}`}></div>
                <div className={`w-0.5 h-1.5 rounded-full ${url ? 'bg-neutral-800' : 'bg-neutral-300'}`}></div>
                <div className={`w-0.5 h-2 rounded-full ${url ? 'bg-neutral-800' : 'bg-neutral-300'}`}></div>
                <div className={`w-0.5 h-2 rounded-full ${url ? 'bg-neutral-800' : 'bg-neutral-300'}`}></div>
              </div>
              {/* WiFi simulation */}
              <svg className={`w-2.5 h-2.5 ${url ? 'text-neutral-800' : 'text-neutral-300 animate-pulse'}`} fill="currentColor" viewBox="0 0 16 16">
                <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049z"/>
              </svg>
              {/* Battery Sim */}
              <div className="w-5 h-2.5 border border-neutral-700 rounded-sm p-0.5 flex items-center relative">
                <div className="h-full w-[85%] bg-neutral-800 rounded-[1px]"></div>
                <div className="absolute right-[-2.5px] top-[3px] w-[2px] h-[4px] bg-neutral-700 rounded-r-xs"></div>
              </div>
            </div>
          </div>

          {/* Conditional inside device frame */}
          {url === '' ? (
            /* BLANK STATE: iOS Desconectado */
            <div className="flex-1 flex flex-col bg-zinc-950 p-5 items-center justify-center text-center select-none relative">
              {/* Soft purple and blue blurred backing glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-5 text-zinc-500 relative shadow-lg animate-pulse">
                <WifiOff size={22} className="text-zinc-650" />
              </div>

              <h3 className="text-zinc-200 text-xs font-bold uppercase tracking-wider font-mono mb-1.5">
                Sem Sinal Ativo
              </h3>
              <p className="text-[10px] text-zinc-500 font-sans leading-relaxed px-2">
                Aguardando orquestrador iniciar o servidor mobile...
              </p>

              {/* Fast connect buttons */}
              <div className="mt-8 bg-zinc-900/40 border border-zinc-800/50 p-2.5 rounded-2xl w-full z-10 select-none">
                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest block mb-2 font-mono">
                  Testar Simulações
                </span>
                <div className="flex flex-col gap-1.5">
                  <button 
                    onClick={() => setUrl('http://localhost:5173')}
                    className="w-full py-1.5 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-mono rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-0"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    Link: 5173 (Vite App)
                  </button>
                  <button 
                    onClick={() => setUrl('http://localhost:3000')}
                    className="w-full py-1.5 bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[10px] font-mono rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-1.5 focus:outline-none focus:ring-0"
                  >
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                    Link: 3000 (NextJS Chat)
                  </button>
                </div>
              </div>
            </div>
          ) : url.includes('5173') ? (
            /* VITE TASKRUNNER APP */
            <div className="flex-1 flex flex-col bg-gray-50/70 p-5 overflow-y-auto justify-start relative select-text">
              {/* App Nav Section inside Display */}
              <div className="flex justify-between items-center mb-5 mt-2 flex-shrink-0 font-sans">
                <div className="flex items-center space-x-1.5 rounded-lg select-none">
                  <div className="w-7 h-7 bg-[#1c64f2] rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <CheckCircle2 size={15} className="text-white" />
                  </div>
                  <h1 className="text-md font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">TaskFlow</h1>
                </div>
                <div className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full flex items-center gap-0.5 shadow-sm select-none">
                  <Flame size={10} className="w-2.5 h-2.5 animate-bounce text-orange-500" />
                  <span>Streak: 4</span>
                </div>
              </div>

              {/* Simulated Banner card */}
              <div className="bg-gradient-to-r from-[#1c64f2] to-[#4f46e5] text-white p-4 rounded-2xl shadow-md mb-4 text-left relative overflow-hidden flex-shrink-0 select-none">
                 <div className="relative z-10 font-sans">
                   <div className="text-[9px] uppercase tracking-wider font-extrabold text-blue-100 flex items-center gap-1">
                     <Sparkles size={10} />
                     Workspace Ativo
                   </div>
                   <h2 className="text-sm font-bold mt-0.5">Visão Geral de Geração</h2>
                   <p className="text-[10px] text-blue-100 mt-1">Concluído: <strong className="text-white">{completedCount}</strong> de <strong className="text-white">{tasks.length}</strong> metas</p>
                   
                   {/* Mini progress bar inside emu */}
                   <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
                     <div 
                       className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                       style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
                     ></div>
                   </div>
                 </div>
                 <div className="w-24 h-24 bg-white/5 rounded-full absolute -right-4 -bottom-4"></div>
              </div>

              <div className="flex items-center justify-between mb-2 px-1 font-sans select-none">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tarefas da Feature Sliced</span>
                <span className="text-[9px] font-medium text-gray-500">{tasks.length} itens</span>
              </div>

              {/* App task list */}
              {tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center select-none font-sans">
                  <ListTodo size={32} className="text-gray-300 mb-2" />
                  <p className="text-xs text-gray-400 font-medium font-sans">Nenhuma tarefa por aqui!</p>
                  <p className="text-[9px] text-gray-400 opacity-60 font-sans">Adicione uma tarefa no formulário abaixo.</p>
                </div>
              ) : (
                <div className="space-y-2 mb-4 font-sans max-h-48 overflow-y-auto">
                  {tasks.map(t => (
                    <div 
                      key={t.id} 
                      className={`p-3 bg-white border border-neutral-100/80 rounded-xl flex items-center justify-between shadow-xs transition-all active:scale-95 group border-l-3 ${t.completed ? 'border-l-emerald-400' : 'border-l-blue-500'}`}
                    >
                      <div className="flex items-center space-x-2.5 min-w-0 pr-2 font-sans">
                        <button 
                          onClick={() => toggleTask(t.id)} 
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${t.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300 bg-white hover:border-gray-400'}`}
                        >
                          {t.completed && <CheckCircle2 size={11} className="stroke-[3]" />}
                        </button>
                        <span className={`text-[11px] font-semibold truncate ${t.completed ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                          {t.title}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1 flex-shrink-0 font-sans">
                        {t.tag && !t.completed && (
                          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                            t.tag === 'Feature' ? 'bg-purple-100 text-purple-600' :
                            t.tag === 'UI/UX' ? 'bg-blue-100 text-blue-600' :
                            t.tag === 'Test' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'
                          }`}>
                            {t.tag}
                          </span>
                        )}
                        <button 
                          onClick={() => removeTask(t.id)}
                          className="text-neutral-300 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Input task section pinned inside display */}
              <form onSubmit={handleAddTask} className="mt-auto pt-2 flex gap-1.5 flex-shrink-0 bg-transparent font-sans">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="Criar nova tarefa..." 
                  className="flex-1 text-[11px] border border-neutral-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1.5 focus:ring-blue-500 bg-white/90 shadow-xs placeholder:text-gray-400" 
                />
                <button 
                  type="submit"
                  className="p-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/10 active:scale-95 transition-transform flex items-center justify-center flex-shrink-0"
                >
                  <Plus size={14} className="stroke-[3]" />
                </button>
              </form>

              <div className="mt-3 flex items-center justify-center text-[7px] text-gray-400 gap-1 opacity-70 select-none font-sans">
                <ShieldCheck size={10} className="text-emerald-500" />
                <span>Conexão Local Segura (Porta: 5173)</span>
              </div>
            </div>
          ) : (
            /* NEXTJS / OTHER MOBILE CONTAINER VIEW (Port 3000 & Others) */
            <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 p-4 justify-between select-text relative">
              {/* Mobile Header */}
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800 flex-shrink-0">
                <div className="flex items-center space-x-1.5 select-none font-sans">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <span className="text-[11px] font-bold text-white tracking-wider">NextJS Mobile App</span>
                </div>
                <span className="text-[8px] font-bold px-1 py-0.5 bg-slate-800 text-indigo-400 rounded-md font-mono">Port: 3000</span>
              </div>

              {/* Messages viewport */}
              <div className="flex-1 overflow-y-auto space-y-2.5 mb-3 pr-0.5 max-h-[380px] text-left font-sans flex flex-col justify-end pt-12">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-2.5 max-w-[85%] rounded-2xl text-[10px] leading-relaxed shadow-sm ${
                      m.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
                    }`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat action Form */}
              <form onSubmit={handleSendChatMessage} className="mt-auto flex gap-1 bg-slate-950/40 p-1 rounded-xl border border-slate-800 flex-shrink-0 font-sans">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Fale com a API..." 
                  className="flex-1 bg-transparent text-[10px] px-2 py-1 focus:outline-none text-white font-sans placeholder:text-slate-600" 
                />
                <button 
                  type="submit"
                  className="p-1 px-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[10px] font-semibold text-white flex items-center justify-center active:scale-95 transition-all"
                >
                  <Send size={10} />
                </button>
              </form>

              <div className="mt-2.5 flex items-center justify-center text-[7px] text-zinc-550 gap-1 opacity-70 select-none font-sans">
                <Server size={10} className="text-zinc-650" />
                <span>Serving on {url || 'http://localhost:3000'}</span>
              </div>
            </div>
          )}

          {/* Hardware bottom notch/home bar simulation */}
          <div className="h-4 bg-white px-5 flex items-center justify-center z-40 pb-1.5 flex-shrink-0 pointer-events-none">
            <div className="w-24 h-1 bg-neutral-900 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
