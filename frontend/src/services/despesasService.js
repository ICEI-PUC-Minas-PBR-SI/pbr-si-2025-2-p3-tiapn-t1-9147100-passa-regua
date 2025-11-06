import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addDespesaPorGrupo, listarDespesasPorGrupo } from "../repository/despesasRepository";

export const despesasModule = (setLoading = () => null, setError = () => null, groupIdOuter) => {
  const [groupId, setGroupId] = useState(groupIdOuter); 
  
    const location = useLocation();
  const state = location.state || {};
  const params = useParams();
  const navigate = useNavigate();

  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (groupIdOuter)
      setGroupId(params.id);
    load();
  }, [groupId]);

  const toggleLike = (eid) =>
    setExpenses((prev) =>
      prev.map((e) => (e.id === eid ? { ...e, liked: !e.liked } : e))
    );

    
  const addExpense = async (descricao, valor) => {
    await addDespesaPorGrupo(groupId || params.id, valor, descricao);
    navigate(`/manage-group?id=${groupId || params.id}`)
  };

  const load = async () => {
    if (!groupId) {
      setLoading(false);
      setError("Grupo nao informado.");
      return;
    }

    setLoading(true);

    try {
      setExpenses(await listarDespesasPorGrupo(navigate, groupId));
    } catch (e) {
      setError(e.message || "Erro ao carregar o grupo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    expenses,
    toggleLike,
    addExpense
  };
};
