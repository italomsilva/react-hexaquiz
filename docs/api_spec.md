# Documentação de Banco de Dados e API - HexaQuiz

Este documento detalha a estrutura de tabelas sugeridas para o banco de dados (Relacional, p. ex. PostgreSQL/MySQL) bem como os endpoints que devem ser implementados no backend para suprir o front-end em Next.js.

---

## 🏗 Tabelas do Banco de Dados

### 1. `users`
Tabela que armazena os dados dos jogadores e pontuações do ranking.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador único do usuário. |
| `name` | VARCHAR(100) | NOT NULL | Nome completo do usuário. |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL | E-mail do usuário. |
| `login` | VARCHAR(50) | UNIQUE, NOT NULL | Nome de usuário (Login). |
| `password_hash` | VARCHAR(255) | NOT NULL | Senha criptografada (ex: bcrypt). |
| `points` | INT | DEFAULT 0 | Pontuação total acumulada. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de registro. |

### 2. `questions`
Armazena as perguntas que serão puxadas diariamente pelo aplicativo.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador único da questão. |
| `title` | TEXT | NOT NULL | O texto da pergunta ou descrição. |
| `type` | VARCHAR(50) | NOT NULL | Tipo (`multiple_choice`, `guess_the_word`, etc.) |
| `answer` | VARCHAR(255) | NOT NULL | A resposta correta para ser validada no back-end. |
| `image_url` | VARCHAR(500) | NULL | URL da imagem (opcional). |
| `points` | INT | DEFAULT 10 | Pontos base recebidos por acertar a questão. |

### 3. `options`
Alternativas associadas às questões (no caso do tipo múltipla escolha e ordenação).

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador da alternativa. |
| `question_id` | UUID | FOREIGN KEY | Referência à tabela `questions`. |
| `text` | VARCHAR(255) | NULL | Texto da alternativa (se houver). |
| `image_url` | VARCHAR(500) | NULL | URL da imagem da alternativa (se houver). |

### 4. `daily_quiz_attempts` (Progresso e Histórico do Quiz)
Combina o log de atividade e o controle de sessão. Como existe apenas 1 quiz oficial por dia, esta tabela centraliza o estado em tempo real do usuário na partida atual e serve para sempre como registro histórico das pontuações nos dias em que ele participou. Uma restrição `UNIQUE (user_id, quiz_date)` deve ser aplicada para evitar duplicação.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador da partida registrada. |
| `user_id` | UUID | FOREIGN KEY, UNIQUE* | Referência ao usuário participante. |
| `quiz_date` | DATE | NOT NULL, UNIQUE* | A data do calendário em que o quiz esteve ativo. |
| `current_index` | INT | DEFAULT 0 | Posição ou índice da questão atual (retomada). |
| `points_earned` | INT | DEFAULT 0 | Pontos totais adquiridos nesta rodada. |
| `is_finished` | BOOLEAN | DEFAULT FALSE | Bloqueia novas tentativas se for igual a `true`. |
| `started_at` | TIMESTAMP | DEFAULT NOW() | Momento de visualização da primeira pergunta. |
| `completed_at` | TIMESTAMP | NULL | Momento em que a última pergunta foi finalizada. |

---

## 📡 Endpoints (API REST)

Todos os endpoints (exceto Auth) assumem envio do cabeçalho de autenticação:
`Authorization: Bearer <TKN>`

### 1. Autenticação

#### 🔹 `POST /api/auth/register`
**Descrição:** Criação de um novo cadastro.
**Entrada (Body/JSON):**
```json
{
  "name": "Neymar Jr",
  "email": "ney@selecao.com",
  "login": "njr10",
  "password": "mySecurePassword"
}
```
**Saída (JSON - 201 Created):**
```json
{
  "status": "success",
  "token": "eyJhbGci...,",
  "user": {
    "id": "123e4567-e89b-12d3...",
    "name": "Neymar Jr",
    "email": "ney@selecao.com",
    "login": "njr10"
  }
}
```

#### 🔹 `POST /api/auth/login`
**Descrição:** Realizar login na plataforma.
**Entrada (Body/JSON):**
```json
{
  "loginUser": "njr10",
  "password": "mySecurePassword"
}
```
**Saída (JSON - 200 OK):** *(Idêntico a saída de register)*


### 2. Quizzes (Módulo do Jogo)

#### 🔹 `GET /api/quiz/daily`
**Descrição:** Traz a lista das perguntas disponíveis no dia. **ATENÇÃO:** Não deve expor as opções corretas (`is_correct`) ou o campo `answer` em texto limpo, para evitar trapaças vindas do Network Tab do navegador. Para Múltipla Escolha, retornar `"HIDDEN"`. Para Wordle/Guess, retornar a string base64 `bWlhbWk=` para validação real-time de quantidade de blocos no frontend.
**Entrada:** (Omitido / Auth JWT Headers)
**Saída (JSON - 200 OK):**
```json
{
  "quiz_id": "daily-04-12",
  "questions": [
    {
      "id": "q1-uuid",
      "title": "Quem ganhou prêmio Puskas de 2015 pelo gol contra o Goianésia?",
      "type": "multiple_choice",
      "image": "/images/puskas.png",
      "points": 100,
      "options": [
        { "id": "opt1-uuid", "text": "Wendell Lira" },
        { "id": "opt2-uuid", "text": "Neymar" },
        { "id": "opt3-uuid", "text": "Lionel Messi" }
      ]
    },
    {
      "id": "q2-uuid",
      "title": "Adivinhe quem é este jogador?",
      "type": "guess_the_word",
      "image": "/images/r9.jpg",
      "points": 200,
      "answer": "Uk9OQUxETw==",
      "options": []
    }
  ],
  "session": {
    "currentIndex": 0,
    "score": 0,
    "isFinished": false
  }
}
```

