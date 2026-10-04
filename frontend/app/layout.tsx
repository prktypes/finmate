import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FinMate - AI-Powered Financial Analysis',
  description: 'Privacy-first agentic personal finance intelligence powered by local LLMs.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
