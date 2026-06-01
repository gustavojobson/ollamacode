'use client';

import { useStore } from '@/lib/store';
import { X, Minimize2, Trash2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

type Tab = 'terminal' | 'agentLogs' | 'output' | 'debug';

export function TerminalPane() {
  const { terminalOpen, toggleTerminal, sysLogs, clearSysLogs, agentLogs, addAgentLog, clearAgentLogs } = useStore();
  const open = terminalOpen;
  
  const [activeTab, setActiveTab] = useState<Tab>('terminal');
  const endOfTerminalRef = useRef<HTMLDivElement>(null);
  const endOfAgentLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      if (activeTab === 'terminal') {
        endOfTerminalRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else if (activeTab === 'agentLogs') {
        endOfAgentLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [sysLogs, agentLogs, open, activeTab]);

  useEffect(() => {
    // Connect to WebSocket Orchestrator
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3001`;
    let ws: WebSocket;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Connected to Orchestrator WebSocket');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            addAgentLog({ 
              type: data.type || 'unknown', 
              payload: data.payload || data,
              timestamp: new Date()
            });
          } catch (e) {
            console.error('Failed to parse WS message', e);
          }
        };

        ws.onclose = () => {
          console.log('WS Connection closed, retrying in 5s...');
          setTimeout(connect, 5000);
        };
      } catch (e) {
        console.error('WS Connection error', e);
      }
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [addAgentLog]);

  if (!open) return null;

  return (
    <div className="h-48 flex-shrink-0 flex flex-col border-t border-[#1e1e1e] bg-[#0a0a0a] select-text">
       {/* Terminal Header */}
       <div className="flex items-center space-x-6 px-4 py-2 border-b border-[#1e1e1e] text-[10px] uppercase font-bold opacity-60 select-none justify-between">
          <div className="flex items-center space-x-6 w-full">
             <button 
                onClick={() => setActiveTab('terminal')}
                className={`transition-colors pb-1 tracking-wider ${activeTab === 'terminal' ? 'text-white border-b border-white' : 'hover:text-[#e1e1e1]'}`}>
                  Terminal
             </button>
             <button 
                onClick={() => setActiveTab('agentLogs')}
                className={`transition-colors pb-1 tracking-wider ${activeTab === 'agentLogs' ? 'text-white border-b border-white' : 'hover:text-[#e1e1e1]'}`}>
                  Agent Logs
             </button>
             <button 
                onClick={() => setActiveTab('output')}
                className={`transition-colors pb-1 tracking-wider ${activeTab === 'output' ? 'text-white border-b border-white' : 'hover:text-[#e1e1e1]'}`}>
                  Output
             </button>
             <button 
                onClick={() => setActiveTab('debug')}
                className={`transition-colors pb-1 tracking-wider ${activeTab === 'debug' ? 'text-white border-b border-white' : 'hover:text-[#e1e1e1]'}`}>
                  Debug Console
             </button>
             
             <div className="flex-1" />
             
             <button 
                onClick={activeTab === 'agentLogs' ? clearAgentLogs : clearSysLogs} 
                className="hover:text-white transition-colors pb-1 tracking-wider flex items-center space-x-1" 
                title="Clear Logs">
               <Trash2 size={12} />
               <span>Clear</span>
             </button>
          </div>
          <div className="flex items-center space-x-3 text-[#cccccc] pl-4 border-l border-[#1e1e1e]">
             <button className="hover:text-white transition-colors" onClick={toggleTerminal}>
               <X size={14} />
             </button>
          </div>
       </div>

       {/* Terminal Content */}
       <div className="flex-1 p-3 overflow-y-auto font-mono text-xs opacity-70 bg-[#050505] custom-scrollbar leading-relaxed">
          {activeTab === 'terminal' && (
            <>
              {sysLogs.map((log, i) => (
                <div key={i} className="flex">
                  <span className="text-green-500 mr-2 select-none">➜</span>
                  <span className="text-blue-400 mr-2 select-none whitespace-nowrap">~/OllamaCode</span>
                  <span dangerouslySetInnerHTML={{ 
                    __html: log
                      .replace(/qwen2.5-coder/g, '<span class="text-white italic">qwen2.5-coder</span>')
                      .replace(/deepseek-coder/g, '<span class="text-white italic">deepseek-coder</span>')
                      .replace(/http:\/\/localhost:3000/g, '<span class="text-blue-300 underline cursor-pointer">http://localhost:3000</span>')
                      .replace(/Ready for input./g, '<span class="text-green-400">Ready for input.</span>')
                      .replace(/\[Container Manager\]/g, '<span class="text-blue-500 font-bold">[Container Manager]</span>')
                      .replace(/\[Health Check\]/g, '<span class="text-green-500 font-bold">[Health Check]</span>')
                  }} />
                </div>
              ))}
              <div className="flex mt-1">
                <span className="text-green-500 mr-2 select-none">➜</span>
                <span className="text-blue-400 mr-2 select-none">~/OllamaCode</span>
                <span className="animate-pulse bg-[#cccccc] w-2 h-3.5 inline-block align-middle"></span>
              </div>
              <div ref={endOfTerminalRef} />
            </>
          )}

          {activeTab === 'agentLogs' && (
            <div className="space-y-1">
              {agentLogs.length === 0 ? (
                <div className="text-gray-500 italic">Waiting for Multi-Agent System orchestration logs...</div>
              ) : (
                agentLogs.map((log, i) => {
                  let badgeColor = 'bg-gray-600';
                  let textColor = 'text-gray-300';
                  if (log.type.startsWith('job.')) { badgeColor = 'bg-purple-600/30 text-purple-400'; textColor = 'text-purple-300'; }
                  if (log.type.startsWith('container.')) { badgeColor = 'bg-blue-600/30 text-blue-400'; textColor = 'text-blue-300'; }
                  if (log.type.startsWith('agent.')) { badgeColor = 'bg-orange-600/30 text-orange-400'; textColor = 'text-orange-300'; }
                  if (log.type.includes('success')) { badgeColor = 'bg-green-600/30 text-green-400'; textColor = 'text-green-300'; }
                  if (log.type === 'connected') { badgeColor = 'bg-emerald-600/30 text-emerald-400'; textColor = 'text-emerald-300'; }

                  return (
                    <div key={i} className="flex flex-col mb-1.5 border-l-2 border-slate-800 pl-2">
                       <div className="flex items-center space-x-2">
                         <span className="text-[10px] text-gray-500">
                           {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                         </span>
                         <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${badgeColor}`}>
                           {log.type}
                         </span>
                       </div>
                       <div className={`mt-0.5 text-[11px] ${textColor}`}>
                         {log.payload?.message || JSON.stringify(log.payload)}
                       </div>
                    </div>
                  );
                })
              )}
              <div ref={endOfAgentLogsRef} />
            </div>
          )}

          {activeTab === 'output' && (
            <div className="text-gray-500 italic">No output selected.</div>
          )}

          {activeTab === 'debug' && (
            <div className="text-gray-500 italic">No active debug sessions.</div>
          )}
       </div>
    </div>
  );
}
