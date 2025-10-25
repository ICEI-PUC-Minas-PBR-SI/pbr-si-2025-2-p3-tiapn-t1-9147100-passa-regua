// src/pages/EditGroupPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';

export default function EditGroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function safeBack() {
    if (window.history.length > 1) navigate(-1); else navigate('/profile');
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      setError('');
      setLoading(true);
      try {
        const res = await fetch(`/api/groups/${id}`, { credentials: 'include' });
        if (res.status === 401) { navigate('/login', { replace: true }); return; }
        if (!res.ok) throw new Error('Falha ao carregar o grupo.');
        const g = await res.json();
        if (!alive) return;
        setName(g.name || '');
        setDescription(g.description || '');
      } catch (e) {
        if (!alive) return;
        setError(e.message || 'Erro ao carregar o grupo.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id, navigate]);

  async function handleSave(e) {
    e.preventDefault();
    setError('');
    const body = { name: name.trim(), description: description.trim() };
    if (!body.name) { setError('Informe o nome do grupo.'); return; }
    try {
      setSaving(true);
      const res = await fetch(`/api/groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (res.status === 401) { navigate('/login', { replace: true }); return; }
      if (!res.ok) throw new Error('Não foi possível salvar as alterações.');
      navigate('/profile', { replace: true });
    } catch (e) {
      setError(e.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-container">
        <Header title="Editar grupo" onBack={safeBack} />
        <p>Carregando…</p>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <Header title="Editar grupo" onBack={safeBack} />

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSave}>
        <div className="input-field">
          <label htmlFor="group-name">Nome do Grupo</label>
          <input id="group-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Digite o nome do grupo" />
        </div>
        <div className="input-field">
          <label htmlFor="group-desc">Descrição</label>
          <textarea id="group-desc" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Opcional" />
        </div>
        <button className="button" type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar'}</button>
      </form>
    </div>
  );
}

