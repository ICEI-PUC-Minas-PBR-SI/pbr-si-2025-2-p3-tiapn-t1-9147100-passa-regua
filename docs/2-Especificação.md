# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Contexto.md">Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. Esta seção apresenta uma visão geral da especificação do sistema Passa Régua, que será detalhada a seguir por meio de personas, histórias de usuários, requisitos funcionais e não funcionais e restrições do projeto.

Técnicas e Ferramentas Utilizadas

Para realizar a especificação do projeto, serão empregadas as seguintes abordagens e recursos:

- Modelagem de Personas para identificar perfis e necessidades dos usuários.

- Histórias de Usuário (User Stories) no formato ágil (“Como [ator], quero [ação] para [benefício]”), auxiliando na elicitação dos requisitos.

- Levantamento de Requisitos por meio da análise do contexto e das discussões do time.

- Documentação em Markdown (.md) no repositório GitHub, facilitando versionamento e colaboração.

- Tecnologias alvo do projeto: banco de dados MySQL já provisionado e implementação em arquitetura de microserviços, com uso de Java e .NET para os módulos conforme definido pela equipe.

## Personas

1- Júlia, 28 anos, estudante de mestrado e a amiga que sempre organiza os rolês. Ela é metódica e adora planejar tudo com antecedência, mas se sente sobrecarregada na hora de dividir as contas. Ela é quem geralmente paga tudo primeiro e depois tem que ficar cobrando a galera. Quer que todos se divirtam e se sintam confortáveis, sem que o dinheiro seja um problema. Acha estressante ter que controlar todas as despesas em planilhas e ter a "cobrança" como uma responsabilidade adicional. Sente que o peso da organização financeira recai sobre ela.

2- Pedro, 25 anos, designer gráfico e o cara mais relax do grupo. Ele tem a melhor das intenções, mas é bem esquecido quando o assunto é dinheiro. Muitas vezes ele nem se lembra que pagou ou que precisa pagar alguém. Quer participar de tudo e curtir sem se preocupar com os detalhes financeiros. Fica com vergonha de não se lembrar de pagar ou de ter que perguntar para os outros quanto ele deve. Tem medo de parecer irresponsável e de prejudicar a organização do grupo.

3-  André, 32 anos, engenheiro de software, é o mais cético e analítico do grupo. Ele valoriza a justiça e a transparência em tudo, inclusive nas finanças. Ele tem uma planilha pessoal para tudo e quer ter certeza de que as contas estão perfeitamente equilibradas. Quer garantir que as contas sejam divididas de forma exata e justa, sem que ninguém saia no prejuízo. Não confia em "acertos de cabeça" e se sente desconfortável quando as contas não fecham no final do encontro. Fica inseguro sobre o uso de planilhas manuais que podem ter erros.

4- Ana, 40 anos, mãe de duas crianças (8 e 12 anos). Ela adora viajar com a família, mas a divisão de contas com outros casais é sempre um desafio. Suas filhas nem sempre consomem a mesma coisa ou participam de todas as atividades, o que torna a divisão mais complexa. Quer aproveitar o tempo com a família e amigos, sem se preocupar com a logística de quem pagou o quê, especialmente em despesas que não são iguais para todos. Sente dificuldade em calcular a divisão de gastos quando o consumo é desigual. Sente-se pressionada para que a divisão seja feita de forma justa, sem que as crianças sejam "cobradas" por despesas de adultos.

5- Lucas, 23 anos, estudante universitário, vive com o orçamento apertado. Ele sempre participa de viagens e eventos, mas está sempre de olho nos gastos. Ele não gosta de ter que pagar algo que não consumiu. Quer participar das atividades do grupo, mas precisa controlar seu dinheiro para não estourar o orçamento. Se sente desconfortável quando a divisão é por igual, especialmente quando consome menos que os outros. Tem dificuldade em pedir para que as contas sejam divididas de forma diferente.


## Histórias de Usuários

1. História da Júlia
Como a Organizadora, eu quero um aplicativo onde eu possa registrar as despesas do grupo em tempo real, para que eu não precise mais usar planilhas e me sinta segura de que todas as contas estão sendo registradas, aliviando o estresse da cobrança.

2. História do Pedro
Como o Esquecido, eu quero receber notificações sobre quem eu preciso pagar e quem me deve, para que eu não me esqueça de acertar as contas e não crie atrito com meus amigos por causa de dívidas pendentes.

3. História do André
Como o Controlado, eu quero ter acesso a um painel com um resumo financeiro claro e transparente para todos os membros, para que eu possa verificar se as despesas foram registradas corretamente e ter certeza de que o acerto final é justo e preciso para todos.

4. História da Ana
Como mãe de família, eu quero a capacidade de marcar despesas como "não participativas" para determinados membros do grupo, para que a divisão de contas considere o consumo das minhas filhas, garantindo que eu pague apenas pelo que consumimos e a divisão seja equitativa.

