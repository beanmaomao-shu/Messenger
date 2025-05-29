import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ToasterContext from './context/ToasterContext';
import AuthContext from './context/AuthContext';
import './globals.css';
import ActiveStatus from './components/ActiveStatus';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
// 元数据（网页名和描述）
export const metadata: Metadata = {
  title: 'Messenger Clone',
  description: 'Messenger Clone',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 方便全局使用组件 */}
        <AuthContext>
          <ToasterContext />
          <ActiveStatus />
          {children}
        </AuthContext>
      </body>
    </html>
  );
}
