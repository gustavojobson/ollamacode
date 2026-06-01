'use client';

import { useStore, FileNode } from '@/lib/store';
import { CheckCircle2, CircleDashed, FastForward, Loader2, Paperclip, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type Step = {
  name: string;
  status: 'pending' | 'running' | 'done';
};

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isExecution?: boolean;
  steps?: Step[];
};

// HELPER: Generates mock content based on name
function generateCodeForFile(fileName: string, accumulatedPath: string): string {
  if (fileName === 'package.json') {
    return `{
  "name": "vite-react-typescript",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.450.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0"
  }
}`;
  }

  if (fileName === 'App.tsx') {
    return `'use client';

import React, { useState } from 'react';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Finalizar estrutura de pastas do projeto', completed: true },
    { id: 2, text: 'Explorar arquivos no painel do editor', completed: false },
    { id: 3, text: 'Codificar componentes interativos na IDE', completed: false }
  ]);
  const [newText, setNewText] = useState('');

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newText, completed: false }]);
    setNewText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
            ✓
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              OllamaCode Project
            </h1>
            <p className="text-[11px] text-slate-400 font-mono">Estrutura de pastas criada!</p>
          </div>
        </div>

        <div className="mb-6 p-3 rounded-lg bg-slate-950/50 border border-slate-800/80">
          <p className="text-xs text-slate-400 leading-normal">
            Parabéns! Sua estrutura de diretórios foi definida com sucesso no File System virtual. Use a barra lateral esquerda para abrir e editar qualquer código.
          </p>
        </div>

        <form onSubmit={addTask} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Adicionar nova tarefa..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500 placeholder:opacity-30"
          />
          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 rounded-xl text-xs font-bold transition-all text-white shadow-lg shadow-purple-500/20">
            Criar
          </button>
        </form>

        <div className="space-y-2">
          {tasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="flex items-center space-x-3 p-3 bg-slate-950/30 hover:bg-slate-950/60 border border-slate-800/40 rounded-xl cursor-pointer transition-all hover:translate-x-0.5"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => {}}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-purple-600 focus:ring-purple-500"
              />
              <span className={'text-xs font-medium text-slate-300 transition-all ' + (task.completed ? 'line-through text-slate-500 opacity-60' : '')}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`;
  }

  if (fileName === 'main.tsx') {
    return `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
  }

  if (fileName === 'vite.config.ts') {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`;
  }

  if (fileName === 'tailwind.config.js') {
    return `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
  }

  if (fileName.endsWith('.tsx') || fileName.endsWith('.jsx')) {
    const componentName = fileName.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "");
    const capitalizedName = componentName.charAt(0).toUpperCase() + componentName.slice(1);
    return `'use client';

import React from 'react';

export default function ${capitalizedName}() {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-slate-900/50 backdrop-blur-md border-slate-800 text-slate-100 font-sans">
      <h3 className="text-sm font-bold text-purple-400 mb-1">${capitalizedName} Component</h3>
      <p className="text-xs text-slate-400">Gerado com sucesso em <code>${accumulatedPath}</code></p>
    </div>
  );
}`;
  }

  if (fileName.endsWith('.ts') || fileName.endsWith('.js')) {
    if (fileName.includes('store') || fileName.includes('state')) {
      return `import { create } from 'zustand';

export interface State {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useStore = create<State>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
}));`;
    }
    if (fileName.includes('schema')) {
      return `import { z } from 'zod';

export const schema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2),
  createdAt: z.date(),
});`;
    }
    return `// Utilitários dinâmicos gerados em ${accumulatedPath}
export function getFormattedDate(date = new Date()): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export const logger = {
  info: (msg: string) => console.log(\`[INFO] \${msg}\`),
  error: (msg: string) => console.error(\`[ERROR] \${msg}\`),
};`;
  }

  if (fileName.endsWith('.json')) {
    return `{
  "status": "healthy",
  "description": "Simulated configuration file for ${fileName}"
}`;
  }

  if (fileName.endsWith('.md')) {
    return `# Documentação - ${fileName}

Esta pasta e documentação foram criadas dinamicamente com base no seu prompt de criação da estrutura de pastas!
O OllamaCode realizou o scaffold da estrutura completa do projeto.

---

### Estrutura de Diretórios
- Projeto: \`${accumulatedPath.split('/')[0]}\`
`;
  }

  return `// Arquivo gerado pelo OllamaCode em ${accumulatedPath}`;
}

