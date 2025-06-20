import './App.css'
import AnimatedBookStack from './components/AnimatedBookStack'
import LoginForm from './components/LoginForm'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <div className='w-3/5 h-3/4'>
        <AnimatedBookStack />
      </div>
      <div className='w-full h-ful flex items-center justify-center'>
        <LoginForm />
      </div>
    </Layout>
  )
}

export default App
