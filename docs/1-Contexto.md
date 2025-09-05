# 1. Introdução

A administração de finanças coletivas em viagens e eventos em grupo é, muitas vezes, um desafio prático e social que gera desconfortos, mal-entendidos e até conflitos. Este trabalho propõe o desenvolvimento de um sistema digital que automatiza o gerenciamento de despesas compartilhadas, oferecendo uma solução moderna e eficiente para promover a transparência e o equilíbrio financeiro entre participantes de grupos sociais, como amigos e familiares em viagens.

## 1.1 Contextualização

Com o crescimento da economia colaborativa e o aumento da conectividade entre pessoas por meio de dispositivos móveis, novas formas de organizar a vida em grupo têm ganhado espaço. Aplicativos como Splitwise e Tricount já se destacam por facilitar a divisão de despesas, mas ainda carecem de abordagens mais contextualizadas para públicos brasileiros ou com recursos mais completos, como a gamificação.

Nesse cenário, percebe-se a demanda por soluções que não apenas organizem as finanças, mas que também engajem os usuários com experiências mais lúdicas e acessíveis. A proposta deste trabalho se insere nesse contexto, com foco na construção de uma carteira digital colaborativa e gamificada para grupos de viagem e eventos informais.

## 1.2 Problema

A ausência de controle automatizado de despesas compartilhadas em grupos de viagem frequentemente resulta em desequilíbrios financeiros, atrasos em pagamentos, falta de clareza sobre quem deve quanto e desconfortos interpessoais.

A divisão de contas feita manualmente ou via planilhas improvisadas é suscetível a erros, omissões e subjetividades — agravadas quando há diferentes níveis de consumo entre os membros (como crianças ou pessoas que não participam de todas as atividades). Essa realidade demonstra a necessidade de uma ferramenta específica, intuitiva e justa para gerenciar gastos em grupo.

## 1.3 Objetivo Geral

Desenvolver um sistema digital de gerenciamento financeiro para grupos de viagem, que permita o controle de despesas, divisão proporcional de valores entre participantes e cálculo automático de acertos finais, utilizando também gamificação para promover engajamento e comportamento financeiro saudável.

### 1.3.1 Objetivos Específicos

- Implementar um sistema de medalhas baseado no comportamento financeiro dos usuários (ex: pagamento pontual, gastos acumulados, contribuição generosa);
- Oferecer uma visualização clara da carteira individual e do saldo coletivo do grupo;
- Automatizar o cálculo do acerto final entre os membros, indicando quem deve pagar para quem.

## 1.4 Justificativa

A proposta justifica-se pela necessidade de melhorar a experiência social e financeira em viagens ou eventos em grupo, evitando desconfortos comuns relacionados ao dinheiro. Ao empregar recursos de gamificação, a aplicação torna o controle de despesas mais acessível e até divertido, promovendo um comportamento mais colaborativo e consciente entre os usuários.

Além disso, trata-se de uma solução com aplicabilidade real, capaz de impactar positivamente diferentes públicos em contextos diversos, como amigos, colegas de trabalho e famílias.

## 1.5 Publico Alvo

O público-alvo para o sistema de gerenciamento de despesas em grupo para viagens e eventos deve ser bem definido, para garantir que as funcionalidades e o design do produto atendam às necessidades reais dos usuários. Considerando o contexto e os objetivos do sistema, o público-alvo pode ser dividido em grupos principais, como:

### 1.5.1 Jovens Adultos e Universitários

- Idade: 18 a 30 anos

- Perfil: Amigos e grupos de estudantes, geralmente participando de viagens, festas, eventos e viagens de intercâmbio.

- Necessidades: Buscam soluções rápidas, intuitivas e econômicas para organizar suas finanças de forma coletiva. A gamificação e uma interface amigável são pontos-chave.

- Comportamento: Estão cada vez mais conectados digitalmente, com alta utilização de aplicativos móveis para finanças pessoais e sociais.

### 1.5.2 Famílias e Grupos de Amigos

- Idade: 30 a 50 anos

- Perfil: Famílias e grupos de amigos que viajam juntos ou organizam eventos familiares (como viagens de férias, festas, casamentos, etc.).

- Necessidades: Precisam de uma forma simples e justa de dividir as despesas em grupo, levando em consideração diferentes níveis de participação nos gastos (ex: crianças, casais, pessoas que pagam separadamente).

