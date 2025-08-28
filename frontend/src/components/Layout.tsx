import type { ReactNode } from 'react'
import Navbar from './Navbar'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className='w-full min-h-screen bg-gray-50 flex flex-col'>
      <Navbar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
