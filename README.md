# Align

O Align é uma plataforma de gestão financeira e colaboração para casais. Este repositório contém o `back-end` (API RESTful) e o `front-end` (aplicação web em React).

## 🚀 Funcionalidades

### Back-end

O back-end é responsável pela lógica de negócio, segurança dos dados e integrações.

- 🔐 **Autenticação e Segurança**
  - Autenticação baseada em JWT
  - Autorização baseada em tenant
  - Conformidade com LGPD e gestão de consentimento
  
- 💰 **Gestão Financeira**
  - Integração com contas bancárias
  - Sincronização de transações
  - Categorização personalizada
  - Regras de alocação de orçamento
  
- 👥 **Colaboração entre Casais**
  - Metas financeiras compartilhadas
  - Gestão de tarefas
  - Sistema de recompensas
  - Acompanhamento de progresso
  
- 📱 **Notificações**
  - Notificações por email
  - Notificações push (Firebase)
  - Lembretes de tarefas
  - Atualizações de progresso das metas

### Front-end

A interface do usuário é uma Single Page Application (SPA) moderna e responsiva.

- **Interface Intuitiva:** Foco em usabilidade para facilitar a gestão financeira conjunta.
- **Visualização de Dados:** Dashboards e gráficos para acompanhamento de metas e despesas.
- **Componentização:** Interface construída com componentes reutilizáveis.

## 🛠️ Stack Tecnológica

### Back-end
- **Linguagem e Runtime:** TypeScript, Node.js
- **Framework e ORM:** Express.js, TypeORM
- **Banco de Dados:** PostgreSQL
- **Filas e Cache:** BullMQ, Redis
- **Testes:** Jest, Supertest

### Front-end
- **Framework:** React
- **Linguagem:** TypeScript
- **Gerenciamento de Estado:** Zustand
- **Roteamento:** React Router
- **Estilização:** Tailwind CSS

## 🏗 Estrutura do Projeto

```
src/
├── config/         # Arquivos de configuração
├── controllers/    # Controladores de rotas
├── middleware/     # Middlewares do Express
├── models/         # Entidades do TypeORM
├── routes/         # Rotas do Express
├── services/       # Lógica de negócio
├── utils/         # Funções utilitárias
├── queues/        # Definições de filas BullMQ
└── workers/       # Workers para jobs em background
```

## 🚦 Começando

### Pré-requisitos

- Node.js 16+
- PostgreSQL 13+
- Redis 6+ (para filas)
- Projeto Firebase (para notificações push)

### Instalação e Configuração

1. Clone o repositório:
```bash
git clone https://github.com/akunzendorff/align.git
cd align
```

2. Instale as dependências de produção:
```bash
# Dependências principais
npm install express typeorm pg redis bullmq firebase-admin nodemailer

# Dependências do TypeScript
npm install typescript ts-node @types/node @types/express -D

# Dependências de segurança e utilidades
npm install bcrypt jsonwebtoken cors dotenv
npm install @types/bcrypt @types/jsonwebtoken @types/cors -D
```

3. Instale as dependências de desenvolvimento e teste:
```bash
# Ferramentas de teste
npm install jest @types/jest ts-jest supertest @types/supertest -D

# Ferramentas de seed
npm install typeorm-seeding -D

# Ferramentas de desenvolvimento
npm install nodemon -D
```

3. Crie um arquivo `.env`:
```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@localhost:5432/align_db

# JWT
JWT_SECRET=sua-chave-secreta

# Redis (para BullMQ)
REDIS_URL=redis://localhost:6379

# Firebase (opcional)
FIREBASE_PROJECT_ID=seu-project-id
FIREBASE_PRIVATE_KEY=sua-private-key
FIREBASE_CLIENT_EMAIL=seu-client-email

# Email (opcional)
SMTP_HOST=smtp.exemplo.com
SMTP_PORT=587
SMTP_USER=seu-email
SMTP_PASS=sua-senha

# Criptografia
ENCRYPTION_KEY=sua-chave-de-criptografia
```

4. Execute as migrações do banco de dados:
```bash
npm run migration:run
```

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

### Produção

Build e inicialização para produção:
```bash
npm run build
npm start
```

## 📚 Documentação da API

### Autenticação

- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/refresh-token` - Atualizar token JWT

### Finanças

- `PATCH /api/finance/goals/:id` - Adicionar progresso a uma meta

### Colaboração

- `POST /api/collab/tasks` - Criar tarefa
- `GET /api/collab/tasks` - Listar tarefas
- `POST /api/collab/rewards` - Criar recompensa
- `GET /api/collab/rewards` - Listar recompensas

### Conformidade LGPD

- `POST /api/consent` - Registrar consentimento do usuário

##  Licença

Este projeto está licenciado sob a Licença ISC.