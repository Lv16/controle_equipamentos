import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authService.isAuthenticated()) {
    return <Navigate to="/producao/ordem" replace />;
  }

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/producao/ordem';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(email, senha);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'E-mail ou senha invalidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Entrar</h2>

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="senha">Senha</label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          autoComplete="current-password"
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
};

export default Login;
