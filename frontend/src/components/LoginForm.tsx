import { Field, Input, Label } from '@headlessui/react'
import { useState } from 'react'

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      console.log('Sign up attempt:', { firstName, lastName, email, password })
    } else {
      console.log('Login attempt:', { email, password })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-white/80">
          {isSignUp ? 'Join our library community today' : 'Sign in to access your library'}
        </p>
      </div>
      
      {isSignUp && (
        <div className="flex gap-4">
          <Field className="flex-1">
            <Label className="block text-sm font-medium text-white mb-2">
              First Name
            </Label>
            <Input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
              placeholder="John"
              required
            />
          </Field>
          
          <Field className="flex-1">
            <Label className="block text-sm font-medium text-white mb-2">
              Last Name
            </Label>
            <Input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
              placeholder="Doe"
              required
            />
          </Field>
        </div>
      )}

      <Field>
        <Label className="block text-sm font-medium text-white mb-2">
          Email Address
        </Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
          placeholder={isSignUp ? "john.doe@example.com" : "Enter your email"}
          required
        />
      </Field>

      <Field>
        <Label className="block text-sm font-medium text-white mb-2">
          Password
        </Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
          placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
          required
        />
      </Field>

      <button
        type="submit"
        className="w-full bg-purple-600/90 backdrop-blur-sm text-white py-3 rounded-lg font-semibold hover:bg-purple-700/90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
      >
        {isSignUp ? 'Create Account' : 'Sign In'}
      </button>

      <div className="text-center space-y-2">
        <div className="text-sm text-white/80">
          {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white underline hover:text-white/80 transition-colors cursor-pointer"
          >
            {isSignUp ? 'Sign in here' : 'Create one here'}
          </span>
        </div>
        <div className="text-xs text-white/60">
          {isSignUp 
            ? 'Join thousands of book lovers in our digital library.' 
            : 'Access your personal collection and discover new books.'
          }
        </div>
      </div>
    </form>
  )
}