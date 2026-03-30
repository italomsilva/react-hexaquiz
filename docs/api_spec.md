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

### 4. `user_activities` (Logs de Partida)
Armazena histórico de quizzes feitos para gerar estatísticas e evitar que jogue mais de uma vez por dia.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador da partida registrada. |
| `user_id` | UUID | FOREIGN KEY | Referência à tabela `users`. |
| `points_earned` | INT | NOT NULL | Pontos adquiridos nesta partida. |
| `played_at` | TIMESTAMP | DEFAULT NOW() | Quando o usuário finalizou o quiz. |

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
