// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// Substituímos CloseButton por um cabeçalho unificado
import Header, { Icon } from "../components/Header.jsx";
import Avatar from "../components/Avatar.jsx";

/** Endpoints da API (ajuste se seu backend usar outros caminhos) */
const API = {
  me: "/api/auth/me",                 // se o seu for /api/usuarios/me, troque aqui
  myGroups: "/api/groups/mine",       // se não existir ainda, tratamos 404 sem quebrar
  leave: (id) => `/api/groups/${id}/leave`,
  remove: (id) => `/api/groups/${id}`,
};

function Tooltip({ text, children }) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "100%",
            transform: "translateY(-50%)",
            marginLeft: "8px",
            padding: "4px 8px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: "4px",
            whiteSpace: "nowrap",
            zIndex: 10,
            fontSize: "12px",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

function GroupActionsMenu({ group, onOpen, onInvite, onEdit, onDelete, onLeave }) {
  const [open, setOpen] = useState(false);
  const isOwner = group?.owner || group?.role === "OWNER";

  function choose(action) {
    setOpen(false);
    action && action();
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className="icon-btn"
        aria-label="Menu do grupo"
        onClick={() => setOpen((v) => !v)}
        title="Mais opções"
      >
        <span style={{ fontSize: 20, lineHeight: 1 }}>≡</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '100%',
            marginTop: 8,
            minWidth: 220,
            background: '#fff',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
            borderRadius: 8,
            padding: 8,
            zIndex: 20,
          }}
        >
          <button className="button text" style={{ width: '100%', textAlign: 'left' }} onClick={() => choose(onOpen)}>Abrir grupo</button>
          <button className="button text" style={{ width: '100%', textAlign: 'left' }} onClick={() => choose(onInvite)}>Convidar membros</button>
          <button className="button text" style={{ width: '100%', textAlign: 'left' }} onClick={() => choose(onEdit)}>Editar grupo</button>
          {isOwner ? (
            <button className="button text" style={{ width: '100%', textAlign: 'left' }} onClick={() => choose(onDelete)}>Excluir grupo</button>
          ) : (
            <button className="button text" style={{ width: '100%', textAlign: 'left' }} onClick={() => choose(onLeave)}>Sair do grupo</button>
          )}
          <div style={{ height: 8 }} />
          {isOwner && (
            <button
              className="button text"
              style={{ width: '100%', textAlign: 'left', opacity: 0.9 }}
              onClick={() => { setOpen(false); alert('Não implementado'); }}
            >
              Fazer fechamento — Não implementado
            </button>
          )}
          <button
            className="button text"
            style={{ width: '100%', textAlign: 'left', opacity: 0.9 }}
            onClick={() => { setOpen(false); alert('Não implementado'); }}
          >
            Visualizar fechamento — Não implementado
          </button>
        </div>
      )}
    </div>
  );
}

