import { Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-10 space-y-6 bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/30">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Sign In</h2>
      
      <Field>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Email
        </Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
          placeholder="Enter your email"
          required
        />
      </Field>

      <Field>
        <Label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
          placeholder="Enter your password"
          required
        />
      </Field>

      <button
        type="submit"
        className="w-full bg-amber-600/90 backdrop-blur-sm text-white py-3 rounded-lg font-semibold hover:bg-amber-700/90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
      >
        Sign In
      </button>

      <div className="text-center text-sm text-gray-700">
        Don't have an account?{' '}
        <a href="#" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
          Sign up
        </a>
      </div>
    </form>
  )
}