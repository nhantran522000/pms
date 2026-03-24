import { Inter } from 'next/font/google';
import './global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'PMS - Personal Management System',
  description: 'Unified personal data platform with AI-powered insights',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
