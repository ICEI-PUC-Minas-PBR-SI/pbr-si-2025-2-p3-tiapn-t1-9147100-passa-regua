const baseRequest = async (navigate: any, request: any) => {
    const res = await request(); 
    if (res.status === 401) {
        navigate("/login", { replace: true });
        return;
      }
    if (!res.ok) throw new Error("Falha ao carregar o grupo.");
    return  await res.json();
}

export const listarDespesasPorGrupo = async (navigate: any, grupo: any) => {
    return baseRequest(navigate, fetch.bind(this, "/api/despesas/grupo/" + grupo, { method: 'GET', credentials: 'include' }));
}

export const addDespesaPorGrupo = (idGrupo: any, valor: any, descricao: any) => {
    const idCriador = localStorage.getItem('auth_token');
    return fetch("/api/despesas", { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idGrupo, idCriador, valor, descricao }) });
}