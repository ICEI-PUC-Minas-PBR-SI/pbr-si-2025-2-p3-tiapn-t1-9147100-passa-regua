### 3.3.5 Processo 5 – Abatimento de pagamento

_Apresente aqui o nome e as oportunidades de melhoria para o processo 2. 
Em seguida, apresente o modelo do processo 2, descrito no padrão BPMN._

![PROCESSO 5](../images/modelagem-5-abatimento-de-pagamentos.png "Modelo BPMN do Processo 5.")

### Mapeamento dos Wireframes com os Requisitos
A seguir, apresentamos a descrição de como os wireframes apresentados atendem aos requisitos funcionais e não funcionais do sistema.

5. Abatimento de Despesas

![Wireframe Processo 5](../images/proc5-wireframe-abater-despesa.jpg "Wireframe do Processo 5 – Abater despesa")

### Requisitos Atendidos – Processo 5 (Abatimento de despesas)

- **RF-005**: Atendido – o wireframe prevê anexar comprovantes de despesa (botões *Anexar* e *Tirar foto*).  
- **RF-008**: Atendido – o formulário permite registrar abatimentos de pagamento, informando despesa e enviando confirmação.  
- **RF-009**: Parcialmente atendido – a tela não mostra a notificação, mas o envio da operação permite que o sistema gere a confirmação.  
- **RF-010**: Indiretamente atendido – ao registrar abatimento, os saldos individuais/coletivos são atualizados no sistema.  

**Requisitos Não Funcionais:**
- **RNF-001**: Atendido – interface voltada para mobile, assegurando responsividade.  
- **RNF-006**: Atendido – fluxo simples permite exibição de mensagens de erro em caso de falha.  
- **RNF-008**: Atendido – design intuitivo com botões claros e diretos.  


#### Detalhamento das Atividades

A seguir, descrevemos as propriedades das atividades do processo 5, relacionando-as aos campos de dados do wireframe.

1. **Receber fechamento das despesas**  
   - **Descrição:** O sistema recebe as informações consolidadas de despesas do grupo.  
   - **Campos utilizados:**  
     - *Número* → valor total das despesas.  
     - *Imagem* → comprovante anexado (ex.: nota fiscal).  

2. **Efetuar pagamento**  
   - **Descrição:** O usuário realiza o registro de um pagamento ou abatimento.  
   - **Campos utilizados:**  
     - *Caixa de texto* → identificação da despesa (“Desp 2”).  
     - *Número* → valor pago.  
     - *Imagem* → anexar ou tirar foto do comprovante.  
     - *Data e Hora* → momento em que o pagamento foi efetuado.  

3. **Marcar como pago no aplicativo**  
   - **Descrição:** O sistema atualiza o status da despesa para “paga” após a confirmação do usuário.  
   - **Campos utilizados:**  
     - *Seleção única* → marcar opção “Pago” (radio button ou checkbox).  

4. **Enviar notificação de pagamento**  
   - **Descrição:** O sistema dispara notificação automática aos membros do grupo sobre o pagamento realizado.  
   - **Campos utilizados:**  
     - *Caixa de texto* → mensagem de notificação enviada.  
     - *Data e Hora* → registro do envio da notificação.  


**Atividade: Efetuar Abatimento de Despesa**

| **Campo**        | **Tipo**       | **Restrições**                       | **Valor default** |
|------------------|----------------|--------------------------------------|-------------------|
| Despesa          | Caixa de Texto | Obrigatório, mínimo 3 caracteres     | vazio             |
| Valor pago       | Número         | Decimal (>= 0, com 2 casas)          | 0,00              |
| Comprovante      | Imagem         | Opcional (anexar ou tirar foto)      | -                 |
| Data/Hora        | Data e Hora    | Registrado automaticamente pelo app  | Data/Hora atual   |

| **Comandos**     | **Destino**                       | **Tipo**   |
|------------------|-----------------------------------|------------|
| Anexar           | Selecionar arquivo do dispositivo | default    |
| Tirar foto       | Abrir câmera do dispositivo       | default    |
| Enviar           | Atualizar saldo do grupo e gerar notificação | default |
