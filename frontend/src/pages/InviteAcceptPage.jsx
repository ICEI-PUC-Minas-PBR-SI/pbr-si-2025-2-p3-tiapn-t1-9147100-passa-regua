import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function InviteAcceptPage() {
  const { inviteId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [invite, setInvite] = useState(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/invites/${encodeURIComponent(inviteId)}`, {
          credentials: 'include',
        });
        if (!active) return;
        if (res.status === 401) {
          // Double-check session before redirecting to login
          try {
            const me = await fetch('/api/auth/me', { credentials: 'include' });
            if (me.ok) {
              setError('Não foi possível carregar o convite agora. Tente novamente.');
              return;
            }
          } catch {}
          sessionStorage.setItem('pendingInviteId', inviteId);
          navigate('/login');
          return;
        }
        if (!res.ok) throw new Error('Convite inválido ou expirado.');
        const data = await res.json();
        setInvite(data);
      } catch (e) {
        if (!active) return;
        setError(e.message || 'Falha ao carregar convite.');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [inviteId, navigate]);

  const accept = async () => {
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(inviteId)}/accept`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.status === 401) {
        sessionStorage.setItem('pendingInviteId', inviteId);
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error('Falha ao aceitar convite.');
      const go = invite?.groupId ? `/manage-group?id=${encodeURIComponent(invite.groupId)}` : '/profile';
      navigate(go, { replace: true });
    } catch (e) {
      alert(e.message || 'Erro ao aceitar convite.');
    }
  };

  const decline = async () => {
    try {
      const res = await fetch(`/api/invites/${encodeURIComponent(inviteId)}/decline`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.status === 401) {
        sessionStorage.setItem('pendingInviteId', inviteId);
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error('Falha ao rejeitar convite.');
      navigate('/profile', { replace: true });
    } catch (e) {
      alert(e.message || 'Erro ao rejeitar convite.');
    }
  };

  if (loading) return <div className="auth-container"><p>Carregando...</p></div>;

  return (
    <div className="auth-container">
      {error && <div className="error-message">{error}</div>}
      <h1>Convite para entrar no grupo</h1>
      {invite && (
        <div className="card" style={{ margin: '12px 0' }}>
          <div><strong>Grupo:</strong> {invite.groupName ?? invite.grupoNome ?? 'Grupo'}</div>
          {invite.inviterName && <div><strong>Por:</strong> {invite.inviterName}</div>}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="button" onClick={accept}>Aceitar</button>
        <button className="button outlined" onClick={decline}>Recusar</button>
      </div>
    </div>
  );
}