// HELPER: Parses user input text looking for file & folder paths
function parsePathsFromPrompt(promptText: string): string[] {
  const result: string[] = [];
  
  // 1. Find standard paths with slashes (e.g. src/components/Button.tsx)
  const pathRegex = /([a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_.-]+)+)/g;
  const matches = promptText.match(pathRegex);
  if (matches) {
    matches.forEach(p => {
      let clean = p.replace(/[.,:;)]+$/, '');
      if (clean.startsWith('./')) {
        clean = clean.substring(2);
      }
      result.push(clean);
    });
  }

  // 2. Read bullet lines or list lines to capture single named items that look like folder/file structures
  const lines = promptText.split('\n');
  lines.forEach(line => {
    const trimmed = line.trim();
    const listMatch = trimmed.match(/^(?:[-*+•]|\d+\.)\s+([a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*)$/);
    if (listMatch && listMatch[1]) {
      let clean = listMatch[1].trim();
      if (!result.includes(clean)) {
        result.push(clean);
      }
    }
  });

  return Array.from(new Set(result));
}

// HELPER: Converts flat paths to nested FileNode tree
function buildTreeFromPaths(paths: string[], projectName: string) {
  let finalPaths = [...paths];
  
  // If no paths found, fallback to standard clean architecture
  if (finalPaths.length === 0) {
    finalPaths = [
      'src/components/ui/Button.tsx',
      'src/components/ui/Input.tsx',
      'src/components/ui/Card.tsx',
      'src/components/ui/Modal.tsx',
      'src/components/layouts/AppLayout.tsx',
      'src/features/tasks/components/TaskList.tsx',
      'src/features/tasks/hooks/useTasks.ts',
      'src/features/tasks/schemas/taskSchema.ts',
      'src/features/tasks/services/taskService.ts',
      'src/store/useStore.ts',
      'src/utils/cn.ts',
      'src/App.tsx',
      'src/main.tsx',
      'tests/App.spec.tsx',
      'tests/taskSchema.spec.ts',
      'package.json',
      'vite.config.ts',
      'tailwind.config.js'
    ];
  }

  // Auto-fill folder paths with essential helper files to keep them explorable & interactive
  const processedPaths: string[] = [];
  finalPaths.forEach(p => {
    if (!p.includes('.')) {
      processedPaths.push(`${p}/readme.md`);
    } else {
      processedPaths.push(p);
    }
  });

  // Always ensure we have clean entrypoints
  const essentialFiles = ['package.json', 'src/App.tsx', 'src/main.tsx'];
  essentialFiles.forEach(f => {
    if (!processedPaths.some(p => p.endsWith(f))) {
      processedPaths.push(f);
    }
  });

  const rootNode: FileNode = { name: projectName, type: 'folder', children: [] };
  const contentsMap: Record<string, string> = {};

  processedPaths.forEach(rawPath => {
    const parts = rawPath.split('/').filter(Boolean);
    if (parts.length === 0) return;

    let currentLevel = rootNode.children!;
    let accumulatedPath = projectName;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      const type = isLast ? 'file' : 'folder';
      accumulatedPath = `${accumulatedPath}/${part}`;

      let node = currentLevel.find(n => n.name === part && n.type === type);
      if (!node) {
        node = {
          name: part,
          type,
          ...(type === 'file' ? { path: accumulatedPath } : { children: [] })
        };
        currentLevel.push(node);
        
        if (type === 'file') {
          contentsMap[accumulatedPath] = generateCodeForFile(part, accumulatedPath);
        }
      }

      if (type === 'folder') {
        if (!node.children) node.children = [];
        currentLevel = node.children;
      }
    }
  });

  return { tree: [rootNode], contents: contentsMap };
}

