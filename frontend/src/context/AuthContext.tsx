import { useState, useContext, createContext, useEffect, type PropsWithChildren } from "react";

type User = {
  username: string,
  email: string, 
  firstName: string,
  lastName: string
}

type AuthContextType = {
  isLoggedIn: boolean;
  user: User;
  setUser: (user: User) => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  register: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [user, setUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { username: '', email: '', firstName: '', lastName: '' };
  });

  const login = async () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  }

  const logout = async () => {
    setIsLoggedIn(false);
    setUser({ username: '', email: '', firstName: '', lastName: '' });
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  }

  const register = async () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  }

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}