import React, { useEffect, useMemo, useState } from 'react';
import Avatar from '../components/Avatar.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import Header, { Icon } from '../components/Header.jsx';

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
        fill="none"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm6-3a6 6 0 1 1-12 0M12 17v4m-3 0h6"
        fill="none"
        stroke="#666"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function InviteMembersPage() {
  const location = useLocation();
  const { state } = useLocation();
  const navigate = useNavigate();

  const draft = state?.draft || JSON.parse(sessionStorage.getItem('groupDraft') || 'null');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const groupId = params.get('id');

  const add = (user) => {
    if (!selected.some(s => String(s.id) === String(user.id))) {
      setSelected(prev => [...prev, user]);
    }
  };

  useEffect(() => {
    let active = true;
    const loadFriends = async () => {
      setLoading(true);
      try {
        // Lista de amigos do usuário logado
        const res = await fetch(`/api/friends`, { credentials: 'include' });
        if (!active) return;
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data?.content ?? []);
          const norm = list.map(u => ({
            id: u.id ?? u.userId ?? u.uuid ?? u.email ?? u.username ?? Math.random().toString(36).slice(2),
            name: u.name ?? u.nome ?? u.fullName ?? u.username ?? u.email ?? 'Usuário',
          }));
          setFriends(norm);
        } else if (res.status === 404) {
          // Backend ainda não implementado -> sem amigos listados
          setFriends([]);
        } else if (res.status === 401) {
          // Não autenticado
          navigate('/login', { replace: true });
        } else {
          setFriends([]);
        }
      } catch {
        if (!active) return;
        setFriends([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadFriends();
    return () => { active = false; };
  }, [navigate]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter(f => (f.name || '').toLowerCase().includes(term));
  }, [q, friends]);

  const copyInvite = async () => {
    const base = window.location.origin;
    let link = groupId ? `${base}/invite/${groupId}` : `${base}/invite`;
    // Tenta gerar um convite único no backend
    if (groupId) {
      try {
        const res = await fetch(`/api/groups/${encodeURIComponent(groupId)}/invites`, {
          method: 'POST',
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          // Esperado: { inviteId, url }
          if (data.url) {
            link = data.url.startsWith('http') ? data.url : `${base}${data.url}`;
          } else if (data.inviteId) {
            link = `${base}/invite/${data.inviteId}`;
          }
        }
      } catch {
        // fallback mantém link genérico
      }
    }
    try {
      await navigator.clipboard.writeText(link);
      alert('Link copiado para a área de transferência.');
    } catch {
      prompt('Copie o link:', link);
    }
  };

  const finish = async () => {
    if (!groupId) {
      alert('ID do grupo não encontrado.');
      return;
    }
    try {
      const body = { userIds: selected.map(s => s.id) };
      const res = await fetch(`/api/groups/${encodeURIComponent(groupId)}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      if (!res.ok && res.status !== 404) {
        throw new Error('Falha ao enviar convites.');
      }
    } catch (e) {
      console.warn(e);
    }
    navigate(`/manage-group?id=${encodeURIComponent(groupId)}`, { state: { draft, invited: selected } });
  };

  const goBack = () => {
    if (draft) sessionStorage.setItem('groupDraft', JSON.stringify(draft));
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="auth-container">
      {/* Cabeçalho padrão com botão de voltar */}
      <Header title="Convidar" onBack={goBack} />

      {/* campo de busca */}
      <div className="input-field">
        <div className="search-bar">
          <span className="search-icon-left"><SearchIcon /></span>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="procurar amigo"
            aria-label="procurar amigo"
          />
          <button
            type="button"
            className="search-icon-right"
            title="Buscar por voz (mock)"
            onClick={() => alert('Busca por voz (mock)')}
          >
            <MicIcon />
          </button>
        </div>
      </div>

  {/* lista */}
  {loading && (
    <div className="small" style={{ padding: '8px 0' }}>Buscando…</div>
  )}
  {!loading && filtered.length === 0 && (
    <div className="small" style={{ padding: '8px 0' }}>
      Você ainda não tem amigos. Use "Convidar por link" abaixo.
    </div>
  )}
      {!loading && filtered.map(f => (
        <div
          key={f.id}
          className="row line"
          style={{ alignItems:'center', padding:'12px 0' }}
        >
          <Avatar name={f.name} email={f.email} />
          <div style={{ flex: 1 }}>{f.name}</div>
          <button
            className="icon-btn icon-btn--primary"
            onClick={() => add(f)}
            title="Adicionar"
          >
            <Icon type="plus" />
          </button>
          <button
            className="icon-btn"
            title="Remover amigo"
            onClick={async () => {
              try {
                const res = await fetch(`/api/friends/${encodeURIComponent(f.id)}`, {
                  method: 'DELETE',
                  credentials: 'include',
                });
                if (res.status === 401) {
                  navigate('/login', { replace: true });
                  return;
                }
                if (res.ok || res.status === 204) {
                  setFriends(prev => prev.filter(x => String(x.id) !== String(f.id)));
                  setSelected(prev => prev.filter(x => String(x.id) !== String(f.id)));
                } else {
                  alert('Não foi possível remover o amigo.');
                }
              } catch {
                alert('Falha ao remover amigo.');
              }
            }}
            style={{ marginLeft: 8 }}
          >
            <Icon type="x" />
          </button>
        </div>
      ))}

      <div className="small-link" style={{textAlign:'left'}}>
        <a href="#" onClick={(e)=>{e.preventDefault(); copyInvite();}}>Convidar por link</a>
      </div>

      {selected.length>0 && (
        <div className="small-link" style={{textAlign:'left', marginTop:'12px'}}>
          <strong>Selecionados:</strong> {selected.map(s=>s.name).join(', ')}
        </div>
      )}

      <button className="button" onClick={finish} style={{marginTop:'16px'}}>Continuar</button>
    </div>
  );
}
