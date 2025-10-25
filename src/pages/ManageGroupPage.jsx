import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const initialMembers = [
  { id: 1, name: 'Ana',  balance: -50, isAdmin: true },
  { id: 2, name: 'João', balance: -30, isAdmin: false },
  { id: 3, name: 'Maria',balance:  90, isAdmin: false },
];

const initialExpenses = [
  { id: 1, title: 'Desp 1', amount: 55, liked: false },
  { id: 2, title: 'Desp 2', amount: 56, liked: false },
];

/* Ícone de joinha (preenchido quando filled=true) */
function LikeIcon({ filled = false }) {
  const fill = filled ? '#f0b90b' : 'transparent';
  const stroke = '#f0b90b';
  return (
    <svg className="like-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 21h4V9H2v12Zm19.77-10.43A3 3 0 0 0 19 9h-5.31l.72-3.39.03-.34a2 2 0 0 0-.59-1.42L12.17 3 7.59 7.59A2 2 0 0 0 7 9v10a2 2 0 0 0 2 2h7.36a3 3 0 0 0 2.72-1.78l2.54-5.8a3 3 0 0 0 .15-2.85Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default function ManageGroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [members, setMembers]   = useState(initialMembers);
  const [expenses, setExpenses] = useState(initialExpenses);

  const [openMenuFor, setOpenMenuFor] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuFor(null);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // membros
  const toggleAdmin = (mid) =>
    setMembers(prev => prev.map(m => (m.id === mid ? { ...m, isAdmin: !m.isAdmin } : m)));
  const removeMember = (mid) =>
    setMembers(prev => prev.filter(m => m.id !== mid));
  const addMember = () => {
    const name = prompt('Nome do novo membro:');
    if (!name) return;
    setMembers(prev => [...prev, { id: Date.now(), name, balance: 0, isAdmin: false }]);
  };

  // despesas
  const addExpense = () => {
    const title = prompt('Descrição da despesa:');
    const raw = prompt('Valor (R$):');
    const amount = Number(String(raw || '').replace(',', '.'));
    if (!title || isNaN(amount)) return;
    setExpenses(prev => [...prev, { id: Date.now(), title, amount, liked: false }]);
  };
  const toggleLike = (eid) =>
    setExpenses(prev => prev.map(e => (e.id === eid ? { ...e, liked: !e.liked } : e)));

  return (
    <div
      className="auth-container"
      style={{
        position: 'relative',
        minHeight: '78vh',        // sobra espaço no fim
        paddingBottom: '2.5rem'
      }}
    >
      {/* Faixa cinza: seta + título + + */}
      <div className="section-bar flush">
        <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Voltar">←</button>
        <div className="section-title">Membros</div>
        <button className="icon-btn" onClick={addMember} title="Adicionar membro">+</button>
      </div>

      {/* Lista de membros */}
      <div>
        {members.map(m => (
          <div key={m.id} className="row line" style={{ alignItems: 'center', position: 'relative' }}>
            <div className="avatar" aria-hidden />
            <div style={{ flex: 1 }}>
              <strong>{m.name}</strong>
              {m.isAdmin && <span className="badge-admin"> ADM</span>}
            </div>

            <div
              style={{
                minWidth: 120,
                textAlign: 'right',
                color: m.balance < 0 ? '#d32f2f' : '#2e7d32',
                fontWeight: 700
              }}
            >
              {m.balance < 0 ? `R$ -${(-m.balance).toFixed(2)}` : `R$ ${m.balance.toFixed(2)}`}
            </div>

            <button
              className="icon-btn"
              onClick={() => setOpenMenuFor(prev => (prev === m.id ? null : m.id))}
              aria-haspopup="menu"
              aria-expanded={openMenuFor === m.id}
              title="Menu"
              style={{ marginLeft: 8 }}
            >
              ≡
            </button>

            {openMenuFor === m.id && (
              <div className="floating-menu" ref={menuRef} role="menu">
                <div className="menu-title">Membros</div>
                <button className="menu-item" onClick={() => { removeMember(m.id); setOpenMenuFor(null); }}>
                  Excluir (adm)
                </button>
                <button className="menu-item" onClick={() => { toggleAdmin(m.id); setOpenMenuFor(null); }}>
                  {m.isAdmin ? 'Remover adm. (adm)' : 'Definir como adm. (adm)'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Faixa cinza: Despesas + + */}
      <div className="section-bar flush" style={{ marginTop: 14 }}>
        <span className="section-title">Despesas</span>
        <button className="icon-btn" onClick={addExpense} title="Nova despesa">+</button>
      </div>

      {/* Lista de despesas */}
      <div>
        {expenses.map(e => (
          <div key={e.id} className="row line" style={{ alignItems: 'center' }}>
            <div style={{ flex: 1 }}>{e.title}</div>

            {/* valor negativo (wireframe) */}
            <div style={{ minWidth: 120, textAlign: 'right', color: '#d32f2f', fontWeight: 700 }}>
              R$ -{e.amount.toFixed(2)}
            </div>

            {/* joinha preenchível (sem quadrado) */}
            <button
              className="icon-ghost"
              onClick={() => toggleLike(e.id)}
              aria-pressed={e.liked}
              title={e.liked ? 'Desmarcar' : 'Curtir'}
              style={{ marginLeft: 8 }}
            >
              <LikeIcon filled={e.liked} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
