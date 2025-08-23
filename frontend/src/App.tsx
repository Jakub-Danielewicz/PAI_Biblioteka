import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import BookPage from './pages/BookPage'
import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import { useState } from 'react'

function App() {
  const [isLoggedIn, _] = useState(false)

  return (
    <Layout>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <HomePage /> : <LoginPage />}
        />
        <Route
          path='/book/:id'
          element={<BookPage />}
        />

      </Routes>
    </Layout>
  )
}

export default App
