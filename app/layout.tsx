import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Text Sanitizer – AI Response Cleaner & Text Formatting Stripper',
  description:
    'Free online tool to paste AI responses, documents, or emails and automatically strip disclaimers, boilerplate phrases, markdown tags, repeated sentences, and emojis.',
  keywords: [
    'Text Sanitizer',
    'AI Cleaner',
    'Remove AI Boilerplate',
    'Strip Markdown',
    'Text Cleaner',
    'Deduplicate Sentences',
    'Response Sanitizer',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
