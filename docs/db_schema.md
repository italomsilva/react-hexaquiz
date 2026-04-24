# Estrutura do Banco de Dados - HexaQuiz

Este documento detalha a estrutura de tabelas sugeridas para o banco de dados relacional (ex: PostgreSQL / MySQL).

---

## 🏗 Tabelas

### 1. `user`
Armazena dados dos jogadores e pontuação global para o ranking.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador único. |
| `name` | VARCHAR(50) | NOT NULL | Nome completo. |
| `username` | VARCHAR(20) | UNIQUE, NOT NULL | Nickname/Login. |
| `email` | VARCHAR(100) | UNIQUE, NOT NULL | E-mail de login/contato. |
| `profile_image` | VARCHAR(255) | NULL | URL da imagem de perfil. |
| `password` | VARCHAR(255) | NOT NULL | Senha (Hash bcrypt). |
| `total_points` | INT | DEFAULT 0 | Soma de todos os pontos ganhos em quizzes. |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Data de registro. |

### 2. `question`
Armazena o acervo de perguntas do sistema.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador da questão. |
| `text` | TEXT | NOT NULL | Pergunta. |
| `type` | INT | NOT NULL | Tipo (`multiple_choice`, `guess_the_word`, `wordle`, `true_false`). |
| `answer` | VARCHAR(255) | NOT NULL | Resposta correta (Texto, ID da opção, ou "true"/"false" para true_false). |
| `image` | VARCHAR(255) | NULL | URL da imagem de apoio. |
| `base_points` | INT | DEFAULT 10 | Pontuação base da questão. |

### 3. `option`
Alternativas para questões de múltipla escolha ou ordenação.
**Nota:** Questões do tipo `true_false` não utilizam esta tabela (as opções Verdadeiro/Falso são implícitas).

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador da opção. |
| `text` | VARCHAR(255) | NULL | Texto da alternativa. |
| `image` | VARCHAR(255) | NULL | Imagem da alternativa (se houver). |
| `question_id` | UUID | FOREIGN KEY | Referência à pergunta. |

### 4. `daily_quizzes` (Agenda)
Define quais perguntas aparecem em cada dia.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador da entrada na agenda. |
| `question_id` | UUID | FOREIGN KEY | Referência à pergunta. |
| `scheduled_date` | TIMESTAMP | NOT NULL | Data e hora em que será exibida. |
| `sequence` | INT | NOT NULL | Ordem no quiz do dia. |

### 5. `game_session` (Progresso)
Controla o progresso do usuário no quiz de um dia específico.

| Coluna | Tipo | Restrições | Descrição |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Identificador da sessão. |
| `user_id` | UUID | FOREIGN KEY | Usuário participante. |
| `quiz_id` | UUID | FOREIGN KEY | Referência ao quiz da agenda (`daily_quizzes.id`). |
| `index` | INT | DEFAULT 0 | Índice da questão atual (retomada). |
| `points` | INT | DEFAULT 0 | Pontos ganhos hoje. |
| `finished` | BOOLEAN | DEFAULT FALSE | Bloqueia novas tentativas se `true`. |
| `started_at` | TIMESTAMP | DEFAULT NOW() | Início da partida. |
| `completed_at` | TIMESTAMP | NULL | Término da partida. |
