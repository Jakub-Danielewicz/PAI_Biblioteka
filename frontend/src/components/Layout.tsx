import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user, isLoggedIn } = useAuth()

  return (
    <div className='w-full h-screen'>
      {isLoggedIn && user?.email !== "admin@admin.pl" && <Navbar />}
      {children}
    </div>
  )
}