**O que o Back-end deve fazer (Regra de Negócio):**
1. Identificar o usuário através do Token (`Bearer <TKN>`).
2. Consultar o banco de dados na tabela `questions` procurando as perguntas do Quiz do Dia.
3. Fazer a varredura nas perguntas: Se a pergunta for Texto/Wordle, criptografar a coluna `answer` real usando Base64. Se for Múltipla Escolha/Ordem, substituir a propriedade `answer` pela string literial `"HIDDEN"`.
4. Consultar a tabela `daily_quiz_attempts` usando o `user_id` e a data de hoje. Se o usuário nunca tiver aberto o quiz hoje, criar um novo registro no banco e retornar um payload zerado de "session". Se encontrar o registro, retornar os dados atuais no mesmo payload de "session", permitindo que o front-end retome na questão interrompida e proíba jogar caso `is_finished = true`.

#### 🔹 `POST /api/quiz/answer`
**Descrição:** Envia a resposta de uma única questão em tempo real para o backend avaliar. O usuário recebe o feedback imediato se acertou e quantos pontos somou, vital para o fluxo das questões que não admitem repetição sem saber do resultado anterior.
**Entrada (Body/JSON):**
```json
{
  "quiz_id": "daily-04-12",
  "question_id": "q1-uuid",
  "answer": "opt1-uuid", 
  "attempts": 1
}
```
*A chave `answer` pode ser tanto o ID da alternativa (múltipla escolha) quanto o texto digitado livremente.*

**Saída (JSON - 200 OK):**
```json
{
  "status": "success",
  "correct": true,
  "points_earned": 100,
  "correct_answer_payload": "opt1-uuid"
}
```
*(Se estiver errado, `correct` retornará `false`. Independentemente disso, `correct_answer_payload` DEVE vir preenchido com a resposta certa para o componente do React se pintar apropriadamente após a submissão).*

**O que o Back-end deve fazer (Regra de Negócio):**
1. O backend busca o `question_id` no banco de dados e compara o campo de entrada `answer` com a coluna `answer` verdadeira na tabela `questions`.
2. Calcula os pontos: Se tiver acerto limpo em Múltipla escolha dá o máximo de pontos. Se a requisição pertencer a "Adivinhe a Palavra", reduz-se a penalidade matemática conforme o número de `attempts` (tentativas) gasto chegue até 5.
3. Busca o registro de hoje desta rodada do usuário na `daily_quiz_attempts` e ATUALIZA a pontuação (`points_earned`) somando-a à base. Transações simultâneas de index podem ser ignoradas aqui se o Frontend ditar via Advance.
4. (Opcional) Cria uma micro-tabela transacional como `answers_log` vinculada a esta Attempt, caso você queira extrair métricas de fraude em tempo gasto.
5. Devolve o gabarito original no JSON final em `correct_answer_payload` contendo o ID certo ou a palavra em texto puro (Sem criptografia/Hidden).

#### 🔹 `POST /api/quiz/session/advance`
**Descrição:** Salva o progresso de navegação caso o usuário saia antes de terminar o quiz diário.
**Entrada (Body/JSON):**
```json
{
  "newIndex": 1,
  "isFinished": false
}
```
**Saída (JSON - 200 OK):**
```json
{ "status": "success" }
```

**O que o Back-end deve fazer (Regra de Negócio):**
1. O frontend chama essa rota inteiramente focado em salvar o "avanço de página/checkpoint". 
2. Realiza o `UPDATE` no registro da `daily_quiz_attempts` do dia atual: definindo `current_index` = `newIndex`.
3. Se `is_finished` vier verdadeiro, sela o quiz: preenche `completed_at` com o timestamp atual e `is_finished = true`.
4. Uma transação no banco deve pegar os `points_earned` totais gerados hoje e adicionar na coluna principal `points` do ranking da tabela primária `users`, concluindo o ciclo de pontuação do jogador.

### 3. Ranking e Perfil

#### 🔹 `GET /api/ranking?type=weekly` (ou general)
**Descrição:** Retorna a lista de usuários classificados para a tabela na página `/ranking`.
**Entrada:** Parâmetro `type` na query string.
**Saída (JSON - 200 OK):**
```json
{
  "ranking_type": "weekly",
  "ranking": [
    { "rank": 1, "name": "Pelé Eterno", "points": 15000, "isCurrentUser": false },
    { "rank": 2, "name": "Usuário Teste", "points": 850, "isCurrentUser": true },
    { "rank": 3, "name": "Casemiro 5", "points": 800, "isCurrentUser": false }
  ]
}
```

#### 🔹 `GET /api/users/profile/me`
**Descrição:** Retorna os dados estatísticos do perfil do usuário para exibir na rota `/profile`.
**Saída (JSON - 200 OK):**
```json
{
  "user": {
    "name": "Neymar Jr",
    "login": "njr10",
    "email": "ney@selecao.com",
    "points": 25000,
    "joined_at": "2026-03-30T10:00:00Z"
  },
  "stats": {
    "quizzes_played": 35,
    "correct_answers": 290
  }
}
```
