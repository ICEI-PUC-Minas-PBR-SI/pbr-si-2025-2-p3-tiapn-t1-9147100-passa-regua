import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Avatar from '../components/Avatar.jsx';
import Header, { Icon } from '../components/Header.jsx';
import { despesasModule } from '../services/despesasService';


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
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  function safeBack() {
    navigate('/profile');
  }

  // Resolve groupId: param -> state -> querystring (?id=)
  const state = location.state || {};
  const qs = new URLSearchParams(location.search);
  const groupIdFromQS = qs.get('id') ? Number(qs.get('id')) : null;
  const groupId = params.id ? Number(params.id) : (state.groupId ?? groupIdFromQS ?? null);

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [members, setMembers]   = useState([]);
  const { expenses, toggleLike, addExpense } = despesasModule(setLoading, setError, groupId, members);

  const [openMenuFor, setOpenMenuFor] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenuFor(null);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Load group details
  useEffect(() => {
    let alive = true;
    async function load() {
      if (!groupId) {
        setLoading(false);
        setError('Grupo nao informado.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/groups/${groupId}`, { credentials: 'include' });
        if (res.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        if (!res.ok) throw new Error('Falha ao carregar o grupo.');
        const data = await res.json();
        if (!alive) return;
        setGroup(data);
      } catch (e) {
        if (alive) setError(e.message || 'Erro ao carregar o grupo.');
      } finally {
        if (alive) setLoading(false);
      }
    }
    load();
    return () => { alive = false; };
  }, [groupId, navigate]);

  // Carrega membros reais do grupo
  useEffect(() => {
    let alive = true;

    async function loadMembers() {
      if (!groupId) return;
      try {
        const res = await fetch(`/api/groups/${groupId}/members`, { credentials: 'include' });
        if (!alive) return;
        if (res.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        if (res.ok) {
          const list = await res.json();
          const norm = (Array.isArray(list) ? list : []).map(m => ({
            id: m.email || String(Math.random()),
            name: m.name || m.email || 'Membro',
            email: m.email,
            role: m.role,
            isAdmin: String(m.role || '').toUpperCase() === 'OWNER' || String(m.role || '').toUpperCase() === 'ADMIN',
            balance: 0,
          }));
          setMembers(norm);
        } else {
          setMembers([]);
        }
      } catch {
        if (!alive) return;
        setMembers([]);
      }
    }
    loadMembers();
    return () => { alive = false; };
  }, [groupId, navigate]);

  // membros - backend
  const toggleAdmin = async (memberIdOrEmail) => {
    const target = members.find(x => x.id === memberIdOrEmail || x.email === memberIdOrEmail);
    if (!target || !groupId) return;
    const email = target.email || target.id;
    const current = String(target.role || '').toUpperCase();
    const newRole = current === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    try {
      const res = await fetch(`/api/groups/${groupId}/members/${encodeURIComponent(email)}/role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: newRole }),
      });
      if (res.status === 401) { navigate('/login', { replace: true }); return; }
      if (!res.ok) throw new Error('Falha ao atualizar papel do membro');
      setMembers(prev => prev.map(m => ( (m.email===email || m.id===email) ? { ...m, role: newRole, isAdmin: newRole==='ADMIN' || newRole==='OWNER' } : m)));
    } catch (e) {
      alert(e.message || 'Erro ao atualizar membro');
    }
  };
  const removeMember = async (memberIdOrEmail) => {
    const target = members.find(x => x.id === memberIdOrEmail || x.email === memberIdOrEmail);
    if (!target || !groupId) return;
    const email = target.email || target.id;
    if (!window.confirm(`Remover ${target.name || email} do grupo?`)) return;
    try {
      const res = await fetch(`/api/groups/${groupId}/members/${encodeURIComponent(email)}`, { method: 'DELETE', credentials: 'include' });
      if (res.status === 401) { navigate('/login', { replace: true }); return; }
      if (!(res.ok || res.status === 204)) throw new Error('Falha ao remover membro');
      setMembers(prev => prev.filter(m => !(m.email===email || m.id===email)));
    } catch (e) {
      alert(e.message || 'Erro ao remover membro');
    }
  };
  const addMember = () => {
    if (!groupId) return;
    navigate(`/invite-members?id=${groupId}`, { state: { groupId } });
  };



  if (loading) {
    return (
      <div className="auth-container">
        {/* Cabeçalho durante carregamento */}
        <Header title="Carregando grupo" onBack={safeBack} />
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className="auth-container"
      style={{
        position: 'relative',
        minHeight: '78vh',        // sobra espaço no fim
        paddingBottom: '2.5rem'
      }}
    >
      {/* Cabeçalho com voltar e editar */}
      <Header
        title={group?.name || 'Grupo'}
        onBack={safeBack}
        onEdit={() => navigate(`/groups/${groupId}/edit`)}
      />

      {/* Faixa cinza: seta + título + + */}
      <div className="section-bar flush">
        <div className="section-title">Membros</div>
        <button className="icon-btn" onClick={addMember} title="Adicionar membro">
          <Icon type="plus" />
        </button>
      </div>

      {/* Lista de membros */}
      <div>
        {members.map(m => (
          <div key={m.id} className="row line" style={{ alignItems: 'center', position: 'relative' }}>
            <Avatar name={m.name} email={m.email} />
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
              style={{ fontSize: 20, lineHeight: 1 }}
            >
              ≡
            </button>

            {openMenuFor === m.id && (
              <div className="floating-menu" ref={menuRef} role="menu">
                <div className="menu-title">Membros</div>
                <button className="menu-item" onClick={() => { removeMember(m.id); setOpenMenuFor(null); }}>
                  Excluir
                </button>
                <button className="menu-item" onClick={() => { toggleAdmin(m.id); setOpenMenuFor(null); }}>
                  {String(m.role||'').toUpperCase()==='ADMIN' ? 'Remover adm.' : 'Definir como adm.'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Faixa cinza: Despesas + + */}
      <div className="section-bar flush" style={{ marginTop: 14 }}>
        <span className="section-title">Despesas</span>
        <button className="icon-btn" onClick={() => navigate('/incluir-despesa/' + groupId, { replace: true }) } title="Nova despesa">
          <Icon type="plus" />
        </button>
      </div>

      {/* Lista de despesas */}
      <div>
        {expenses && expenses.map(e => (
          <div key={e.id} className="row line" style={{ alignItems: 'center' }}>
            <div style={{ flex: 1 }}>{e.descricao}</div>

            {/* valor negativo (wireframe) */}
            <div style={{ minWidth: 120, textAlign: 'right', color: '#d32f2f', fontWeight: 700 }}>
              R$ -{e.valor.toFixed(2)}
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

      <button className="button mt-auto">Passar Régua</button>
    </div>
  );
}




