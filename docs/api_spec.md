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

### 1. Autenticação & Perfil

#### 🔹 `POST /app/auth/register`
**Descrição:** Registro de um novo jogador.
**Entrada (Body/JSON):**
```json
{
  "name": "Neymar Jr",
  "email": "ney@selecao.com",
  "username": "njr10",
  "password": "mySecurePassword",
  "profileImage": "/images/avatar/avatar_03.jpeg"
}
```
**Saída (201 Created):**
```json
{
  "status": "success",
  "message": "Usuário registrado com sucesso.",
  "data": {
    "id": "uuid",
    "name": "Neymar Jr",
    "email": "ney@selecao.com",
    "username": "njr10",
    "totalPoints": 0,
    "createdAt": "2026-04-27T10:00:00Z",
    "profileImage": "/images/avatar/avatar_03.jpeg"
  }
}
```

#### 🔹 `POST /app/auth/login`
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
    "id": "uuid",
    "name": "Neymar Jr",
    "email": "ney@selecao.com",
    "username": "njr10",
    "totalPoints": 850,
    "createdAt": "2026-04-27T10:00:00Z",
    "profileImage": "/images/avatar/avatar_03.jpeg"
  }
}
```

#### 🔹 `GET /app/users/profile/me`
**Descrição:** Estatísticas completas do perfil do jogador.
**Saída (200 OK):** 
```json
{
  "status": "success",
  "data": {
    "stats": {
      "quizzesPlayed": 35,
      "accuracy": 57
    }
  }
}
// quizzesPlayed = total de games sessions do jogador
// acurracy = total pontos do jogador / total de games sessions do jogador * 100
```

#### 🔹 `PUT /app/users/me/avatar`
**Descrição:** Atualiza o avatar (foto de perfil) do usuário.
**Entrada (Body/JSON):**
```json
{
  "avatarUrl": "/images/avatar/avatar_05.jpeg"
}
```
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Neymar Jr",
    "email": "ney@selecao.com",
    "username": "njr10",
    "totalPoints": 850,
    "createdAt": "2026-04-27T10:00:00Z",
    "profileImage": "/images/avatar/avatar_05.jpeg"
  }
}
```

#### 🔹 `PUT /app/users/me`
**Descrição:** Atualiza os dados cadastrais do usuário (nome, e-mail, usuário, avatar e senha).
**Entrada (Body/JSON):**
```json
{
  "name": "Neymar Santos Jr",
  "email": "ney.jr@selecao.com",
  "username": "neymarjr_oficial",
  "avatarUrl": "/images/avatar/avatar_08.jpeg",
  "newPassword": "newSecurePassword"
}
```
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "name": "Neymar Santos Jr",
    "email": "ney.jr@selecao.com",
    "username": "neymarjr_oficial",
    "totalPoints": 850,
    "createdAt": "2026-04-27T10:00:00Z",
    "profileImage": "/images/avatar/avatar_08.jpeg"
  }
}
```

---

### 2. Quizzes (Módulo do Jogo Diário)

#### 🔹 `GET /app/quiz/daily`
**Descrição:** Traz as perguntas do dia e o estado da sessão atual do usuário.
**Lógica Backend:**
1. Retorna a lista de perguntas do quiz diário.
2. Certas respostas vêm encodadas em base64 (`GUESS_THE_WORD`) ou substituídas por `HIDDEN`.
3. Retorna os dados da sessão do quiz daquele usuário (`index` atual, se já foi `finished`, `points` acumulados e `correctCount`). Se não houver, inicia uma nova zerada.

**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "questions": [
      { 
        "id": "q1", 
        "text": "Quem ganhou prêmio Puskas de 2015?", 
        "type": 1, 
        "image": "...", 
        "options": [
          { "id": "opt1", "text": "Wendell Lira" },
          { "id": "opt2", "text": "Neymar" }
        ],
        "answer": "opt1",
        "basePoints": 100
      },
      { 
        "id": "q2", 
        "text": "Adivinhe o jogador?", 
        "type": 3, 
        "answer": "Uk9OQUxETw==",
        "basePoints": 200
      }
    ],
    "session": {
      "index": 0,
      "points": 0,
      "finished": false,
      "correctCount": 0
    }
  }
}
// se a questao for do tipo MULTIPLE_CHOICE, TRUE_FALSE, ORDERING o campo answer vem escrito HIDDEN
// se a questao for do tipo GUESS_THE_WORD ou WORDLE o campo answer vem coma resposta encriptada em base64
```

#### 🔹 `POST /app/quiz/answer`
**Descrição:** Valida a resposta da questão e salva no log de atividades, atualizando pontuação em tempo real.
**Entrada (Body/JSON):**
```json
{
  "question_id": "q1-uuid",
  "answer": "opt1", 
  "attempts": 1
}
```
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "correct": true,
    "points_earned": 100,
    "correct_answer_payload": "opt1"
  }
}
```
**Lógica Backend:**
1. Valida a resposta ignorando Case (maiúscula/minúscula).
2. Calcula pontos baseado em `basePoints` e no multiplicador por `attempts` (nos jogos de forca/adivinhação há penalidade por tentativas).
3. Adiciona os `points_earned` na conta do usuário, e atualiza as estatísticas do `daily_quiz_attempts_db` e do `answers_log_db`.

#### 🔹 `POST /app/quiz/advance`
**Descrição:** Avisa ao servidor que o usuário avançou o ponteiro do Quiz, gravando o index, e finaliza logicamente.
**Entrada (Body/JSON):**
```json
{
  "newIndex": 1,
  "finished": false
}
```
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": null
}
```

---

### 3. Ranking

#### 🔹 `GET /app/ranking`
**Descrição:** Retorna os jogadores ordenados por pontuação baseados na categoria enviada.
**Parâmetros (Query):** `type=weekly|general`
**Saída (200 OK):**
```json
{
  "status": "success",
  "data": {
    "top_players": [
      { 
        "rank": 1, 
        "username": "rei_pele", 
        "name": "Pelé Eterno", 
        "points": 15000, 
        "profileImage": "/images/avatar/avatar_00.jpeg", 
        "isCurrentUser": false 
      },
      { 
        "rank": 2, 
        "username": "njr10", 
        "name": "Neymar Jr", 
        "points": 850, 
        "profileImage": "/images/avatar/avatar_03.jpeg", 
        "isCurrentUser": true 
      }
    ]
  }
}
```