function useAuthHeaders() {
  // Se você vier a usar JWT no futuro, isso já deixa pronto.
  const token = localStorage.getItem("auth_token");
  return useMemo(
    () =>
      token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" },
    [token]
  );
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const headers = useAuthHeaders();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErr("");
      try {
        // 1) Perfil (obrigatório): precisa do cookie JSESSIONID -> credentials: 'include'
        const meRes = await fetch(API.me, { headers, credentials: "include" });
        if (meRes.status === 401) {
          // Sessão inexistente/expirada -> volta pro login
          navigate("/login", { replace: true });
          return;
        }
        if (!meRes.ok) throw new Error("Falha ao carregar o perfil.");

        const me = await meRes.json();

        // 2) Grupos (opcional enquanto a rota não existir)
        let gs = [];
        try {
          const groupsRes = await fetch(API.myGroups, { headers, credentials: "include" });
          if (groupsRes.ok) {
            const data = await groupsRes.json();
            gs = Array.isArray(data) ? data : data?.content ?? [];
          } else if (groupsRes.status !== 404) {
            // 404 = rota ainda não existe, ignoramos
            throw new Error("Falha ao carregar os grupos.");
          }
        } catch (gerr) {
          // Ignora 404 silenciosamente; loga outros erros no console
          console.warn("Erro ao buscar grupos:", gerr);
        }

        // 3) Notificações para o badge do sino
        let unread = 0;
        try {
          const nRes = await fetch('/api/notifications', { headers, credentials: 'include' });
          if (nRes.ok) {
            const list = await nRes.json();
            unread = (Array.isArray(list) ? list : []).filter(n => !n.readAt).length;
          }
        } catch {}

        if (!mounted) return;
        setUser(me);
        setGroups(gs);
        setUnreadCount(unread);
      } catch (e) {
        if (!mounted) return;
        setErr(e.message || "Erro ao carregar dados.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [headers, navigate]);

  /** Helper para chamadas autenticadas com cookie */
  async function call(method, url) {
    return fetch(url, { method, headers, credentials: "include" });
  }

  function handleClose() {
    // Confirma se o usuário realmente deseja sair; ao confirmar volta para o login
    if (window.confirm("Deseja sair do perfil e voltar para a tela de login?")) {
      navigate("/login", { replace: true });
    }
  }

  async function handleLeave(groupId) {
    if (!window.confirm("Sair deste grupo?")) return;
    try {
      const res = await call("POST", API.leave(groupId));
      if (!res.ok) throw new Error("Não foi possível sair do grupo.");
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (e) {
      alert(e.message);
    }
  }

  async function handleDelete(groupId) {
    if (!window.confirm("Excluir o grupo? Essa ação não pode ser desfeita.")) return;
    try {
      const res = await call("DELETE", API.remove(groupId));
      if (!res.ok) throw new Error("Não foi possível excluir o grupo.");
      setGroups((prev) => prev.filter((g) => g.id !== groupId));
    } catch (e) {
      alert(e.message);
    }
  }

  function openGroup(group) {
    navigate(`/manage-group?id=${group.id}`, { state: { groupId: group.id } });
  }
  function invite(group) {
    navigate(`/invite-members?id=${group.id}`, { state: { groupId: group.id } });
  }
  function edit(group) {
    // 👉 agora vai direto para a página de edição
    navigate(`/groups/${group.id}/edit`);
  }

  if (loading) {
    return (
      <div className="auth-container" style={{ position: "relative" }}>
        {/* Cabeçalho durante o carregamento mostra título e permite sair ou abrir notificações */}
        <Header
          title="Meu Perfil"
          onExit={handleClose}
          onNotification={() => navigate('/notifications')}
          notificationCount={unreadCount}
        />
        <p>Carregando…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="auth-container" style={{ position: "relative" }}>
        <Header
          title="Meu Perfil"
          onExit={handleClose}
          onNotification={() => navigate('/notifications')}
          notificationCount={unreadCount}
        />
        <div className="error-message">{err}</div>
        <button className="button outlined" onClick={() => navigate(0)}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ position: "relative" }}>
      {/* Cabeçalho principal com opções de sair e notificações */}
      <Header
        title="Meu Perfil"
        onExit={handleClose}
        onNotification={() => navigate('/notifications')}
        notificationCount={unreadCount}
      />
      {/* Ações agora estão no menu sanduíche */}

      {user && (
        <div className="card" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>
            {user.firstName
              ? `${user.firstName} ${user.lastName ?? ""}`
              : user.nome ?? user.name ?? "Usuário"}
          </h2>
          <div style={{ opacity: 0.8 }}>{user.email}</div>
        </div>
      )}

      <div
        style={{

          justifyContent: "space-between",
          alignItems: "center",
          margin: "8px 0 4px",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h2 style={{ margin: 0 }}>Meus grupos</h2>
        <div style={{ display:'flex', gap:8 }}>

          <button className="button" onClick={() => navigate("/create-group")}> 
            + Criar grupo
          </button>
        </div>
      </div>

      {groups.length === 0 ? (
        <div className="card">
          <p>Você ainda não participa de nenhum grupo.</p>
          <button className="button" onClick={() => navigate("/create-group")}>
            Criar primeiro grupo
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {groups.map((g) => (
            <div key={g.id} className="card" style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  alignItems: "baseline",
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Avatar name={g.name ?? g.nome ?? 'Grupo'} email={String(g.id || '')} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {g.name ?? g.nome ?? "Grupo"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {g.role ? `Papel: ${g.role}` : g.owner ? "Dono" : "Membro"}
                    {g.membersCount != null ? ` • ${g.membersCount} membros` : null}
                    </div>
                  </div>
                </div>
                {/* Novo layout vertical de ícones com tooltip */}
                <GroupActionsMenu
                  group={g}
                  onOpen={() => openGroup(g)}
                  onInvite={() => invite(g)}
                  onEdit={() => edit(g)}
                  onDelete={() => handleDelete(g.id)}
                  onLeave={() => handleLeave(g.id)}
                />
                {false && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row", // Horizontal
                    gap: 8,
                  }}
                >
                  <Tooltip text="Abrir grupo">
                    <button
                      className="icon-btn"
                      onClick={() => openGroup(g)}
                    >
                      <Icon type="eye" />
                      <span aria-label="Abrir">👁️</span>
                    </button>
                  </Tooltip>
                  <Tooltip text="Convidar membros">
                    <button
                      className="icon-btn icon-btn--primary"
                      onClick={() => invite(g)}
                    >
                      <Icon type="mail" />
                      <span aria-label="Convidar">✉️</span>
                    </button>
                  </Tooltip>
                  <Tooltip text="Editar grupo">
                    <button
                      className="icon-btn"
                      onClick={() => edit(g)}
                    >
                      <Icon type="edit" />
                    </button>
                  </Tooltip>
                  {g.owner || g.role === "OWNER" ? (
                    <Tooltip text="Excluir grupo">
                      <button
                        className="icon-btn"
                        onClick={() => handleDelete(g.id)}
                      >
                        <Icon type="trash" />
                        <span aria-label="Excluir">🗑️</span>
                      </button>
                    </Tooltip>
                  ) : (
                    <Tooltip text="Sair do grupo">
                      <button
                        className="icon-btn"
                        onClick={() => handleLeave(g.id)}
                      >
                        <Icon type="logout" />
                        <span aria-label="Sair">🚶</span>
                      </button>
                    </Tooltip>
                  )}
                </div>
                )}
              </div>
              {g.description && <div style={{ opacity: 0.9 }}>{g.description}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
