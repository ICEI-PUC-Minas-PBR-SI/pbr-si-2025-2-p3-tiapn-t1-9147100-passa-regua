// src/pages/ProfilePage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CloseButton from "../components/CloseButton";

/** Endpoints da API (ajuste se seu backend usar outros caminhos) */
const API = {
  me: "/api/auth/me",                 // se o seu for /api/usuarios/me, troque aqui
  myGroups: "/api/groups/mine",       // se não existir ainda, tratamos 404 sem quebrar
  leave: (id) => `/api/groups/${id}/leave`,
  remove: (id) => `/api/groups/${id}`,
};

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

        if (!mounted) return;
        setUser(me);
        setGroups(gs);
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
    navigate(`/manage-group`, { state: { groupId: group.id } });
  }
  function invite(group) {
    navigate(`/invite-members`, { state: { groupId: group.id } });
  }
  function edit(group) {
    // 👉 agora vai direto para a página de edição
    navigate(`/groups/${group.id}/edit`);
  }

  if (loading) {
    return (
      <div className="auth-container" style={{ position: "relative" }}>
        <CloseButton onClick={() => navigate("/")} />
        <h1>Meu Perfil</h1>
        <p>Carregando…</p>
      </div>
    );
  }

  if (err) {
    return (
      <div className="auth-container" style={{ position: "relative" }}>
        <CloseButton onClick={() => navigate("/")} />
        <h1>Meu Perfil</h1>
        <div className="error-message">{err}</div>
        <button className="button outlined" onClick={() => navigate(0)}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ position: "relative" }}>
      <CloseButton onClick={() => navigate("/")} />
      <h1>Meu Perfil</h1>

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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "8px 0 4px",
        }}
      >
        <h2 style={{ margin: 0 }}>Meus grupos</h2>
        <button className="button" onClick={() => navigate("/create-group")}>
          + Criar grupo
        </button>
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
                <div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>
                    {g.name ?? g.nome ?? "Grupo"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    {g.role ? `Papel: ${g.role}` : g.owner ? "Dono" : "Membro"}
                    {g.membersCount != null ? ` • ${g.membersCount} membros` : null}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="button" onClick={() => openGroup(g)}>
                    Abrir
                  </button>
                  <button className="button outlined" onClick={() => invite(g)}>
                    Convidar
                  </button>
                  <button className="button outlined" onClick={() => edit(g)}>
                    Editar
                  </button>
                  {g.owner || g.role === "OWNER" ? (
                    <button className="button danger" onClick={() => handleDelete(g.id)}>
                      Excluir
                    </button>
                  ) : (
                    <button className="button danger" onClick={() => handleLeave(g.id)}>
                      Sair
                    </button>
                  )}
                </div>
              </div>
              {g.description && <div style={{ opacity: 0.9 }}>{g.description}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
