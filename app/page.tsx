'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { EditorPane } from '@/components/EditorPane';
import { ChatPane } from '@/components/ChatPane';
import { TerminalPane } from '@/components/TerminalPane';
import { PreviewPane } from '@/components/PreviewPane';
import { EmulatorPane } from '@/components/EmulatorPane';
import { useStore } from '@/lib/store';
import { FolderOpen, Code2, MessageSquare, MonitorPlay, Smartphone } from 'lucide-react';

export default function Home() {
  const { modelStatus } = useStore();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<'folders' | 'editor' | 'chat' | 'preview' | 'emulator'>('editor');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStatusText = () => {
    switch(modelStatus) {
      case 'online': return 'Ollama Online';
      case 'downloading': return 'Pulling Model...';
      case 'initializing': return 'Starting Container...';
      default: return 'Ollama Offline';
    }
  };

  const getStatusColor = () => {
    switch(modelStatus) {
      case 'online': return 'text-green-500';
      case 'downloading': return 'text-blue-400 animate-pulse';
      case 'initializing': return 'text-yellow-500 animate-pulse';
      default: return 'text-red-500';
    }
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a] text-[#cccccc] font-sans">
      <Header />
      
      <div className="flex flex-1 overflow-hidden relative">
        {isMobile ? (
          <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] overflow-hidden pb-16">
            {mobileActiveView === 'folders' && <Sidebar forceShow={true} />}
            {mobileActiveView === 'editor' && (
              <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative h-full">
                <EditorPane />
                <TerminalPane />
              </div>
            )}
            {mobileActiveView === 'chat' && <ChatPane forceShow={true} />}
            {mobileActiveView === 'preview' && <PreviewPane forceShow={true} />}
            {mobileActiveView === 'emulator' && <EmulatorPane />}
          </div>
        ) : (
          <>
            {/* Left Sidebar (File Explorer / Search) */}
            <Sidebar />
            
            {/* Main Center Area (Editor + Terminal) */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative" id="center-workspace">
              <EditorPane />
              <TerminalPane />
            </div>
            
            {/* Right Sidebar (Cursor-like Chat) */}
            <ChatPane />
            
            {/* Preview Panel */}
            <PreviewPane />
          </>
        )}
      </div>

      {/* Mobile Fixed Snug bottom Navigation bar */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#000000] border-t border-[#1c1c1e] flex items-center justify-around px-1 z-50 shadow-[0_-8px_24px_rgba(0,0,0,0.5)] select-none">
          {/* Folders Tab */}
          <button 
            id="tab-folders"
            onClick={() => setMobileActiveView('folders')}
            className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 outline-none ${
              mobileActiveView === 'folders' 
                ? 'text-purple-400 font-bold bg-[#141416]/50' 
                : 'text-neutral-400 hover:text-neutral-200 font-medium'
            }`}
          >
            <FolderOpen size={18} className={`${mobileActiveView === 'folders' ? 'text-purple-400 scale-110 mb-0.5' : 'mb-1'} transition-transform`} />
            <span className="text-[9px] uppercase tracking-wider">Pastas</span>
          </button>

          {/* Editor Tab */}
          <button 
            id="tab-editor"
            onClick={() => setMobileActiveView('editor')}
            className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 outline-none ${
              mobileActiveView === 'editor' 
                ? 'text-purple-400 font-bold bg-[#141416]/50' 
                : 'text-neutral-400 hover:text-neutral-200 font-medium'
            }`}
          >
            <Code2 size={18} className={`${mobileActiveView === 'editor' ? 'text-purple-400 scale-110 mb-0.5' : 'mb-1'} transition-transform`} />
            <span className="text-[9px] uppercase tracking-wider">Editor</span>
          </button>

          {/* Chat Tab */}
          <button 
            id="tab-chat"
            onClick={() => setMobileActiveView('chat')}
            className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 outline-none ${
              mobileActiveView === 'chat' 
                ? 'text-purple-400 font-bold bg-[#141416]/50' 
                : 'text-neutral-400 hover:text-neutral-200 font-medium'
            }`}
          >
            <MessageSquare size={18} className={`${mobileActiveView === 'chat' ? 'text-purple-400 scale-110 mb-0.5' : 'mb-1'} transition-transform`} />
            <span className="text-[9px] uppercase tracking-wider">Chat AI</span>
          </button>

          {/* Preview Tab */}
          <button 
            id="tab-preview"
            onClick={() => setMobileActiveView('preview')}
            className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 outline-none ${
              mobileActiveView === 'preview' 
                ? 'text-purple-400 font-bold bg-[#141416]/50' 
                : 'text-neutral-400 hover:text-neutral-200 font-medium'
            }`}
          >
            <MonitorPlay size={18} className={`${mobileActiveView === 'preview' ? 'text-purple-400 scale-110 mb-0.5' : 'mb-1'} transition-transform`} />
            <span className="text-[9px] uppercase tracking-wider">Preview</span>
          </button>

          {/* Emulator Tab */}
          <button 
            id="tab-emulator"
            onClick={() => setMobileActiveView('emulator')}
            className={`flex-1 flex flex-col items-center justify-center h-full transition-all duration-200 outline-none ${
              mobileActiveView === 'emulator' 
                ? 'text-purple-400 font-bold bg-[#141416]/50' 
                : 'text-neutral-400 hover:text-neutral-200 font-medium'
            }`}
          >
            <Smartphone size={18} className={`${mobileActiveView === 'emulator' ? 'text-purple-400 scale-110 mb-0.5' : 'mb-1'} transition-transform`} />
            <span className="text-[9px] uppercase tracking-wider">Emulador</span>
          </button>
        </div>
      )}
      
      {/* Status Bar */}
      <footer className="h-6 border-t border-[#1e1e1e] bg-[#0d0d0d] flex items-center justify-between px-3 text-[10px] text-white opacity-40 uppercase tracking-widest select-none hidden md:flex">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1 hover:opacity-100 cursor-pointer transition-opacity">
            <span className="text-blue-400">●</span>
            <span>master</span>
          </span>
          <span className="flex items-center space-x-1 hover:opacity-100 cursor-pointer transition-opacity">
            <span>0</span> ✖️
            <span className="ml-2">0</span> ⚠️
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`${getStatusColor()} tracking-wider font-bold`}>{getStatusText()}</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">LN 12, COL 4</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">UTF-8</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">TypeScript React</span>
          <span className="hover:opacity-100 cursor-pointer transition-opacity">Português (BR)</span>
        </div>
      </footer>
    </main>
  );
}
