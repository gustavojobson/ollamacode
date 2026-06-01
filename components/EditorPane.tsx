'use client';

import { useStore } from '@/lib/store';
import Editor from '@monaco-editor/react';
import { X, Play } from 'lucide-react';

const MOCK_FILE_CONTENT: Record<string, string> = {
  'src/main.ts': `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // OllamaCode Backend initialized
  await app.listen(3000);
  console.log('🚀 API is running on: http://localhost:3000');
}
bootstrap();`,
  '.ai/rules/security.rule': `# Regra Nível Sistema: SEGURANÇA
# Contexto: DevSecOps Agent

- NUNCA expor secrets, tokens ou chaves de API em arquivos client-side.
- SEMPRE validar entradas do usuário (Sanitization).
- UTILIZAR criptografia para senhas do banco de dados local.
- RECORRER ao Agente DevSecOps (.ai/agents/devsecops.agent.ts) antes de deploys ou commits importantes.

> Nota: O OllamaCode roda 100% local, mas regras estruturais de segurança são imperativas para geração de código pela IA.`,
  'docker-compose.yml': `version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: ollamacode
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
  
volumes:
  pgdata:`,
  '.github/workflows/devsecops.yml': `name: DevSecOps Pipeline

on:
  push:
    branches: [ "master", "main" ]
  pull_request:
    branches: [ "master", "main" ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm test

  sast-semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: "p/default"`,
  '.github/dependabot.yml': `version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"`,
  'todo-list/src/App.tsx': `import { useState } from 'react';

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, title: 'Testar OllamaCode UI', completed: false }
  ]);
  const [text, setText] = useState('');

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), title: text, completed: false }]);
    setText('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 mb-6">
          Todo List App
        </h1>
        
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={text}
            onChange={e => setText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Adicionar tarefa..."
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Adicionar
          </button>
        </form>

        <ul className="space-y-3">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
              <input 
                type="checkbox" 
                checked={todo.completed}
                onChange={() => setTodos(todos.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t))}
                className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className={todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}`
};

export function EditorPane() {
  const { openFiles, activeFile, setActiveFile, closeOpenFile, fileContents, setFileContent } = useStore();

  const getLanguage = (file: string) => {
    if (file.endsWith('.ts') || file.endsWith('.tsx')) return 'typescript';
    if (file.endsWith('.json')) return 'json';
    if (file.endsWith('.css')) return 'css';
    if (file.endsWith('.html')) return 'html';
    if (file.endsWith('.yml') || file.endsWith('.yaml')) return 'yaml';
    if (file.endsWith('.md') || file.endsWith('.rule') || file.endsWith('.skill') || file.endsWith('.agent')) return 'markdown';
    return 'plaintext';
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Define a custom theme to match our dark IDE look
    monaco.editor.defineTheme('ollamacode-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { background: '0a0a0a' },
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c586c0' },
        { token: 'string', foreground: 'ce9178' },
        { token: 'identifier', foreground: '9cdcfe' },
      ],
      colors: {
        'editor.background': '#0a0a0a',
        'editor.foreground': '#d4d4d4',
        'editor.lineHighlightBackground': '#1e1e1e',
        'editorLineNumber.foreground': '#404040',
        'editorIndentGuide.background': '#1e1e1e',
      }
    });
    monaco.editor.setTheme('ollamacode-dark');
  };

  if (openFiles.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-[#09090b] items-center justify-center text-neutral-500 font-sans">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-6">
           <div className="text-purple-500 font-mono text-2xl font-bold tracking-tighter"> OC </div>
        </div>
        <h2 className="text-xl font-medium text-neutral-300 mb-2">OllamaCode IDE</h2>
        <p className="text-sm">Abra um arquivo na barra lateral ou utilize o Composer (Ctrl+K).</p>
        <div className="mt-8 flex gap-4 text-xs font-mono">
           <div className="px-3 py-1.5 bg-neutral-900 rounded border border-neutral-800">Ctrl + Shift + P <span className="text-neutral-600 ml-2">Comandos</span></div>
           <div className="px-3 py-1.5 bg-neutral-900 rounded border border-neutral-800">Ctrl + K <span className="text-neutral-600 ml-2">Inline Edit AI</span></div>
           <div className="px-3 py-1.5 bg-neutral-900 rounded border border-neutral-800">Ctrl + J <span className="text-neutral-600 ml-2">Terminal</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a] overflow-hidden relative">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-[#1e1e1e] bg-[#0a0a0a] flex-shrink-0 custom-scrollbar scrollbar-hide">
        {openFiles.map(file => (
          <div 
            key={file}
            onClick={() => setActiveFile(file)}
            className={`flex items-center px-4 py-2 text-xs border-r border-[#1e1e1e] cursor-pointer select-none group font-sans transition-colors ${activeFile === file ? 'bg-[#0a0a0a] text-[#e1e1e1] border-b-2 border-b-blue-400' : 'text-[#cccccc] opacity-60 hover:opacity-100 hover:bg-[#1e1e1e]/50 border-b-2 border-b-transparent'}`}
          >
            <span className="truncate">{file.split('/').pop()}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); closeOpenFile(file); }}
              className={`ml-2 p-0.5 rounded-sm hover:bg-[#2d2d2d] opacity-0 group-hover:opacity-100 transition-opacity ${activeFile === file ? 'opacity-100' : ''}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {/* Editor Context Actions */}
      <div className="absolute right-6 top-10 z-10 flex space-x-2">
         {activeFile && (activeFile.endsWith('.ts') || activeFile.endsWith('.ts')) && (
            <button className="flex items-center space-x-1.5 px-3 py-1 bg-[#1e1e1e] text-[#cccccc] border border-[#2d2d2d] hover:border-purple-500 rounded text-xs transition-colors font-sans">
              <Play size={12} className="text-green-500" />
              <span>Executar</span>
            </button>
         )}
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 w-full pt-2">
        <Editor
          height="100%"
          language={getLanguage(activeFile)}
          value={fileContents[activeFile] !== undefined ? fileContents[activeFile] : (MOCK_FILE_CONTENT[activeFile] || (activeFile.endsWith('/src/App.tsx') ? MOCK_FILE_CONTENT['todo-list/src/App.tsx'] : '// Arquivo vazio ou não encontrado em mock.\n// Utilize o Inline Edit (Ctrl+K) para gerar o código com o Ollama.'))}
          onChange={(val) => {
            if (activeFile && val !== undefined) {
              setFileContent(activeFile, val);
            }
          }}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'var(--font-mono), monospace',
            fontLigatures: true,
            lineHeight: 22,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            }
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
}
