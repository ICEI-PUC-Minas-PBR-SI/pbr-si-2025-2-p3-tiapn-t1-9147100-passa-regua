import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header, { Icon } from '../components/Header.jsx';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [items, setItems] = useState([]);

  function safeBack() {
    if (window.history.length > 1) navigate(-1); else navigate('/profile');
  }

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' });
      if (res.status === 401) { navigate('/login', { replace: true }); return; }
      if (!res.ok) throw new Error('Falha ao carregar notificações');
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(id) {
    try { await fetch(`/api/notifications/${id}/read`, { method: 'POST', credentials: 'include' }); } catch {}
    setItems(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n));
  }

  async function acceptInvite(n) {
    if (!n.inviteToken) return;
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(n.inviteToken)}/accept`, { method: 'POST', credentials: 'include' });
      if (res.status === 401) { navigate('/login', { replace: true }); return; }
      if (!res.ok) throw new Error('Falha ao aceitar convite');
      await markRead(n.id);
      alert('Você entrou no grupo.');
      navigate(`/manage-group?id=${encodeURIComponent(n.groupId)}`, { state: { groupId: n.groupId } });
    } catch (e) { alert(e.message || 'Erro ao aceitar.'); }
  }

  async function declineInvite(n) {
    if (!n.inviteToken) return;
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(n.inviteToken)}/decline`, { method: 'POST', credentials: 'include' });
      if (res.status === 401) { navigate('/login', { replace: true }); return; }
      if (!res.ok) throw new Error('Falha ao recusar convite');
      await markRead(n.id);
    } catch (e) { alert(e.message || 'Erro ao recusar.'); }
  }

  return (
    <div className="auth-container">
      {/* Cabeçalho de notificações */}
      <Header title="Notificações" onBack={safeBack} />

      {error && <div className="error-message">{error}</div>}
      {loading && <p>Carregando…</p>}

      {!loading && items.length === 0 && (
        <div className="card">Nenhuma notificação.</div>
      )}

      {!loading && items.map(n => (
        <div key={n.id} className="row line" style={{ alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>{n.title || 'Notificação'}</div>
            <div className="small" style={{ opacity: 0.9 }}>{n.message}</div>
          </div>
          {n.type === 'GROUP_INVITE' ? (
            <>
              <button className="icon-btn icon-btn--primary" title="Entrar" onClick={() => acceptInvite(n)}>
                <Icon type="check" />
              </button>
              <button className="icon-btn" title="Recusar" onClick={() => declineInvite(n)} style={{ marginLeft: 6 }}>
                <Icon type="x" />
              </button>
            </>
          ) : (
            <button className="icon-btn" title="Marcar como lida" onClick={() => markRead(n.id)}>
              <Icon type="check" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

