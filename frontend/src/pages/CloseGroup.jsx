import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { despesasModule } from '../services/despesasService';
import Avatar from '../components/Avatar.jsx';
import Header, { Icon } from '../components/Header.jsx';

export default function CloseGroup() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state || {};
  const qs = new URLSearchParams(location.search);
  const groupIdFromQS = qs.get('id') ? Number(qs.get('id')) : null;
  const groupId = params.id ? Number(params.id) : (state.groupId ?? groupIdFromQS ?? null);

  const { expenses, passarRegua } = despesasModule(() => null, () => null, groupId);

  const [fechamento, setFechamento] = useState([]);

  useEffect(() => {
    (async () => {
      if (expenses?.length > 0) {
        const resultado = await passarRegua();
        console.log(resultado);
        setFechamento(resultado);
      }
    })();
  }, [expenses]);

  function capitalizeName(name) {
    if (!name || typeof name !== 'string') return '';
  
    return name
      .trim()
      .toLowerCase()
      .replace(/^./, char => char.toUpperCase());
  }

  function safeBack() {
    navigate('/manage-group?id=' + groupId);
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
      title={'Ainda existem pendências financeiras. Deseja continuar?'}
      onBack={safeBack}
    />


        <h1></h1>

      {fechamento?.map((m, index) => (
        <div key={m.id} className="row line" style={{ alignItems: 'center', position: 'relative', marginBottom: '10px' }}>
          <div style={{ 
            minWidth: '30px', 
            textAlign: 'center', 
            fontSize: '14px', 
            color: '#666',
            marginRight: '10px',
            fontWeight: 'bold'
          }}>
            {index + 1}
          </div>
          
          <Avatar name={capitalizeName(m.nomeDevedor)} email={capitalizeName(m.nomeDevedor)} />
          
          <div
            style={{
              minWidth: 120,
              textAlign: 'right',
              color: m.balance < 0 ? '#d32f2f' : '#2e7d32',
              fontWeight: 700,
              marginRight: "10px"
            }}
          >
            {m.frase}
          </div>

          <Avatar name={capitalizeName(m.nomeCredor)} email={capitalizeName(m.nomeCredor)} />
        </div>
      ))}

      {fechamento?.length > 0 && (
        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            style={{
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#b71c1c'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#d32f2f'}
            onClick={() => {
              // Aqui você pode adicionar a lógica para continuar mesmo assim
              console.log('Continuando mesmo com pendências...');
              // navigate('/alguma-rota'); // exemplo de navegação
            }}
          >
            Continuar Mesmo Assim
          </button>
        </div>
      )}
    </div>
  );
}
