# Documentação da API - HexaQuiz

Este documento detalha os endpoints da API para o funcionamento do app Next.js. Todos os endpoints exigem um cabeçalho de autenticação (exceto os de registro e login).

---

## 🏗 Padrão de Respostas (Global)

Para garantir um padrão sênior, previsível e facilitar a tipagem no Frontend com TypeScript, todas as respostas da API devem seguir um formato estruturado (Envelope Pattern).

### Sucesso (2xx)
```json
{
  "status": "success",
  "data": { ... },
  "message": "Mensagem opcional de sucesso"
}
```

### Erro (4xx, 5xx)
```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token inválido ou expirado.",
    "details": {} 
  }
}
```

---

## 📡 Endpoints (API REST)

**Autorização:** `Authorization: Bearer <JWT_TOKEN>`

### 1. Autenticação

#### 🔹 `POST /api/auth/register`
**Descrição:** Registro de um novo jogador.
**Entrada (Body/JSON):**
```json
{
  "name": "Neymar Jr",
  "email": "ney@selecao.com",
  "username": "njr10",
  "password": "mySecurePassword"
}
```
**Saída (201 Created):**
```json
{
  "status": "success",
  "message": "Usuário registrado com sucesso.",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "uuid",
      "name": "Neymar Jr",
      "email": "ney@selecao.com",
      "username": "njr10"
    }
  }
}
```

#### 🔹 `POST /api/auth/login`
**Descrição:** Login de um usuário existente.
**Entrada (Body/JSON):** 
```json
{
  "username": "njr10",
  "password": "mySecurePassword"
}
```
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "uuid",
      "name": "Neymar Jr",
      "email": "ney@selecao.com",
      "username": "njr10"
    }
  }
}
```

#### 🔹 `GET /api/auth/me`
**Descrição:** Retorna os dados resumidos do jogador logado atualmente.
**Saída (200 OK):** 
```json
{
  "status": "success",
  "data": {
    "user": { 
      "id": "uuid", 
      "name": "Neymar Jr", 
      "username": "njr10", 
      "points": 850 
    }
  }
}
```

---

### 2. Quizzes (Módulo do Jogo Diário)

#### 🔹 `GET /api/quiz/daily`
**Descrição:** Traz as perguntas do dia e o estado da sessão atual do usuário.
**Lógica Backend:**
1. Busca todas as `questions` vinculadas através da `daily_quizzes` para a data de hoje.
2. Busca se o usuário possui registro na `game_session` para o `quiz_id` de hoje.
3. Se não tiver, **cria** um novo registro de sessão (zerado).
4. Oculta o campo `answer` das questões (para não expor na aba Network).

**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "quiz_id": "uuid-da-agenda",
    "quiz_date": "2026-04-01T00:00:00Z",
    "questions": [
      { 
        "id": "q1", 
        "text": "Quem ganhou prêmio Puskas de 2015?", 
        "type": 1, 
        "image": "...", 
        "options": [
          { "id": "opt1", "text": "Wendell Lira" },
          { "id": "opt2", "text": "Neymar" }
        ] 
      },
      { 
        "id": "q2", 
        "text": "Adivinhe o jogador?", 
        "type": 3, 
        "answer": "Uk9OQUxETw==",
        "options": []
      }
    ],
    "session": {
      "index": 0,
      "points": 0,
      "finished": false
    }
  }
}
```

#### 🔹 `POST /api/quiz/answer`
**Descrição:** Valida em tempo real a resposta de uma questão e salva progresso.
**Entrada (Body/JSON):**
```json
{
  "question_id": "q1-uuid",
  "answer": "opt1", 
  "attempts_used": 1
}
```
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "correct": true,
    "points_earned": 100,
    "correct_answer": "opt1"
  }
}
```
**Lógica Backend:**
1. Valida a resposta submetida contra a resposta do banco.
2. Calcula pontos baseado em `questions.base_points` e deduções por `attempts_used` (se for o caso de múltiplas tentativas).
3. **Atualiza** a `game_session`: Soma o `points_earned` atual e avança o `index`.

#### 🔹 `POST /api/quiz/finish`
**Descrição:** Encerra o quiz de hoje e consolida os pontos no ranking global.
**Entrada:** Nenhuma (Headers recebem JWT do usuário).
**Lógica Backend:**
1. Busca a sessão do usuário de hoje (`game_session` ativa).
2. Define `finished = true`.
3. Pega o `points` acumulado da sessão e **adiciona** na coluna `total_points` da tabela `user`.
4. Define `completed_at = NOW()`.

**Saída (200 OK):**
```json
{
  "status": "success",
  "message": "Quiz finalizado com sucesso.",
  "data": null
}
```

---

### 3. Ranking e Perfil

#### 🔹 `GET /api/ranking`
**Descrição:** Retorna os jogadores com maior pontuação global (`total_points`).
**Parâmetros (Query):** `limit=10`, `offset=0`.
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "top_players": [
      { "rank": 1, "username": "pelé", "name": "Pelé", "points": 15000, "is_me": false },
      { "rank": 2, "username": "italo", "name": "Italo", "points": 850, "is_me": true }
    ],
    "pagination": {
      "limit": 10,
      "offset": 0,
      "total": 150
    }
  }
}
```

#### 🔹 `GET /api/users/profile/me`
**Descrição:** Estatísticas completas do perfil do jogador.
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": { 
      "name": "Neymar Jr", 
      "email": "ney@selecao.com", 
      "username": "njr10",
      "joined_at": "2026-03-30T10:00:00Z" 
    },
    "stats": {
      "total_points": 25000,
      "quizzes_played": 35,
      "current_streak": 5
    }
  }
}
```