- Comportamento: Procuram soluções práticas e transparentes para evitar mal-entendidos financeiros. Valorizam a confiança e a conveniência de ter tudo automatizado e acessível.

### 1.5.3 Empresas e Grupos Corporativos

- Idade: 25 a 50 anos

- Perfil: Colaboradores de empresas que viajam a trabalho ou organizam eventos corporativos (como convenções, eventos de integração, viagens de incentivo, etc.).

- Necessidades: Precisam de uma solução organizada e eficiente para garantir que as despesas coletivas sejam compartilhadas de forma equitativa entre os participantes, com relatórios claros e fácil acompanhamento.

- Comportamento: Buscam agilidade e precisão nas ferramentas, com integração simples entre membros de diferentes departamentos ou níveis hierárquicos.

### 1.5.4 Organizações e Grupos Comunitários

- Idade: 18 a 60 anos

- Perfil: Grupos de voluntários, ONGs ou outros grupos comunitários que realizam eventos e atividades de arrecadação de fundos ou eventos sociais.

- Necessidades: Precisam de uma forma transparente e fácil de dividir as despesas, especialmente em eventos com diferentes fontes de contribuições e participantes variáveis.

- Comportamento: Valorizam a simplicidade no gerenciamento de finanças, com relatórios acessíveis e controle de contribuições de todos os membros.

### 1.5.5 Características Comuns de Todos os Públicos

- Tecnologia: Usuários com bom nível de familiaridade com tecnologia e aplicativos móveis.

- Necessidade de Transparência: Todos os grupos precisam de uma ferramenta que forneça clareza na divisão de custos, evitando mal-entendidos e conflitos financeiros.

- Comportamento Financeiro: Procuram soluções que incentivem comportamentos financeiros mais responsáveis e colaborativos, com ferramentas que ajudem a manter o controle e a equidade nas finanças.

### 1.5.6 Conclusão

O público-alvo abrange diferentes faixas etárias e perfis, todos com um interesse comum em gerenciar de forma mais eficiente as finanças coletivas em viagens e eventos. A flexibilidade do sistema, com recursos de gamificação, visualização de despesas e divisão justa de valores, garante que o produto atenda às necessidades específicas de cada grupo, tornando a experiência mais fácil, divertida e transparente.


## 1.6 Participantes do Processo

### Participantes Gerais do Sistema​:

- **Usuário Comum**: Qualquer membro que participa de grupos e compartilha despesas.
- **Usuário Administrador (do grupo)**: Responsável por criar o grupo, incluir membros e enviar convites.
- **Administrador do Sistema**: Responsável pela segurança, manutenção e suporte da aplicação como um todo.
- **Membros Convidados**: Pessoas que recebem convite para entrar em um grupo e precisam aceitar ou recusar.
- **Sistema “Passa Régua”**: Ator automático que valida, processa cálculos e atualiza os registros de forma transparente.

---

## 1.7 Listagem dos Processos

#### **Processo 1 – Cadastro de Usuário​**
- **Usuário (comum)**: Insere seus dados pessoais e cria conta.

#### **Processo 2 – Criação de Grupos​**
- **Usuário (criador)**: Define nome do grupo e regras de divisão.
- **Sistema**: Gera identificador do grupo e relaciona com o criador.
- **Membros convidados**: Futuros participantes que serão incluídos.

#### **Processo 3 – Inclusão de Membros e Convite**
- **Usuário (criador ou administrador do grupo)**: Adiciona e-mails dos membros.
- **Membros convidados**: Recebem convite e decidem se aceitam participar.
- **Sistema**: Envia notificações e controla aceite/recusa.

#### **Processo 4 – Registro de Despesas e Divisão Automática**
- **Usuário (pagador)**: Cadastra despesa realizada.
- **Usuário (administrador)**: Aprova/reprova despesas lançadas.
- **Sistema**: Calcula divisão proporcional ou igualitária.
- **Todos os membros do grupo**: Visualizam saldo atualizado.

#### **Processo 5 – Registro de Abatimentos de Saldo Devedor**
- **Usuário (devedor)**: Realiza pagamento parcial ou total.
- **Usuário (administrador)**: Confirma recebimento (caso necessário).
- **Sistema**: Atualiza saldo individual e coletivo.
- **Sistema**: Valida informações, armazena dados no banco.
- **Administrador do Sistema (opcional)**: Em caso de validação ou suporte.
