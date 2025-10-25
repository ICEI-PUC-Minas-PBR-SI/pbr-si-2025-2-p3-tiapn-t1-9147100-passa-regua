// src/pages/CreateGroupPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateGroupPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cover, setCover] = useState(null);
  const [inviteText, setInviteText] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  function buildDraft() {
    return {
      name: name.trim(),
      description: description.trim(),
      coverName: cover?.name || null,
      invitePreset: inviteText.trim() || null,
    };
  }

  function goWithDraft() {
    const draft = buildDraft();
    sessionStorage.setItem('groupDraft', JSON.stringify(draft));
    navigate('/invite-members', { state: { draft } });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Informe o nome do grupo.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
        }),
      });

      if (res.status === 404) {
        goWithDraft();
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Não foi possível criar o grupo no servidor.');
      }

      const data = await res.json().catch(() => ({}));
      const groupId = data.id ?? data.groupId ?? null;

      const draft = buildDraft();
      sessionStorage.setItem('groupDraft', JSON.stringify(draft));
      navigate('/invite-members', { state: { groupId, draft } });
    } catch (err) {
      setError(err.message || 'Erro inesperado ao criar o grupo.');
    } finally {
      setSaving(false);
    }
  }

  function handleInviteShortcut(e) {
    e.preventDefault();
    goWithDraft();
  }

  return (
    <div className="auth-container">
      <h1>Novo Grupo</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="group-name">Nome do Grupo</label>
          <input
            id="group-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Viagem a Capitólio"
          />
        </div>

        <div className="input-field">
          <label htmlFor="group-description">Descrição</label>
          <textarea
            id="group-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        <div className="input-field">
          <label htmlFor="group-cover">Imagem de capa</label>
          <input
            id="group-cover"
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files?.[0] || null)}
          />
          {cover && (
            <div className="hint" style={{ marginTop: 6 }}>
              Selecionado: {cover.name}
            </div>
          )}
        </div>

        <div className="input-field">
          <label htmlFor="invite-input">Convidar participantes</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              id="invite-input"
              value={inviteText}
              onChange={(e) => setInviteText(e.target.value)}
              placeholder="Digite nome, e-mail, @usuário…"
            />
            <button
              type="button"
              className="button"
              style={{ width: 'auto', padding: '0 14px' }}
              title="Adicionar / Ir para convites"
              onClick={handleInviteShortcut}
            >
              +
            </button>
          </div>
          <div className="small-link" style={{ textAlign: 'left' }}>
            <button
              type="button"
              className="linklike"
              onClick={handleInviteShortcut}
              aria-label="Convidar por link"
            >
              Convidar por link
            </button>
          </div>
        </div>

        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Criando…' : 'Criar grupo'}
        </button>
      </form>
    </div>
  );
}
