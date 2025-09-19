import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import CloseButton from '../components/CloseButton';

/**
 * VerifyCodePage renders the interface for the user to enter the 2FA code
 * sent via e‑mail or celular. The component uses four separate input
 * fields to mimic the wireframe design, and offers a button to paste a
 * copied code. It also displays error feedback when an invalid code is
 * entered.
 */
export default function VerifyCodePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const method = location?.state?.method || 'email';
  const [code, setCode] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputsRef = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/i.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // Move focus to next input
    if (value && index < inputsRef.length - 1) {
      inputsRef[index + 1].current.focus();
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const chars = text.replace(/\D/g, '').slice(0, 4).split('');
        const newCode = ['','', '', ''];
        chars.forEach((char, i) => {
          newCode[i] = char;
        });
        setCode(newCode);
        // Focus last filled input
        const lastIndex = chars.length - 1;
        if (lastIndex >= 0 && inputsRef[lastIndex]) {
          inputsRef[lastIndex].current.focus();
        }
      }
    } catch (err) {
      console.error('Clipboard read failed', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const finalCode = code.join('');
    if (finalCode.length < 4) {
      setError('Digite o código completo.');
      return;
    }
    // TODO: call API to verify code here.
    const isValid = finalCode === '1234'; // placeholder for demonstration
    if (!isValid) {
      setError('Código incorreto, verifique os números digitados');
      return;
    }
    alert(`Código verificado com sucesso via ${method}!`);
    // After successful verification, redirect user to login page
    navigate('/login');
  };

  return (
    <div className="auth-container" style={{ position: 'relative' }}>
      <CloseButton onClick={() => navigate('/two-factor')} />
      <h1>Digite aqui o código enviado</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="code-inputs">
          {code.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={inputsRef[index]}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className={error ? 'error' : ''}
            />
          ))}
        </div>
        <button type="button" className="button outlined" onClick={handlePaste}>
          Preencher com código copiado
        </button>
        <button type="submit" className="button">
          Validar Código
        </button>
      </form>
      <div className="small-link">
        Ao assinar, você concorda com os <a href="#">termos de serviço</a> e
        <br />
        <a href="#">política de privacidade</a>
      </div>
    </div>
  );
}