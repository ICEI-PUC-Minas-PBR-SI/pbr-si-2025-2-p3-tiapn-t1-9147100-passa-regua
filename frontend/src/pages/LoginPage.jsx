import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../components/CloseButton';

/**
 * LoginPage renders the initial login form where users can enter
 * their email and password to access the system. The layout follows
 * the mobile‑first wireframe provided by the project documentation.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.message || (res.status === 403 ? '2FA pendente. Conclua a verificação.' : 'Credenciais inválidas.');
        throw new Error(msg);
      }
      const data = await res.json();
      // Login bem-sucedido: redireciona para a página de gerenciamento de grupo
      navigate('/manage-group');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // TODO: replace with real authentication logic.
    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    // Simulate successful login by redirecting to groups (not implemented yet).
    console.log('Login with', { email, password });
    alert(`Você entrou como ${email}. A funcionalidade de grupos será implementada futuramente.`);
  };

  const goToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
      {/* Close button navigates back or can be hooked to a custom handler */}
      <CloseButton onClick={() => navigate('/')} />
      <h1>Entrar com email</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit2}>
        <div className="input-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu email"
          />
        </div>
        <div className="input-field">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
          />
        </div>
        <button type="submit" className="button">
          Entrar
        </button>
      </form>
      <button className="button outlined" onClick={goToRegister}>
        Criar uma conta
      </button>
    </div>
  );
}
