import type { ReactNode } from 'react'
import Logo from './Logo'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className='flex w-full h-full'>
      <div className='flex flex-col w-full h-full bg-gradient-to-br from-amber-200 via-orange-200 to-yellow-200 p-8'>
        <div className='flex justify-start mb-8'>
          <Logo />
        </div>
        <div className='flex flex-1 items-center justify-center'>
          {children}
        </div>
      </div>
    </div>
  )
}