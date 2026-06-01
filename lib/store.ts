import { create } from 'zustand';

export type ModelStatus = 'online' | 'offline' | 'initializing' | 'downloading';

export type FileNode = {
  name: string;
  type: 'file' | 'folder';
  path?: string;
  children?: FileNode[];
};

const INITIAL_TREE: FileNode[] = [];

type Store = {
  selectedModel: string;
  modelStatus: ModelStatus;
  downloadProgress: number;
  setSelectedModel: (model: string) => void;
  setModelStatus: (status: ModelStatus, progress?: number) => void;
  
  previewOpen: boolean;
  togglePreview: () => void;
  openPreview: () => void;
  
  sysLogs: string[];
  addSysLog: (log: string) => void;
  clearSysLogs: () => void;

  agentLogs: { type: string, payload: any, timestamp: Date }[];
  addAgentLog: (log: { type: string, payload: any, timestamp?: Date }) => void;
  clearAgentLogs: () => void;

  leftSidebarOpen: boolean;
  toggleLeftSidebar: () => void;
  rightSidebarOpen: boolean;
  toggleRightSidebar: () => void;
  terminalOpen: boolean;
  toggleTerminal: () => void;
  activeFile: string;
  setActiveFile: (file: string) => void;
  openFiles: string[];
  addOpenFile: (file: string) => void;
  closeOpenFile: (file: string) => void;

  fileTree: FileNode[];
  setFileTree: (tree: FileNode[]) => void;
  fileContents: Record<string, string>;
  setFileContent: (path: string, content: string) => void;
  setFileContentsBatch: (contents: Record<string, string>) => void;
};

export const useStore = create<Store>((set) => ({
  selectedModel: 'qwen2.5-coder',
  modelStatus: 'online',
  downloadProgress: 0,
  
  previewOpen: false,
  togglePreview: () => set((state) => ({ previewOpen: !state.previewOpen })),
  openPreview: () => set({ previewOpen: true }),
  
  sysLogs: [
    '[System] IDE boot up. Agent Loop Ready.',
    '[System] Waiting for user intent router...',
    '[System] Workspace is empty. Awaiting create project command.'
  ],
  addSysLog: (log) => set((state) => ({ sysLogs: [...state.sysLogs, log] })),
  clearSysLogs: () => set({ sysLogs: [] }),

  agentLogs: [],
  addAgentLog: (log) => set((state) => ({ agentLogs: [...state.agentLogs, { ...log, timestamp: log.timestamp || new Date() }] })),
  clearAgentLogs: () => set({ agentLogs: [] }),

  setSelectedModel: (model) => set({ selectedModel: model }),
  setModelStatus: (status, progress = 0) => set({ modelStatus: status, downloadProgress: progress }),
  
  leftSidebarOpen: true,
  toggleLeftSidebar: () => set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),
  
  rightSidebarOpen: true,
  toggleRightSidebar: () => set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),
  
  terminalOpen: true,
  toggleTerminal: () => set((state) => ({ terminalOpen: !state.terminalOpen })),
  
  activeFile: '',
  setActiveFile: (file) => set((state) => {
    if (!state.openFiles.includes(file)) {
      return { activeFile: file, openFiles: [...state.openFiles, file] };
    }
    return { activeFile: file };
  }),
  
  openFiles: [],
  addOpenFile: (file) => set((state) => ({
    openFiles: state.openFiles.includes(file) ? state.openFiles : [...state.openFiles, file]
  })),
  closeOpenFile: (file) => set((state) => {
    const newFiles = state.openFiles.filter((f) => f !== file);
    return {
      openFiles: newFiles,
      activeFile: state.activeFile === file 
        ? (newFiles.length > 0 ? newFiles[newFiles.length - 1] : '') 
        : state.activeFile
    };
  }),

  fileTree: INITIAL_TREE,
  setFileTree: (tree) => set({ fileTree: tree }),
  fileContents: {},
  setFileContent: (path, content) => set((state) => ({
    fileContents: { ...state.fileContents, [path]: content }
  })),
  setFileContentsBatch: (contents) => set((state) => ({
    fileContents: { ...state.fileContents, ...contents }
  })),
}));
