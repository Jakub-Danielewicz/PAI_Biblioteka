import { Field, Input, Label } from '@headlessui/react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useAuth } from "../context/AuthContext";

export default function LoginForm() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuth(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Proszę podać prawidłowy adres email");
      return;
    }

    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków");
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const res = await axios.post('http://localhost:3001/api/auth/register', {
          name: firstName,
          email,
          password,
        });
        alert(`Rejestracja pomyślna: ${res.data.user.name}`);
      } else {
        const res = await axios.post('http://localhost:3001/api/auth/login', {
          email,
          password,
        });
        login(res.data.token, res.data.user);
        navigate("/")
        // alert(`Welcome back, ${res.data.user.name}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Błąd serwera');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {isSignUp ? 'Utwórz konto' : 'Witamy ponownie'}
        </h2>
        <p className="text-white/80">
          {isSignUp ? 'Dołącz dziś do naszej społeczności bibliotecznej' : 'Zaloguj się, aby uzyskać dostęp do swojej biblioteki'}
        </p>
      </div>

      {error && <div className="text-red-400 text-sm text-center">{error}</div>}

      {isSignUp && (
        <Field>
          <Label className="block text-sm font-medium text-white mb-2">
            Imię
          </Label>
          <Input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
            placeholder="Jan"
            required
          />
        </Field>
      )}

      <Field>
        <Label className="block text-sm font-medium text-white mb-2">
          Adres email
        </Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
          placeholder={isSignUp ? "jan.kowalski@example.com" : "Wprowadź swój email"}
          required
        />
      </Field>

      <Field>
        <Label className="block text-sm font-medium text-white mb-2">
          Hasło
        </Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-white/50 border border-gray-200/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition placeholder-gray-500 backdrop-blur-sm"
          placeholder={isSignUp ? "Utwórz bezpieczne hasło" : "Wprowadź swoje hasło"}
          required
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600/90 backdrop-blur-sm text-white py-3 rounded-lg font-semibold hover:bg-purple-700/90 transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {loading ? 'Proszę czekać...' : isSignUp ? 'Utwórz konto' : 'Zaloguj się'}
      </button>

      <div className="text-center space-y-2">
        <div className="text-sm text-white/80">
          {isSignUp ? 'Masz już konto?' : 'Nie masz jeszcze konta?'}{' '}
          <span
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white underline hover:text-white/80 transition-colors cursor-pointer"
          >
            {isSignUp ? 'Zaloguj się tutaj' : 'Utwórz je tutaj'}
          </span>
        </div>
        <div className="text-xs text-white/60">
          {isSignUp
            ? 'Dołącz do tysięcy miłośników książek w naszej cyfrowej bibliotece.'
            : 'Uzyskaj dostęp do swojej osobistej kolekcji i odkrywaj nowe książki.'}
        </div>
      </div>
    </form>
  );
}
