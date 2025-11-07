import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from '../components/Header.jsx';

import { despesasModule } from '../services/despesasService';

export default function IncluirDespesa() {
    
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [anexo, setAnexo] = useState(null);
  const navigate = useNavigate();
  const params = useParams();

  const { addExpense } = despesasModule(null, null);

  const handleFileChange = (e) => {
    setAnexo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Despesa incluída:\n${descricao} - R$ ${valor}`);
    addExpense(descricao, valor);
  };

  
  function safeBack() {
    navigate('/manage-group?id=' + params.id);
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

        <Header
        title={'Incluir despesa'}
        onBack={safeBack}
        />

      <form className="incluir-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Exemplo: Almoço em Itaparica, Passeio de Balsa"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Valor"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          required
        />

        <div className="file-actions">
          <label className="btn-file">
            📎 Anexar
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              hidden
            />
          </label>

          <button
            type="button"
            className="btn-file"
            onClick={() => alert("Função de câmera não implementada")}
          >
            📷 Tirar foto
          </button>
        </div>

        <button type="submit" className="btn-submit">
          Incluir
        </button>

        {
          anexo && <>
          <h1>Item Anexado</h1>
        {
          anexo.name
        }
          </>
        }
        
      </form>
    
    </div>
  );
}
