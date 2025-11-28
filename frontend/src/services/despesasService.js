import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { addDespesaPorGrupo, listarDespesasPorGrupo, loadMembers } from "../repository/despesasRepository";

export const despesasModule = (setLoading = () => null, setError = () => null, groupIdOuter) => {
  const [groupId, setGroupId] = useState(groupIdOuter);
  const [expenses, setExpenses] = useState([]);

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();

  // Garante groupId
  useEffect(() => {
    if (!groupId && params.id) {
      setGroupId(params.id);
    }
  }, [params.id, groupId]);

  function formatarNomeCompleto(nome) {
    if (!nome || typeof nome !== 'string') return '';

    return nome
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
      .join(' ');
  }

  // Carrega despesas somente quando groupId existir
  useEffect(() => {
    if (groupId) {
      load();
    }
  }, [groupId]);

  const load = async () => {
    setLoading(true);
    try {
      const dividas = await listarDespesasPorGrupo(navigate, groupId);
      setExpenses(dividas);
    } catch (e) {
      setError(e.message || "Erro ao carregar o grupo.");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (eid) =>
    setExpenses((prev) =>
      prev.map((e) => (e.id === eid ? { ...e, liked: !e.liked } : e))
    );


  const addExpense = async (descricao, valor) => {
    const members = await loadMembers(navigate, groupId || params.id);
    await addDespesaPorGrupo(groupId || params.id, valor, descricao, members);
    navigate(`/manage-group?id=${groupId || params.id}`)
  };



  const passarRegua = async () => {
    const members = await loadMembers(navigate, groupId || params.id);
    const resultMap = new Map();

    members.forEach(member => {
      resultMap.set(member.name, -1);
    });

    expenses.forEach(expense => {
      const member = members.find(m => m.id === expense.idCriador);
      if (!member) return;

      const nome = member.name;

      resultMap.set(
        nome,
        (resultMap.get(nome) ?? -1) + expense.valor
      );
    });

    const data = Array.from(resultMap.entries()).map(
      ([nome, gastos]) => ({ nome, gastos })
    );

    const total = data.reduce((acc, p) => acc + p.gastos, 0);
    const media = total / data.length;

    const pessoas = data.map(p => ({
      ...p,
      diferenca: p.gastos - media
    }));

    const devedores = pessoas.filter(p => p.diferenca < 0);
    const credores = pessoas.filter(p => p.diferenca > 0);

    const transferencias = [];

    for (let devedor of devedores) {
      for (let credor of credores) {
        if (devedor.diferenca === 0) break;
        if (credor.diferenca === 0) continue;

        const valor = Math.min(
          Math.abs(devedor.diferenca),
          credor.diferenca
        );

        transferencias.push({
          frase: `${formatarNomeCompleto(devedor.nome)} deve R$${valor.toFixed(2)} para ${formatarNomeCompleto(credor.nome)}`,
          nomeDevedor: devedor.nome,
          nomeCredor: credor.nome
        }
        );

        devedor.diferenca += valor;
        credor.diferenca -= valor;
      }
    }

    console.log("Transferências:", transferencias);
    return transferencias;
  };


  return {
    expenses,
    toggleLike,
    addExpense,
    passarRegua
  };
};
