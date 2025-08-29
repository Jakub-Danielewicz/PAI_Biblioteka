import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import Navbar from './Navbar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { isLoggedIn } = useAuth()

  return (
    <div className='w-full h-screen'>
      {isLoggedIn && <Navbar />}
      {children}
    </div>
  )
}
