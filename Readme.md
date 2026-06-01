# OllamaCode

OllamaCode é uma IDE web avançada movida a IA, projetada especificamente para atuar como uma plataforma de desenvolvimento baseada nos modelos locais do Ollama e em um sistema de múltiplos agentes. Combinando uma interface imersiva com tecnologias modernas da web, o OllamaCode traz a experiência completa do VS Code diretamente para o seu navegador.

## ✨ Recursos e Funcionalidades

- **Experiência de IDE Completa:** Interface projetada para ser nativa, com painel lateral, explorador de arquivos, terminal integrado e área central de edição.
- **Integração com File System e Material Icons:** A árvore de arquivos é renderizada de forma elegante com ícones oficiais baseados na popular extensão *VSCode Material Icon Theme*.
- **Code Editor Avançado:** Impulsionado pela biblioteca `@monaco-editor/react`, proporcionando realce de sintaxe, autocompletar e diversas funcionalidades nativas de código.
- **Orquestração Multi-Agentes (WebSocket):** O terminal inclui um painel dedicado (`Agent Logs`) que detalha em tempo real as decisões tomadas pelo pool de agentes (Planner, Coder, Reviewer) através de websockets, facilitando a depuração e acompanhamento da IA de forma viva.
- **Empregabilidade de Framewoks Modernos:**
  - **Next.js 15 (App Router):** Roteamento e otimização robusta.
  - **Tailwind CSS v4:** Motor unificado de estilos com suporte a designs altamente responsivos.
  - **Zustand:** Gerenciamento de estado global leve e escalável.
  - **Motion:** Animações fluidas e transições entre componentes da interface.

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/pt-br/) >= 20.x
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/ollamacode.git
cd ollamacode
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (se necessário), copiando o template padrão:
```bash
cp .env.example .env.local
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. O aplicativo estará disponível em `http://localhost:3000`.

*Nota: Se o seu backend/orquestrador (WebSockets) residem em um repositório ou diretório separado (por exemplo, na pasta `backend/`), inicie-o também para capturar os logs dos agentes no terminal!*

## 📁 Estrutura de Diretórios Principal

- `app/`: Ponto de entrada do Next.js e roteamento do aplicativo (App Router).
- `components/`: Componentes modulares e reutilizáveis da IDE (ex: _Sidebar_, _TerminalPane_, _ChatPane_, _PreviewPane_).
- `lib/`: Utilitários, configurações contextuais e os *stores* definidos com o Zustand.
- `backend/`: Configurações ou microserviços associados, como o WebSocket que realiza log de Multi-Agent System (opcional).

## 🛠 Tecnologias Utilizadas

- [React 19](https://react.dev/)
- [Next.js 15](https://nextjs.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Framer Motion / Motion](https://motion.dev/)
- [Lucide React](https://lucide.dev/) (Ícones de UI)
- [VS Code Material Icons](https://pkief.github.io/vscode-material-icon-theme/) (Ícones de File Explorer)

## 🤝 Contribuição

Contribuições são muito bem-vindas! Se você tiver sugestões, correções de bugs ou melhorias para os agentes do OllamaCode:
1. Faça um Fork do projeto.
2. Crie uma Branch para a sua nova funcionalidade (`git checkout -b feature/minha-feature`).
3. Faça Commit de suas alterações (`git commit -m 'feat: adiciona uma nova feature TOP'`).
4. Faça Push para a branch (`git push origin feature/minha-feature`).
5. Abra um Pull Request.

## 📝 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
