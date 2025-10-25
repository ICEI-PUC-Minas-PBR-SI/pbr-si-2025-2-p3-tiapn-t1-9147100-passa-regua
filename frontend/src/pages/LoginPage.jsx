// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../components/CloseButton';

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
        // O backend espera "senha" (não "password")
        body: JSON.stringify({ email, senha: password }),
        // IMPORTANTE: inclui cookies de sessão (JSESSIONID)
        credentials: 'include',
      });

      // Caso de 2FA pendente
      if (res.status === 403) {
        const usuarioId = localStorage.getItem('auth_usuario_id');
        if (!usuarioId) {
          setError('2FA pendente. Não foi possível identificar o usuário.');
          return;
        }
        await fetch('/api/auth/2fa/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioId: Number(usuarioId), method: 'EMAIL' }),
          credentials: 'include',
        });
        navigate('/verify-code', { state: { method: 'email' } });
        return;
      }

      // Outros erros de autenticação
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data.message ||
          (res.status === 403 ? '2FA pendente. Conclua a verificação.' : 'Credenciais inválidas.');
        throw new Error(msg);
      }

      // Se a API devolver JSON (ex.: token/usuarioId), aproveita
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const data = await res.json().catch(() => ({}));
        if (data.token) localStorage.setItem('auth_token', data.token);
        if (data.usuarioId ?? data.userId) {
          localStorage.setItem('auth_usuario_id', String(data.usuarioId ?? data.userId));
        }
      }
      // Se a API usar somente cookie de sessão, o credentials: 'include' já cuidou

      // Sucesso -> se houver convite pendente, volta para a tela de convite
      const pending = sessionStorage.getItem('pendingInviteId');
      if (pending) {
        sessionStorage.removeItem('pendingInviteId');
        navigate(`/invite/${pending}`, { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Erro inesperado ao entrar.');
    }
  };

  const goToRegister = () => navigate('/register');

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
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

        <button type="submit" className="button">Entrar</button>
      </form>

      <button className="button outlined" onClick={goToRegister}>
        Criar uma conta
      </button>
    </div>
  );
}
