// app/layout.tsx
import './globals.css'
import Sidebar from '../components/Sidebar'; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-gray-50 font-sans">
        
        
        <Sidebar />

        
        <main className="ml-64 flex-1 p-10 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  )
}