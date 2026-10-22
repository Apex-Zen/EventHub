// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'
import Sidebar from '../components/Sidebar'; 

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans flex h-screen bg-[#edf4f2] text-[#1d2a2b] antialiased`}>
        <Sidebar />

        <main className="ml-[250px] flex-1 overflow-y-auto px-4 py-2">
          {children}
        </main>
      </body>
    </html>
  )
}