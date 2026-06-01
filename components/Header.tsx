'use client';

import { useStore } from '@/lib/store';
import { ChevronDown, Code2, PanelLeft, PanelRight, Settings, TerminalSquare, Server, Loader2, CheckCircle2, DownloadCloud, Github, Shield, Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const MODELS = [
  'qwen2.5-coder',
  'qwen3',
  'qwen3.5-9b'
];

export function Header() {
  const { 
    selectedModel, setSelectedModel, 
    modelStatus, setModelStatus, addSysLog, downloadProgress, clearSysLogs,
    toggleLeftSidebar, toggleRightSidebar, toggleTerminal, togglePreview,
    leftSidebarOpen, rightSidebarOpen, terminalOpen, previewOpen
  } = useStore();
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const switchModel = (newModel: string) => {
    if (newModel === selectedModel) {
      setModelDropdownOpen(false);
      return;
    }
    
    setSelectedModel(newModel);
    setModelDropdownOpen(false);
    
    if (newModel.startsWith('deepseek') || newModel.startsWith('qwen3') || newModel === 'starcoder2' || newModel === 'devstral') {
      setModelStatus('downloading', 0);
      addSysLog(`[Container Manager] Pulling image for ${newModel}...`);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 15) + 5;
        if (progress >= 100) {
          clearInterval(interval);
          addSysLog(`[Container Manager] Download complete. Starting container for ${newModel}...`);
          setModelStatus('initializing');
          
          setTimeout(() => {
            addSysLog(`[Health Check] Container online. Endpoint registered: http://ollama-manager:11434/api/generate`);
            setModelStatus('online');
          }, 2000);
        } else {
          setModelStatus('downloading', progress);
        }
      }, 500);
    } else {
      setModelStatus('initializing');
      addSysLog(`[Container Manager] Stating container for ${newModel}...`);
      setTimeout(() => {
        addSysLog(`[Health Check] Container online. Endpoint registered: http://ollama-manager:11434/api/generate`);
        setModelStatus('online');
      }, 1500);
    }
  };

  const toggleMenu = (menu: string) => {
    if (activeMenu === menu) setActiveMenu(null);
    else setActiveMenu(menu);
  };

  return (
    <header className="h-11 border-b border-[#1e1e1e] flex items-center justify-between px-4 bg-[#0a0a0a] select-none z-30 relative">
      <div className="flex items-center space-x-4">
        {/* Logo */}
        <div className="flex items-center space-x-4 text-neutral-200">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500">
            <span className="text-[10px] font-bold text-white">OC</span>
          </div>
          <span className="font-medium text-sm text-[#e1e1e1]">OllamaCode</span>
        </div>
        
        {/* Menu */}
        <nav className="hidden md:flex items-center space-x-1 text-xs opacity-80 px-4" ref={menuRef}>
          <div className="relative">
            <button className={`px-2 py-1 rounded transition-colors ${activeMenu === 'file' ? 'bg-[#1e1e1e] text-white opacity-100' : 'hover:opacity-100'}`} onClick={() => toggleMenu('file')}>Arquivo</button>
            {activeMenu === 'file' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#0d0d0d] border border-[#1e1e1e] rounded shadow-2xl py-1 z-50 text-[#cccccc]">
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Novo Arquivo</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Abrir Pasta...</button>
                <div className="h-px bg-[#1e1e1e] my-1"></div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Salvar</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Salvar Como...</button>
              </div>
            )}
          </div>

          <div className="relative">
            <button className={`px-2 py-1 rounded transition-colors ${activeMenu === 'edit' ? 'bg-[#1e1e1e] text-white opacity-100' : 'hover:opacity-100'}`} onClick={() => toggleMenu('edit')}>Editar</button>
            {activeMenu === 'edit' && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#0d0d0d] border border-[#1e1e1e] rounded shadow-2xl py-1 z-50 text-[#cccccc]">
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Desfazer <span className="float-right opacity-50 text-[10px] mt-0.5">Ctrl+Z</span></button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Refazer <span className="float-right opacity-50 text-[10px] mt-0.5">Ctrl+Y</span></button>
                <div className="h-px bg-[#1e1e1e] my-1"></div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Copiar <span className="float-right opacity-50 text-[10px] mt-0.5">Ctrl+C</span></button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Colar <span className="float-right opacity-50 text-[10px] mt-0.5">Ctrl+V</span></button>
              </div>
            )}
          </div>

          <div className="relative">
            <button className={`px-2 py-1 rounded transition-colors ${activeMenu === 'view' ? 'bg-[#1e1e1e] text-white opacity-100' : 'hover:opacity-100'}`} onClick={() => toggleMenu('view')}>Visualizar</button>
            {activeMenu === 'view' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0d0d0d] border border-[#1e1e1e] rounded shadow-2xl py-1 z-50 text-[#cccccc]">
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors flex items-center justify-between" onClick={() => { toggleLeftSidebar(); setActiveMenu(null); }}>
                   <span>Explorador</span>
                   {leftSidebarOpen && <span className="text-blue-400">✓</span>}
                </button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors flex items-center justify-between" onClick={() => { toggleTerminal(); setActiveMenu(null); }}>
                   <span>Terminal</span>
                   {terminalOpen && <span className="text-blue-400">✓</span>}
                </button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors flex items-center justify-between" onClick={() => { toggleRightSidebar(); setActiveMenu(null); }}>
                   <span>Chat de IA</span>
                   {rightSidebarOpen && <span className="text-blue-400">✓</span>}
                </button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors flex items-center justify-between" onClick={() => { togglePreview(); setActiveMenu(null); }}>
                   <span>Preview Integrado</span>
                   {previewOpen && <span className="text-blue-400">✓</span>}
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button className={`px-2 py-1 rounded transition-colors ${activeMenu === 'github' ? 'bg-[#1e1e1e] text-white opacity-100' : 'hover:opacity-100'} flex items-center space-x-1`} onClick={() => toggleMenu('github')}>
              <Github size={12}/> <span>GitHub</span>
            </button>
            {activeMenu === 'github' && (
              <div className="absolute top-full left-0 mt-1 w-52 bg-[#0d0d0d] border border-[#1e1e1e] rounded shadow-2xl py-1 z-50 text-[#cccccc]">
                <div className="px-4 py-1.5 opacity-50 text-[10px] uppercase font-bold tracking-wider">Repositório</div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Clonar Repositório...</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Pull</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors" onClick={() => setActiveMenu(null)}>Commit & Push</button>
                <div className="h-px bg-[#1e1e1e] my-1"></div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors text-blue-400" onClick={() => setActiveMenu(null)}>Criar Pull Request</button>
              </div>
            )}
          </div>

          <div className="relative">
            <button className={`px-2 py-1 rounded transition-colors ${activeMenu === 'security' ? 'bg-red-900/30 text-rose-300 opacity-100' : 'hover:opacity-100 text-rose-300'} flex items-center space-x-1`} onClick={() => toggleMenu('security')}>
              <Shield size={12}/> <span>Security Center</span>
            </button>
            {activeMenu === 'security' && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-[#0d0d0d] border border-red-900/30 rounded shadow-2xl py-1 z-50 text-[#cccccc]">
                <div className="px-4 py-1.5 text-rose-400 text-[10px] uppercase font-bold tracking-wider flex items-center space-x-2">
                   <Shield size={12} />
                   <span>DevSecOps Engine</span>
                </div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors text-xs" onClick={() => { setActiveMenu(null); addSysLog('[Security] Running Semgrep SAST scan...'); }}>Rodar Scan SAST (Semgrep)</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors text-xs" onClick={() => { setActiveMenu(null); addSysLog('[Security] Running Trivy Container Scanner...'); }}>Verificar Imagens Docker (Trivy)</button>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors text-xs" onClick={() => { setActiveMenu(null); addSysLog('[Security] Scanning for secrets with Gitleaks...'); }}>Scan de Segredos (Gitleaks)</button>
                <div className="h-px bg-[#1e1e1e] my-1"></div>
                <button className="w-full text-left px-4 py-1.5 hover:bg-[#1e1e1e] transition-colors text-xs text-orange-400" onClick={() => setActiveMenu(null)}>Ver Dependências Vulneráveis</button>
              </div>
            )}
          </div>
        </nav>
      </div>

      <div className="flex items-center space-x-3 text-xs">
        {/* AI Provider Manager */}
        <div className="relative">
          <button 
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center space-x-2 bg-[#1e1e1e] border border-[#2d2d2d] hover:border-purple-500 px-3 py-1 rounded text-[#e1e1e1] transition-colors"
          >
            {modelStatus === 'online' && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            {modelStatus === 'initializing' && <Loader2 size={10} className="text-yellow-500 animate-spin" />}
            {modelStatus === 'downloading' && <DownloadCloud size={10} className="text-blue-500" />}
            
            <span>{selectedModel}</span>
            {modelStatus === 'downloading' && <span className="opacity-60 text-blue-400">{downloadProgress}%</span>}
            <span className="opacity-40 text-[10px]">▼</span>
          </button>
          
          {modelDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setModelDropdownOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-1 w-56 max-h-[300px] overflow-y-auto custom-scrollbar bg-[#0d0d0d] border border-[#1e1e1e] rounded shadow-2xl z-20 py-1 font-mono text-xs">
                <div className="px-3 py-1.5 text-[#cccccc] opacity-60 font-sans tracking-wide uppercase text-[10px] flex items-center justify-between">
                  <span>Model Registry</span>
                  <Server size={10} />
                </div>
                {MODELS.map(model => {
                  // Simulate some models not being downloaded locally yet
                  const isLocal = !model.startsWith('deepseek') && !model.startsWith('qwen3') && model !== 'starcoder2' && model !== 'devstral';
                  
                  return (
                    <button
                      key={model}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#1e1e1e] transition-colors ${selectedModel === model ? 'text-purple-400' : 'text-[#cccccc]'}`}
                      onClick={() => switchModel(model)}
                    >
                      <div className="flex items-center space-x-2">
                         {isLocal ? <CheckCircle2 size={10} className="opacity-40" /> : <DownloadCloud size={10} className="opacity-40 text-blue-400" />}
                         <span>{model}</span>
                      </div>
                      {selectedModel === model && <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>}
                    </button>
                  );
                })}
                <div className="border-t border-[#1e1e1e] mt-1 pt-1">
                   <button className="w-full text-left px-3 py-1.5 text-[#cccccc] opacity-60 flex items-center space-x-2 hover:bg-[#1e1e1e] transition-colors">
                     <Settings size={12} />
                     <span>Container Manager...</span>
                   </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Layout Toggles */}
        <div className="flex items-center space-x-1 border-l border-[#1e1e1e] pl-3 ml-1">
          <button 
            onClick={toggleLeftSidebar}
            className={`p-1.5 rounded transition-opacity ${leftSidebarOpen ? 'opacity-100 text-[#e1e1e1]' : 'opacity-40 hover:opacity-100'}`}
            title="Alternar Explorador"
          >
            <PanelLeft size={16} />
          </button>
          <button 
            onClick={toggleTerminal}
            className={`p-1.5 rounded transition-opacity ${terminalOpen ? 'opacity-100 text-[#e1e1e1]' : 'opacity-40 hover:opacity-100'}`}
            title="Alternar Terminal"
          >
            <TerminalSquare size={16} />
          </button>
          <button 
            onClick={toggleRightSidebar}
            className={`p-1.5 rounded transition-opacity ${rightSidebarOpen ? 'opacity-100 text-[#e1e1e1]' : 'opacity-40 hover:opacity-100'}`}
            title="Alternar Chat AI"
          >
            <PanelRight size={16} />
          </button>
          <button 
            onClick={togglePreview}
            className={`p-1.5 rounded transition-opacity ${previewOpen ? 'opacity-100 text-[#e1e1e1] bg-purple-900/30' : 'opacity-40 hover:opacity-100'}`}
            title="Preview Integrado"
          >
            <Globe size={16} className={previewOpen ? 'text-purple-400' : ''} />
          </button>
          <button className="px-3 py-1 ml-2 bg-white text-black text-xs font-semibold rounded hover:bg-gray-200">Composer</button>
        </div>
      </div>
    </header>
  );
}
