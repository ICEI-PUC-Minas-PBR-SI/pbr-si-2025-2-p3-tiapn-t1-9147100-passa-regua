## 7. Conclusão

> <span style="color:red">**Pré-requisitos:**</span> [Interface do Sistema](6-Interface-Sistema.md)

O desenvolvimento do **Passa Régua** atendeu ao objetivo de automatizar a divisão de despesas em viagens e eventos, eliminando planilhas improvisadas e reduzindo conflitos nas interações em grupo. A partir da modelagem de personas e das histórias de usuários, foi possível criar uma solução que oferece transparência, segurança e gamificação.

Processos antes manuais foram substituídos por funcionalidades claras:
* Cadastro com autenticação de dois fatores;
* Criação e gerenciamento de grupos e convites controlados;
* Registro de despesas com anexos;
* Cálculo automático do rateio e notificações em tempo real.

Essas melhorias resultam em redução de erros, economia de tempo e maior conforto para perfis distintos (organizadores, esquecidos, controlados, pais e poupadores).

A arquitetura moderna (**React, Spring Boot, MySQL e AWS**) garante escalabilidade e resposta rápida, enquanto a interface responsiva democratiza o acesso em qualquer dispositivo. O modelo de dados relacional dá suporte à rastreabilidade e integridade das informações, atendendo aos requisitos funcionais e não funcionais definidos. Relatórios e a visualização de saldos individuais e coletivos oferecem controle financeiro contínuo aos participantes, e os elementos de gamificação tornam a experiência mais lúdica, incentivando o comportamento colaborativo.

### Limitações

Apesar de robusto, o sistema apresenta algumas limitações:
1.  **Pagamentos:** Ainda não há integração direta com meios de pagamento ou carteiras digitais, obrigando os acertos finais a ocorrerem fora da plataforma.
2.  **Gamificação:** Devido a restrições de cronograma e à disponibilidade da equipe, este recurso não foi implementado na versão atual, sendo priorizados os requisitos essenciais.
3.  **Conectividade:** Como o sistema depende de conectividade contínua, o uso pode ser limitado em locais com acesso precário à internet.
4.  **Personalização:** A personalização de categorias de despesas e o suporte multilíngue são pontos de melhoria.


### Sugestões de novas linhas de estudo

Para evoluir a plataforma, recomenda-se:
* **Integração Financeira:** Investigar gateways de pagamento e PIX para permitir quitações dentro do Passa Régua.
* **Inteligência Artificial:** Incorporar IA para sugerir categorias, identificar padrões e propor otimizações no rateio.
* **Mobile e Internacionalização:** Expansão para apps nativos (Android/iOS) e suporte a outros idiomas.
* **Gamificação Avançada:** Implementação de badges, desafios, metas personalizadas e módulos de educação financeira.
* **API e Dashboards:** Abertura de APIs para integração com agendas/eventos e criação de dashboards analíticos estratégicos.

---

### Indicadores propostos

A seguir são apresentados dois indicadores a serem monitorados pela equipe para acompanhar a adoção da plataforma e o perfil dos usuários.

#### Indicador 1 — Crescimento mensal de usuários

* **Nome:** Taxa de novos cadastros mensais.
* **Objetivo:** Avaliar a expansão da base de usuários e verificar se a meta de crescimento está sendo atingida.
* **Unidade de medida:** Número de cadastros por mês / Percentual da meta.
* **Periodicidade de cálculo:** Mensal.
* **Responsável:** Equipe de Marketing/Produto.
* **Fórmula de cálculo:**
    $$\frac{\text{nº de usuários cadastrados no mês}}{\text{meta de cadastros}} \times 100$$
* **Intervalo de validade:** Revisão anual das metas de crescimento.
* **Variáveis:** Data de criação do usuário (`created_at`), total de cadastros no período.
* **Captura das variáveis:** Consultas ao banco de dados MySQL (tabela `usuarios`) filtrando pelo mês de cadastro.
* **Usuários do indicador:** Gestores de produto, direção da empresa e equipe de marketing.

#### Indicador 2 — Distribuição etária dos usuários

* **Nome:** Distribuição etária.
* **Objetivo:** Conhecer o perfil etário predominante para direcionar funcionalidades, campanhas e atrair faixas etárias sub-representadas.
* **Unidade de medida:** Percentual de usuários em cada faixa etária.
* **Periodicidade de cálculo:** Trimestral.
* **Responsável:** Equipe de Análise de Dados/Produto.
* **Fórmula de cálculo:**
    $$\frac{\text{nº de usuários na faixa etária}}{\text{total de usuários}} \times 100$$
* **Intervalo de validade:** Revisão anual das faixas de idade e da metodologia de cálculo.
* **Variáveis:** Idade (`usuarios.idade`), total de usuários.
* **Captura das variáveis:** Extração do campo de idade na tabela `usuarios` e classificação nas faixas (ex: 18–25, 26–35, 36–45, >45).
* **Usuários do indicador:** Equipe de design, marketing e gestores de produto.

Esses indicadores ajudarão a monitorar o impacto da solução e sustentar decisões estratégicas quanto ao crescimento e à customização de funcionalidades com base no perfil dos usuários.
