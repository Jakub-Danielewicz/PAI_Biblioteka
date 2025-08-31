import { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoggedIn } = useAuth()

  if (!isLoggedIn || user?.email == "admin@admin.pl") {
    return <LoginPage />;
  }

  return <>{children}</>;
}