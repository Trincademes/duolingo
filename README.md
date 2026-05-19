# DuoTech

Plataforma academica inspirada no Duolingo para ensino de tecnologia com microlicoes, exercicios interativos, progressao por trilha, XP, nivel, streak, revisao baseada em erro e painel administrativo.

Cursos iniciais do projeto:

- Expo / React Native
- AWS Nuvem

## Visao geral

O projeto foi estruturado como monorepo com tres frentes:

- `apps/mobile`: app do aluno em Expo / React Native
- `apps/admin`: interface web em Next.js
- `apps/api`: API em Node.js / Express
- `packages/shared`: catalogo dos cursos e regras de negocio compartilhadas
- `docs`: arquitetura e matriz de requisitos

## O que o app entrega

### Jornada do aluno

- cadastro
- login
- recuperacao e redefinicao de senha
- edicao de perfil
- escolha entre os cursos Expo e AWS
- progresso independente por curso
- trilha com desbloqueio progressivo
- licoes com explicacao curta
- exercicios dos tipos:
  - multipla escolha
  - verdadeiro/falso
  - associacao
  - completar codigo
  - ordenar passos
- feedback imediato por questao
- conclusao de licao com minimo de acertos
- XP, nivel e conquistas
- streak diario
- historico de licoes
- revisao inteligente baseada em erros
- ranking opcional com opt-in do usuario
- configuracao de lembrete diario

### Administracao

- CRUD de cursos
- CRUD de modulos
- CRUD de licoes
- CRUD de exercicios
- relatorios de uso
- arquivamento de conteudo sem apagar o progresso ja registrado

### Relatorios / KPIs

- total de usuarios
- usuarios ativos no dia
- media de licoes por usuario
- media de streak
- taxa de manutencao de streak
- tempo medio de uso diario
- acuracia media
- acuracia por exercicio
- taxa de conclusao de modulos
- conclusao por curso
- retencao D1, D7 e D30

## Stack

### Frontend mobile

- Expo
- React Native
- AsyncStorage
- Expo Notifications

### Frontend web

- Next.js
- React

### Backend

- Node.js
- Express
- JWT

### Persistencia

- JSON file database em `apps/api/data/db.json` para desenvolvimento local
- DynamoDB opcional na AWS para usuarios, progresso e ranking

## Arquitetura

```text
duolingo/
├── apps/
│   ├── admin/      # Next.js
│   ├── api/        # Express API
│   └── mobile/     # Expo app
├── docs/
│   ├── architecture.md
│   └── requirements-matrix.md
└── packages/
    └── shared/     # conteudo e regras de negocio
```

## Requisitos para rodar em outra maquina

Instale antes:

- Node.js 22+ recomendado
- npm 10+ recomendado
- Git

Opcional para mobile:

- Expo Go no celular
- Android Studio ou simulador iOS/macOS

## Como configurar em outra maquina

### 1. Clonar o repositorio

```bash
git clone https://github.com/Trincademes/duolingo.git
cd duolingo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variaveis de ambiente

Copie os arquivos de exemplo:

- `apps/api/.env.example`
- `apps/admin/.env.example`
- `apps/mobile/.env.example`

Configuracao padrao:

#### API

Arquivo: `apps/api/.env`

```env
PORT=3333
JWT_SECRET=duolingo-tech-secret
STORE_DRIVER=json
AWS_REGION=us-east-1
AWS_DYNAMODB_TABLE=duotech-app-state
```

#### Admin web

Arquivo: `apps/admin/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3333
```

#### Mobile

Arquivo: `apps/mobile/.env`

```env
EXPO_PUBLIC_API_URL=http://localhost:3333
```

## Como rodar

Abra tres terminais na raiz do projeto.

### Terminal 1 - API

```bash
npm run dev:api
```

API esperada em:

```text
http://localhost:3333
```

Health check:

```text
http://localhost:3333/health
```

### Terminal 2 - Admin web

```bash
npm run dev:admin
```

Admin esperado em:

```text
http://localhost:3000
```

### Terminal 3 - Mobile

```bash
npm run dev:mobile
```

Expo / Metro esperado em:

```text
http://localhost:8081
```

Se a porta estiver ocupada, o Expo pode sugerir outra automaticamente.

## Credenciais iniciais

Administrador seedado no banco:

- email: `admin@duotech.com`
- senha: `admin123`

## Rotas principais

### Web

- `/` -> home estilo Duolingo
- `/dashboard` -> painel administrativo
- `/dashboard/courses` -> gestao de cursos
- `/dashboard/reports` -> relatorios

### API

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `PUT /auth/profile`
- `GET /courses`
- `POST /courses/:courseId/start`
- `GET /courses/:courseId/track`
- `GET /lessons/:lessonId`
- `POST /lessons/:lessonId/submit`
- `GET /me/dashboard`
- `GET /me/history`
- `GET /me/review/:courseId`
- `POST /me/review/:courseId/session`
- `GET /me/notifications`
- `PUT /me/notifications`
- `GET /ranking`
- `GET /admin/courses`
- `POST /admin/courses`
- `PUT /admin/courses/:courseId`
- `DELETE /admin/courses/:courseId`
- `GET /admin/reports`

## Regras de negocio implementadas

- usuario pode fazer Expo e AWS simultaneamente
- progresso e independente por curso
- licao so conclui com minimo de acertos
- trilha libera licao seguinte somente apos a anterior
- streak cresce com estudo diario e reseta por inatividade
- revisao prioriza erros recorrentes
- ranking depende de opt-in do usuario
- evolucao de conteudo nao apaga progresso, pois o admin arquiva em vez de excluir logicamente

## Documentacao

- arquitetura: [docs/architecture.md](docs/architecture.md)
- matriz de requisitos: [docs/requirements-matrix.md](docs/requirements-matrix.md)

## Observacoes importantes

- A persistencia atual e em arquivo JSON para simplificar a avaliacao academica e a execucao local.
- O projeto foi preparado para demonstracao funcional, nao para producao.
- O mobile usa `EXPO_PUBLIC_API_URL`, entao se voce testar em celular fisico talvez precise trocar `localhost` pelo IP da maquina.
- Para persistir na AWS, crie a tabela DynamoDB descrita em `infra/aws/dynamodb.yml` e use `STORE_DRIVER=dynamodb`.

Exemplo:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.10:3333
```

## Scripts uteis

Na raiz:

```bash
npm run dev:api
npm run dev:admin
npm run dev:mobile
npm run lint
```

## Estado atual

O projeto cobre o escopo funcional pedido no enunciado:

- autenticacao
- trilhas
- licoes
- gamificacao
- progresso
- revisao
- administracao
- notificacoes
- relatorios

## Integrantes

- Pedro Vieira
- Murilo Antunes
- Gizela Piere
- Juan Abner
- Julio Coronetti
- Matheus Pulcinelli

## Autor / contexto

Projeto desenvolvido para trabalho academico inspirado no Duolingo, com foco em ensino de tecnologia por trilhas curtas e gamificadas.
