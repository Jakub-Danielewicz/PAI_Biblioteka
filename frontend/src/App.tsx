import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import BookPage from './pages/BookPage'
import BookRentalsPage from './pages/BookRentalsPage'
import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import { useState } from 'react'
import UserProfilePage from './pages/UserProfilePage'

function App() {
  const [isLoggedIn, _] = useState(true)

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
        <Route
          path='/rentals'
          element={<BookRentalsPage />}
        />

         <Route
          path='/profile'
          element={<UserProfilePage />}
        />

      </Routes>
    </Layout>
  )
}

export default App
