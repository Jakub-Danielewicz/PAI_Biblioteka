import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import BookPage from './pages/BookPage'
import BookRentalsPage from './pages/BookRentalsPage'
import FavoritesPage from './pages/FavoritesPage'
import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import UserProfilePage from './pages/UserProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminPanel from './pages/AdminPanel'

function App() {

  return (
    <Layout>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/book/:id'
          element={
            <ProtectedRoute>
              <BookPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/rentals'
          element={
            <ProtectedRoute>
              <BookRentalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/favorites'
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
         <Route
          path='/adminPanel'
          element={<AdminPanel />}
        />
      </Routes>
    </Layout>
  )
}

export default App
