import type { ReactNode } from "react"
import AnimatedBookStack from "../components/AnimatedBookStack"
import LoginForm from "../components/LoginForm"

export default function LoginPage(): ReactNode {
  return (
    <div className='w-full h-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8'>
      <div className='w-full max-w-6xl h-full bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30 flex'>
        <div className='w-1/2 h-full flex items-center justify-center p-8'>
          <div className='w-full h-3/4'>
            <AnimatedBookStack />
          </div>
        </div>
        <div className='w-px bg-white/30 my-8'></div>
        <div className='w-1/2 h-full flex items-center justify-center p-8'>
          <LoginForm />
        </div>
      </div>
    </div>
  )

}
