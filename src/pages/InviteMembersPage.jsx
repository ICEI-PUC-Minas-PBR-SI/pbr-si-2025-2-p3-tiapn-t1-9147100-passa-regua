// src/pages/CreateGroupPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Suportar groupId vindo por state ou por querystring (?id=)
  const state = location.state || {};
  const qs = new URLSearchParams(location.search);
  const groupIdFromQS = qs.get("id") ? Number(qs.get("id")) : null;
  const groupId = state.groupId ?? groupIdFromQS ?? null;

  const isEdit = useMemo(() => Number.isFinite(groupId), [groupId]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [cover, setCover] = useState(null);
  const [inviteText, setInviteText] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  // Carrega dados do grupo quando estiver em modo edição
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!isEdit) return;
      setErr("");
      try {
        const res = await fetch(`/api/groups/${groupId}`, {
          credentials: "include",
        });
        if (res.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (!res.ok) throw new Error("Falha ao carregar grupo.");
        const g = await res.json();
        if (cancelled) return;
        setName(g.name ?? g.nome ?? "");
        setDescription(g.description ?? "");
        // se tiver campo de imagem no futuro, faça o prefill aqui
      } catch (e) {
        if (!cancelled) setErr(e.message || "Erro ao carregar grupo.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [isEdit, groupId, navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    if (!name.trim()) {
      setErr("Informe o nome do grupo.");
      return;
    }
    setSaving(true);
    try {
      // payload básico (sem upload real de imagem por enquanto)
      const payload = {
        name: name.trim(),
        description: description.trim(),
        // se for implementar upload, guarde a URL/arquivo depois
      };

      if (isEdit) {
        const res = await fetch(`/api/groups/${groupId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (res.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Não foi possível alterar o grupo.");
        }
        // ok -> volta ao perfil
        navigate("/profile", { replace: true });
      } else {
        // criação
        const res = await fetch("/api/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (res.status === 401) {
          navigate("/login", { replace: true });
          return;
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Não foi possível criar o grupo.");
        }
        const created = await res.json().catch(() => ({}));

        // salva rascunho (opcional) e segue para convites
        const draft = {
          name: payload.name,
          description: payload.description,
          coverName: cover?.name || null,
          invitePreset: inviteText.trim() || null,
          id: created?.id,
        };
        sessionStorage.setItem("groupDraft", JSON.stringify(draft));
        navigate("/invite-members", { state: { draft } });
      }
    } catch (e) {
      setErr(e.message || "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  function handleInviteShortcut(e) {
    e.preventDefault();
    // Atalho para pular direto para convites (apenas em criação)
    if (isEdit) return; // em edição não faz sentido
    const draft = {
      name: name.trim(),
      description: description.trim(),
      coverName: cover?.name || null,
      invitePreset: inviteText.trim() || null,
    };
    sessionStorage.setItem("groupDraft", JSON.stringify(draft));
    navigate("/invite-members", { state: { draft } });
  }

  function goBack() {
    if (isEdit) {
      navigate("/profile");
    } else {
      navigate("/profile"); // ou -1 se preferir
    }
  }

  return (
    <div className="auth-container">
      <div className="section-bar flush">
        <button
          type="button"
          className="icon-btn"
          aria-label="Voltar"
          onClick={goBack}
        >
          ←
        </button>
        <div className="section-title">
          {isEdit ? "Editar grupo" : "Novo Grupo"}
        </div>
        <div style={{ width: 34 }} />
      </div>

      {err && <div className="error-message">{err}</div>}

      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <label>Nome do Grupo</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex.: Viagem a Capitólio"
          />
        </div>

        <div className="input-field">
          <label>Descrição</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Opcional"
          />
        </div>

        {/* Imagem (place-holder). Mantemos aqui para não quebrar seu layout */}
        {!isEdit && (
          <>
            <div className="input-field">
              <label>Imagem de capa</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files?.[0] || null)}
              />
            </div>

            <div className="input-field">
              <label>Convidar participantes</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={inviteText}
                  onChange={(e) => setInviteText(e.target.value)}
                  placeholder="Digite nome, e-mail, @usuário…"
                />
                <button
                  type="button"
                  className="button"
                  style={{ width: "auto", padding: "0 14px" }}
                  title="Adicionar / Ir para convites"
                  onClick={handleInviteShortcut}
                >
                  +
                </button>
              </div>
              <div className="small-link" style={{ textAlign: "left" }}>
                <button
                  type="button"
                  className="linklike"
                  onClick={handleInviteShortcut}
                  style={{ padding: 0 }}
                >
                  Convidar por link
                </button>
              </div>
            </div>
          </>
        )}

        <button className="button" type="submit" disabled={saving}>
          {saving ? (isEdit ? "Salvando…" : "Criando…") : isEdit ? "Salvar" : "Criar grupo"}
        </button>
      </form>
    </div>
  );
}
