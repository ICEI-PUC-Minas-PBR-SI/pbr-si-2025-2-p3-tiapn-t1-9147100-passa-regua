import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../components/CloseButton';

/**
 * RegisterPage allows new users to create an account. It mirrors
 * the wireframe that captures personal details, login credentials and
 * selection of demographic options such as gender and age. After the
 * user submits the form, the next step is to choose the 2FA method.
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !contact || !password || !gender || !age) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primeiroNome: firstName,
          ultimoNome: lastName,
          contato: contact,
          senha: password,
          genero: gender,
          idade: Number(age),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const detailed = Array.isArray(data.errors)
          ? data.errors.map((e) => e.message || '').filter(Boolean).join(' | ')
          : undefined;
        const msg = detailed || data.message || 'Falha ao registrar.';
        throw new Error(msg);
      }
      const data = await res.json();
      localStorage.setItem('auth_usuario_id', String(data.usuarioId));
      // Envia código de 2FA apenas por EMAIL e segue para verificação
      await fetch('/api/auth/2fa/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: Number(data.usuarioId), method: 'EMAIL' }),
      });
      navigate('/verify-code', { state: { method: 'email' } });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Basic validation
    if (!firstName || !lastName || !contact || !password || !gender || !age) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    // TODO: call API to register the user here.
    console.log('Registering', { firstName, lastName, contact, password, gender, age });
    // Envia código por EMAIL e segue para verificação
    navigate('/verify-code', { state: { method: 'email' } });
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleAgeChange = (e) => {
    setAge(e.target.value);
  };

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
      <CloseButton onClick={() => navigate('/login')} />
      <h1>Criar uma conta</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit2}>
        <div className="input-field">
          <label htmlFor="firstName">Primeiro nome</label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Digite seu primeiro nome"
          />
        </div>
        <div className="input-field">
          <label htmlFor="lastName">Último nome</label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Digite seu último nome"
          />
        </div>
        <div className="input-field">
          <label htmlFor="contact">Email</label>
          <input
            id="contact"
            type="email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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
            placeholder="Crie uma senha"
          />
        </div>
        <div className="input-field" style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="gender">Gênero</label>
            <select id="gender" value={gender} onChange={handleGenderChange}>
              <option value="">Selecione</option>
              <option value="feminino">Feminino</option>
              <option value="masculino">Masculino</option>
              <option value="nao-binario">Não Binário</option>
              <option value="outro">Outro</option>
              <option value="prefiro-nao-informar">Prefiro não informar</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="age">Idade</label>
            <select id="age" value={age} onChange={handleAgeChange}>
              <option value="">Selecione</option>
              {/* Generate age options from 18 to 100 */}
              {Array.from({ length: 83 }, (_, i) => 18 + i).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="button">
          Cadastrar
        </button>
      </form>
      <div className="small-link">
        Ao assinar, você concorda com os <a href="#">termos de serviço</a> e
        <br />
        <a href="#">política de privacidade</a>
      </div>
      <button className="button outlined" onClick={() => navigate('/login')}>
        Já tem uma conta?
      </button>
    </div>
  );
}
