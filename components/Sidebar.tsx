'use client';

import { useStore, FileNode } from '@/lib/store';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';
import { FileIcon } from 'react-material-vscode-icons';

function FileTreeNode({ node, level = 0 }: { node: FileNode, level?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const setActiveFile = useStore(s => s.setActiveFile);
  const activeFile = useStore(s => s.activeFile);

  const isFolder = node.type === 'folder';
  const paddingLeft = level * 12 + 12;

  return (
    <div>
      <div 
        className={`flex items-center py-1 cursor-pointer select-none border-l-2 ${activeFile === node.path ? 'bg-[#1e1e1e] text-[#e1e1e1] border-purple-500' : 'text-[#cccccc] hover:bg-[#1e1e1e]/50 border-transparent'}`}
        style={{ paddingLeft: `${paddingLeft}px` }}
        onClick={() => {
          if (isFolder) setIsOpen(!isOpen);
          else if (node.path) setActiveFile(node.path);
        }}
      >
        <span className="mr-1 opacity-80">
          {isFolder ? (
            isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
          ) : (
             <span className="w-3.5 h-3.5 inline-block" />
          )}
        </span>
        <span className="mr-1.5 opacity-90 flex items-center justify-center">
          <FileIcon 
            fileName={node.name} 
            isFolder={isFolder} 
            isExpanded={isOpen} 
            size={14} 
          />
        </span>
        <span className="text-[13px] tracking-tight truncate font-sans">{node.name}</span>
      </div>
      
      {isFolder && isOpen && node.children && (
        <div>
          {node.children.map((child, i) => (
            <FileTreeNode key={i} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ forceShow }: { forceShow?: boolean }) {
  const { leftSidebarOpen, fileTree } = useStore();
  
  if (!leftSidebarOpen && !forceShow) return null;

  return (
    <div className="w-full md:w-56 flex-shrink-0 flex flex-col border-r border-[#1e1e1e] bg-[#0a0a0a] h-full overflow-hidden">
      <div className="p-3 text-[10px] uppercase tracking-wider font-bold opacity-40 flex items-center justify-between">
        <span>Explorador</span>
      </div>
      
      {/* Search Input Mock */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2 opacity-40" />
          <input 
            type="text" 
            placeholder="Buscar arquivos..." 
            className="w-full bg-[#1e1e1e] border border-[#2d2d2d] rounded-md py-1 mr-2 pl-8 pr-3 text-xs text-[#e1e1e1] focus:outline-none focus:border-purple-500 transition-colors placeholder:opacity-40"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
        <div className="flex items-center space-x-2 px-4 py-1 text-xs font-medium text-[#e1e1e1]">
          <span className="opacity-40 text-[8px]">▼</span>
          <span>OllamaCode</span>
        </div>
        <div className="pl-4">
          {fileTree.map((node, i) => (
            <FileTreeNode key={i} node={node} />
          ))}
        </div>
      </div>
    </div>
  );
}