5. História do Lucas
Como o Poupador, eu quero poder visualizar meu saldo individual em tempo real e ver exatamente quanto eu devo ou quanto me devem, para que eu possa planejar meus gastos e me sentir mais à vontade sabendo que não terei que pagar por algo que não consumi, mantendo meu orçamento sob controle.

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Júlia, como Organizadora | Registrar as despesas do grupo em tempo real. | Não precise mais usar planilhas e se sinta segura de que todas as contas estão sendo registradas, aliviando o estresse da cobrança.|
| Pedro, como Esquecido | Receber notificações sobre quem eu preciso pagar e quem me deve | Não se esqueça de acertas as contas e não crie atrito com seus amigos por causa de dívidas pendentes. |
| André, como controlado | Acesso a um painel com um resumo financeiro claro e transparente para todos os membros | Verificar se as despesas foram registradas corretamente e ter certeza de que o acerto final é justo e preciso para todos. |
| Ana, como mãe de família | Quer a capacidade de marcar despesas como "não participativas" para determinados membros do grupo | A divisão de contas considere o consumo das filhas, garantindo que seja pague apenas pelo que foi consumido e a divisão seja equitativa. |
| Lucas, como poupador | Visualizar o saldo individual em tempo real e ver exatamente quanto deve e quanto irá receber | Possa planejar seus gastos e se sentir mais à vomtade sabendo que não terá que pagar algo que não consumiu. |


## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

|ID    | Descrição do Requisito                                                                 | Prioridade |
|------|-----------------------------------------------------------------------------------------|------------|
|RF-001| O sistema deve permitir que o usuário crie uma conta e faça login com validação de e-mail.  | ALTA       |
|RF-002| O sistema deve permitir a criação de grupos de despesas e o gerenciamento por administradores.         | ALTA       |
|RF-003| O sistema deve permitir enviar convites para inclusão de membros no grupo, com aceite ou recusa.                | ALTA       |
|RF-004| O sistema deve permitir a inclusão de participantes não cadastrados com link. | MÉDIA      |
|RF-005| O sistema deve permitir o registro das despesas com anexos e submetê-las à aprovação do administrador.               | ALTA       |
|RF-006| O sistema deve enviar notificações automáticas sobre aprovações, reprovações e alterações de despesas. | ALTA       |
|RF-007| O sistema deve calcular automaticamente a divisão das despesas entre os membros do grupo.              | ALTA       |
|RF-008| O sistema deve permitir o registro de pagamentos e abatimentos, com atualização dos saldos.            | ALTA       |
|RF-009| O sistema deve enviar notificações de confirmação de pagamento aos membros do grupo.                   | MÉDIA      |
|RF-010| O sistema deve oferecer visualização clara da carteira individual e coletiva do grupo.                 | MÉDIA      |
|RF-011| O sistema deve disponibilizar relatórios de despesas, saldos e histórico de eventos.                   | MÉDIA      |
|RF-012| o sistema deve dispor de elementos de gamificação (medalhas) para incentivar o engajamento.     | BAIXA      |
|RF-013| O sistema deve gerar estatísticas de uso e comportamento dos usuários, disponibilizando relatórios para a administração do sistema. | MÉDIA |


## Requisitos Não Funcionais (RNF)

| **ID**    | **Descrição do Requisito**                                                                 | **Prioridade** |
|-----------|---------------------------------------------------------------------------------------------|----------------|
| RNF-001   | O sistema deve ser responsivo, adaptando-se a diferentes tamanhos de tela (desktop, tablet e dispositivos móveis). | ALTA |
| RNF-002   | O sistema deve suportar acesso multiplataforma, rodando em navegadores modernos (Chrome, Firefox, Edge, Safari). | ALTA |
| RNF-003   | As requisições do usuário devem ser processadas em no máximo **3 segundos**, em condições normais de uso. | MÉDIA |
| RNF-004   | O sistema deve garantir a segurança dos dados, com armazenamento criptografado de credenciais (hash + salt). | ALTA |
| RNF-005   | O sistema deve suportar autenticação via e-mail, com recuperação segura de senha. | ALTA |
| RNF-006   | O sistema deve ser tolerante a falhas, exibindo mensagens de erro claras e sem perda de dados já inseridos. | MÉDIA |
| RNF-007   | O sistema deve manter logs de atividade de usuários e operações de grupo para rastreabilidade. | MÉDIA |
| RNF-008   | A interface deve ser intuitiva e de fácil navegação, com usabilidade adequada a usuários não técnicos. | ALTA |
| RNF-009   | O sistema deve estar disponível **24/7**, com uptime mínimo de 99% (considerando ambiente de produção). | BAIXA |
| RNF-010   | O sistema deve estar documentado em Markdown e versionado no GitHub para garantir rastreabilidade e colaboração. | ALTA |

---

## Restrições do Projeto

| **ID** | **Restrição** |
|--------|----------------|
| R-01   | O projeto deverá ser entregue até o final do semestre, sem possibilidade de prorrogação. |
| R-02   | O desenvolvimento deve utilizar **Java** e **.NET** nos módulos definidos pela equipe, respeitando a arquitetura de microserviços. |
| R-03   | O banco de dados deve ser **MySQL**, já provisionado previamente, não podendo ser substituído por outro SGBD. |
| R-04   | A documentação oficial deve ser realizada em **Markdown** e publicada no repositório GitHub. |
| R-05   | As funcionalidades devem estar alinhadas às histórias de usuário definidas (não serão aceitas funções que não atendam a essas demandas). |
| R-06   | O sistema não deve depender de serviços pagos ou proprietários (restrição orçamentária). |
