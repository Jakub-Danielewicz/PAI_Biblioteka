import './App.css'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import BookPage from './pages/BookPage'
import BookRentalsPage from './pages/BookRentalsPage'
import { Routes, Route } from 'react-router'
import Layout from './components/Layout'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppRoutes() {
  const { isLoggedIn } = useAuth();

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
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
