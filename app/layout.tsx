import type {Metadata} from 'next';
import { Inter, Fira_Code } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'OllamaCode IDE',
  description: 'IDE Open Source para modelos locais do Ollama',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`dark ${inter.variable} ${firaCode.variable}`}>
      <body className="bg-[#09090b] text-neutral-100 font-sans antialiased overflow-hidden selection:bg-blue-500/30 selection:text-blue-200" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
