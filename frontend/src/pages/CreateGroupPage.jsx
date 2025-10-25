// src/pages/CreateGroupPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import { useNavigate } from 'react-router-dom';
import Header, { Icon } from '../components/Header.jsx';

export default function CreateGroupPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch('/api/friends', { credentials: 'include' });
        if (!alive) return;
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data?.content ?? []);
          const norm = list.map(u => ({
            id: u.id ?? u.userId ?? u.uuid ?? u.email,
            name: u.name ?? u.nome ?? u.fullName ?? u.username ?? u.email ?? 'Usuário',
            email: u.email ?? u.username ?? null,
          }));
          setFriends(norm);
        }
      } catch {}
    })();
    return () => { alive = false; };
  }, []);

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
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });
      if (res.status === 404) {
        navigate('/profile', { replace: true });
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Não foi possível criar o grupo no servidor.');
      }
      const group = await res.json().catch(() => ({}));
      const groupId = group?.id;
      if (groupId && selected.length > 0) {
        const body = { userIds: selected.map(s => String(s.id ?? s.email)) };
        await fetch(`/api/groups/${groupId}/invite`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        }).catch(()=>{});
      }
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err.message || 'Erro inesperado ao criar o grupo.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="auth-container">
      {/* Cabeçalho padrão com seta para voltar */}
      <Header
        title="Novo Grupo"
        onBack={() => { if (window.history.length > 1) navigate(-1); else navigate('/profile'); }}
      />
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label htmlFor="group-name">Nome do Grupo</label>
          <input id="group-name" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Ex.: Viagem a Capitólio" />
        </div>
        <div className="input-field">
          <label htmlFor="group-description">Descrição</label>
          <textarea id="group-description" rows={4} value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Opcional" />
        </div>

        <div className="input-field">
          <label>Convidar participantes (amigos)</label>
          <div className="hint" style={{ marginBottom: 6 }}>Selecione amigos para adicionar ao grupo após a criação.</div>
          <FriendsPicker friends={friends} selected={selected} setSelected={setSelected} />
        </div>

        <button className="button" type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar grupo'}</button>
      </form>
    </div>
  );
}

function FriendsPicker({ friends, selected, setSelected }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter(f => (f.name || '').toLowerCase().includes(term));
  }, [q, friends]);

  const isSelected = (id) => selected.some(s => String(s.id) === String(id));
  const toggle = (u) => {
    setSelected(prev => isSelected(u.id) ? prev.filter(x => String(x.id) !== String(u.id)) : [...prev, u]);
  };

  return (
    <div>
      <div className="input-field" style={{ marginBottom: 8 }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar amigo" aria-label="Buscar amigo" />
      </div>
      <div style={{ maxHeight: 240, overflow: 'auto', border: '1px solid #eee', borderRadius: 8, padding: '0 8px' }}>
        {filtered.map(u => (
          <div key={u.id} className="row line" style={{ alignItems: 'center', padding: '12px 0' }}>
            <Avatar name={u.name} email={u.email} />
            <div style={{ flex: 1 }}>{u.name}</div>
            <button
              type="button"
              className={`icon-btn ${isSelected(u.id) ? '' : 'icon-btn--primary'}`}
              title={isSelected(u.id) ? 'Remover' : 'Adicionar'}
              onClick={() => toggle(u)}
              aria-pressed={isSelected(u.id)}
            >
              {isSelected(u.id) ? <Icon type="minus" /> : <Icon type="plus" />}
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="small" style={{ padding: '8px 0' }}>Nenhum amigo encontrado.</div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="small" style={{ marginTop: 6 }}>
          Selecionados: {selected.map(s => s.name).join(', ')}
        </div>
      )}
    </div>
  );
}