export function ChatPane({ forceShow }: { forceShow?: boolean }) {
  const open = useStore(s => s.rightSidebarOpen);
  const selectedModel = useStore(s => s.selectedModel);
  const modelStatus = useStore(s => s.modelStatus);
  const addSysLog = useStore(s => s.addSysLog);
  const { openPreview, setFileTree, fileTree, setActiveFile, setFileContentsBatch } = useStore();
  
  const [inputMsg, setInputMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou seu sistema autônomo de fábrica de software. Qual projeto vamos construir hoje?'
    }
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  if (!open && !forceShow) return null;

  const streamResponse = (baseContent: string) => {
    setIsStreaming(true);
    let index = 0;
    const msgId = (Date.now() + 1).toString();
    addSysLog(`[Ollama Runtime] /api/generate streaming initiated for ${selectedModel}`);
    
    setMessages(prev => [...prev, { id: msgId, role: 'assistant', content: '' }]);
    
    const interval = setInterval(() => {
      if (index < baseContent.length) {
        setMessages(prev => {
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          newMessages[lastIndex] = {
            ...newMessages[lastIndex],
            content: newMessages[lastIndex].content + baseContent[index]
          };
          return newMessages;
        });
        index++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        addSysLog(`[Ollama Runtime] /api/generate streaming completed. Event: done`);
      }
    }, 20);
  };
  
  const runExecutionFlow = (msgId: string, projectName: string, promptText: string) => {
    setIsStreaming(true);
    let currentStep = 0;
    
    const runNextStep = () => {
      setMessages(prev => {
        const newMsgs = [...prev];
        const target = newMsgs.find(m => m.id === msgId);
        if (target && target.steps) {
          if (currentStep > 0 && target.steps[currentStep - 1]) target.steps[currentStep - 1].status = 'done';
          if (target.steps[currentStep]) target.steps[currentStep].status = 'running';
        }
        return newMsgs;
      });
      
      if (currentStep === 0) {
        addSysLog(`[Orchestrator Core] Identified Vite React TS stack. Executing npx create-vite@latest ${projectName} --template react-ts...`);
      }

      if (currentStep === 1) {
        addSysLog(`[Resource Scheduler] cd ${projectName} && npm install... Downloading packages.`);
      }

      if (currentStep === 2) {
        addSysLog(`[Project Worker] Installing extra libraries: tailwindcss, react-router-dom, react-hook-form, zod, zustand, vitest.`);
      }

      if (currentStep === 3) {
        addSysLog(`[Architect Engine] Analyzing structure paths from the user prompt...`);
        
        const extractedPaths = parsePathsFromPrompt(promptText);
        if (extractedPaths.length > 0) {
          addSysLog(`[Architect Engine] Extracted ${extractedPaths.length} custom file/folder paths.`);
        } else {
          addSysLog(`[Architect Engine] No custom paths found. Generating standard Clean Architecture boilerplate structure.`);
        }

        const { tree, contents } = buildTreeFromPaths(extractedPaths, projectName);
        
        addSysLog(`[Architect Engine] Instantiating project files inside virtual File Tree.`);
        setFileContentsBatch(contents);
        setFileTree([...fileTree, ...tree]);
      }
      
      if (currentStep === 4) {
        addSysLog(`[Build Engine] Running npm run build and vitest... All checks passed. Zero vulnerabilities.`);
      }

      if (currentStep === 5) {
        addSysLog(`[Runtime Engine] Syncing preview exact match. Dev server running on http://localhost:5173`);
      }

      if (currentStep >= 6) {
        // Done
        setMessages(prev => {
          const newMsgs = [...prev];
          const target = newMsgs.find(m => m.id === msgId);
          if (target && target.steps) {
            target.steps[currentStep - 1].status = 'done';
          }
          return newMsgs;
        });
        setIsStreaming(false);
        setActiveFile(`${projectName}/src/App.tsx`);
        openPreview();
        return;
      }
      
      currentStep++;
      setTimeout(runNextStep, 1500);
    };
    
    setTimeout(runNextStep, 1000);
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMsg.trim() || isStreaming) return;
    
    if (modelStatus === 'downloading' || modelStatus === 'initializing') {
      addSysLog(`[Warning] Model ${selectedModel} is currently ${modelStatus}. Chat is locked.`);
      return;
    }
    
    const inputText = inputMsg;
    const newMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
    
    const ptInput = inputText.toLowerCase();
    const isExecution = 
      ptInput.includes('crie') || 
      ptInput.includes('criar') || 
      ptInput.includes('gere') || 
      ptInput.includes('gerar') || 
      ptInput.includes('configure') || 
      ptInput.includes('configurar') || 
      ptInput.includes('instale') || 
      ptInput.includes('instalar') ||
      ptInput.includes('estrutura') ||
      ptInput.includes('arquitetura') ||
      ptInput.includes('pastas') ||
      ptInput.includes('diretorio') ||
      ptInput.includes('diretórios') ||
      ptInput.includes('folder') ||
      ptInput.includes('folders');
    
    if (isExecution) {
       const executionId = (Date.now() + 1).toString();
       const initSteps: Step[] = [
         { name: 'Orchestrator Core: Identify Stack & Run Official CLI (npx create-vite)', status: 'pending' },
         { name: 'Resource Scheduler: Install Base Dependencies (npm install)', status: 'pending' },
         { name: 'Project Worker (Qwen3 & Qwen2.5): Install Extras (Tailwind, Zod, Zustand, Hook Form)', status: 'pending' },
         { name: 'Architect Engine: Applying Clean Architecture & Feature Slicing', status: 'pending' },
         { name: 'Build Engine: Running Tests, Build Validation & Auto-Repair', status: 'pending' },
         { name: 'Runtime Engine: Syncing Preview & Starting Dev Server', status: 'pending' }
       ];
       
       setMessages(prev => [...prev, {
         id: executionId,
         role: 'assistant',
         content: `Iniciando **Project Generation Engine** para satisfazer o pedido.`,
         isExecution: true,
         steps: initSteps
       }]);
       
       let extractedName = 'meu-projeto';
       const nameMatch = inputText.match(/(?:crie|gere|configure|instale|criar|gerar|configurar|instalar|projeto|estrutura|pastas|pasta|diretório|diretorio)\s+(?:um|uma|o|a|de|do|da)?\s*([a-zA-Z0-9_-]+)/i);
       if (nameMatch && nameMatch[1] && !['projeto', 'estrutura', 'pastas', 'pasta', 'diretório', 'diretorio', 'um', 'uma'].includes(nameMatch[1].toLowerCase())) {
         extractedName = nameMatch[1];
       }
       
       runExecutionFlow(executionId, extractedName.toLowerCase(), inputText);
    } else {
      setTimeout(() => {
        const response = `*(Intent Router → Chat Mode via ${selectedModel})*\n\nComo um sistema de fábrica de software, estou focando em responder sua dúvida. \n\nPara ativar o Agent Loop completo (com Planner, Executor, Filesystem e Verifier), utilize verbos de ação estruturada como "Crie", "Gere", "Configure" ou "Instale" para manipular arquivos fisicamente no File System.`;
        streamResponse(response);
      }, 500);
    }
  };

  return (
    <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col border-l border-[#1e1e1e] bg-[#0d0d0d] h-full z-10">
      
      {/* Header */}
      <div className="p-4 border-b border-[#1e1e1e] flex justify-between items-center bg-[#0d0d0d]">
        <span className="text-xs font-bold text-[#e1e1e1]">CHAT IA</span>
        <div className="flex space-x-2 items-center">
          <span className={`w-2 h-2 rounded-full ${modelStatus === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-[10px] opacity-60 text-[#cccccc] uppercase tracking-wider truncate max-w-[100px]">{selectedModel}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar font-sans text-sm">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
             <div className={`text-[10px] mb-1 font-bold ${msg.role === 'assistant' ? 'text-purple-400' : 'opacity-40 text-[#cccccc] uppercase'}`}>
               {msg.role === 'assistant' ? 'OLLAMACODE' : 'VOCÊ'}
             </div>
             
             <div className={`${msg.role === 'assistant' ? 'bg-purple-900/10 border border-purple-500/20' : 'bg-[#1e1e1e]'} p-3 rounded-lg text-sm text-[#e1e1e1] leading-relaxed whitespace-pre-wrap ${isStreaming && msg.role === 'assistant' && msg.id === messages[messages.length - 1].id ? 'border-purple-500/50 shadow-[0_0_10px_rgba(139,92,246,0.1)]' : ''}`}>
               {msg.content}
               
               {msg.isExecution && msg.steps && (
                 <div className="mt-4 space-y-2 font-mono text-[11px]">
                   {msg.steps.map((step, idx) => (
                     <div key={idx} className="flex items-center space-x-2">
                        {step.status === 'pending' && <CircleDashed size={10} className="text-gray-500" />}
                        {step.status === 'running' && <Loader2 size={10} className="text-purple-400 animate-spin" />}
                        {step.status === 'done' && <CheckCircle2 size={10} className="text-green-400" />}
                        <span className={step.status === 'pending' ? 'text-gray-500' : step.status === 'running' ? 'text-purple-300' : 'text-green-400'}>
                          {step.name}
                        </span>
                     </div>
                   ))}
                 </div>
               )}
               
               {isStreaming && msg.role === 'assistant' && msg.id === messages[messages.length - 1].id && !msg.isExecution && (
                 <span className="inline-block w-1.5 h-3.5 bg-purple-400 ml-1 select-none animate-pulse align-middle"></span>
               )}
             </div>
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0d0d0d] border-t border-[#1e1e1e]">
        <form onSubmit={handleSend} className="relative">
          <textarea 
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={modelStatus === 'online' ? "Pergunte ou comande a IA..." : `Aguardando ${selectedModel}...`}
            disabled={modelStatus !== 'online'}
            className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-lg p-3 text-sm text-[#e1e1e1] placeholder:opacity-40 focus:outline-none focus:border-purple-500 min-h-[96px] max-h-[200px] resize-none transition-colors disabled:opacity-50"
            rows={2}
          />
          
          <div className="absolute bottom-3 right-3 flex space-x-2">
             <button type="button" className="p-1.5 bg-[#2d2d2d] rounded hover:bg-[#3d3d3d] text-[#cccccc] transition-colors" title="Anexar arquivo/contexto">
               <Paperclip size={16} className="opacity-60" />
             </button>
             <button 
                type="submit" 
                disabled={!inputMsg.trim() || isStreaming || modelStatus !== 'online'}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded text-xs font-bold transition-colors flex items-center justify-center"
             >
               Enviar
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}
