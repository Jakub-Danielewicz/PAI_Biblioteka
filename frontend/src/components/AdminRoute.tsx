// src/routes/AdminRoute.tsx
import { type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import LoginPage from '../pages/LoginPage';
import HomePage from "../pages/HomePage";

interface AdminRouteProps {
  children: ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  if (user?.email !== "admin@admin.pl") {
    return <HomePage />;
  }

  return <>{children}</>;
}
