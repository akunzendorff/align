# Align Backend

Backend do Align, uma plataforma de gestão financeira e colaboração para casais. Desenvolvido com TypeScript, Express, TypeORM e PostgreSQL.

## 🚀 Funcionalidades

- 🔐 **Autenticação e Autorização**
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

## 🛠 Stack Tecnológica

- **Linguagem:** TypeScript
- **Runtime:** Node.js
- **Framework:** Express.js
- **Banco de Dados:** PostgreSQL
- **ORM:** TypeORM
- **Sistema de Filas:** BullMQ + Redis
- **Autenticação:** JWT
- **Notificações Push:** Firebase Admin SDK
- **Email:** Nodemailer
- **Testes:** Jest

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

- `GET /api/finance/transactions` - Listar transações
- `GET /api/finance/goals` - Listar metas financeiras
- `POST /api/finance/goals` - Criar meta financeira
- `GET /api/finance/categories` - Listar categorias

### Colaboração

- `POST /api/collab/tasks` - Criar tarefa
- `GET /api/collab/tasks` - Listar tarefas
- `POST /api/collab/rewards` - Criar recompensa
- `GET /api/collab/rewards` - Listar recompensas

### Conformidade LGPD

- `POST /api/consent` - Registrar consentimento do usuário
- `POST /api/consent/:type/revoke` - Revogar consentimento específico
- `DELETE /api/user/data` - Excluir dados do usuário (Direito ao Esquecimento)

## 🧪 Testes e Seeds

### Configuração do Ambiente de Teste

1. Crie um banco de dados para testes:
```sql
CREATE DATABASE align_test;
```

2. Configure as variáveis de ambiente de teste no arquivo `.env.test`:
```env
TEST_DB_HOST=localhost
TEST_DB_PORT=5432
TEST_DB_USER=seu_usuario
TEST_DB_PASS=sua_senha
TEST_DB_NAME=align_test
```

### Executando os Testes

1. Executar todos os testes:
```bash
npm test
```

2. Executar testes em modo watch (desenvolvimento):
```bash
npm run test:watch
```

3. Executar testes com cobertura:
```bash
npm run test:coverage
```

### Grupos de Testes

O projeto inclui testes para:
- Autenticação e Autorização
- Rotas Financeiras
- Rotas de Colaboração
- Middleware de Tenant
- Serviços de Notificação

### Seeds de Desenvolvimento

1. Popular o banco com dados iniciais:
```bash
npm run seed
```

Os dados de seed incluem:
- Usuários de exemplo
- Casal com configurações básicas
- Categorias financeiras padrão
- Metas e tarefas de exemplo
- Transações de exemplo

2. Para limpar os dados (em desenvolvimento):
```bash
npm run typeorm schema:drop
npm run migration:run
npm run seed
```

### Estrutura dos Testes

```
test/
├── setup.ts              # Configuração global dos testes
├── auth.test.ts         # Testes de autenticação
├── finance.test.ts      # Testes financeiros
└── collab.test.ts       # Testes de colaboração
```

### Cobertura de Testes

O relatório de cobertura inclui:
- Statements (declarações)
- Branches (condicionais)
- Functions (funções)
- Lines (linhas)

Para visualizar o relatório detalhado:
1. Execute `npm run test:coverage`
2. Abra `coverage/lcov-report/index.html` no navegador

## 🔄 Migrações do Banco de Dados

Gerar uma nova migração:
```bash
npm run migration:generate -- -n NomeDaMigracao
```

Executar migrações pendentes:
```bash
npm run migration:run
```

Reverter última migração:
```bash
npm run migration:revert
```

## 📄 Licença

Este projeto está licenciado sob a Licença ISC.

## 👥 Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de feature (`git checkout -b feature/recurso-incrivel`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona recurso incrível'`)
4. Faça push para a branch (`git push origin feature/recurso-incrivel`)
5. Abra um Pull Request

## ⚠️ Observações de Segurança

- Todas as senhas são hasheadas antes do armazenamento
- Dados sensíveis são criptografados em repouso
- Tokens de API e credenciais são armazenados de forma segura
- Implementação completa de tenant isolation
- Conformidade com LGPD para dados pessoais

## 📊 Monitoramento

O sistema inclui logs detalhados para:
- Tentativas de autenticação
- Sincronização de dados financeiros
- Execução de jobs em background
- Envio de notificações
- Operações de consentimento LGPD

## 🔍 Solução de Problemas

### Logs

Os logs estão disponíveis em:
- Console (desenvolvimento)
- Arquivos de log (produção)
- Monitoramento de jobs do BullMQ

### Comandos Úteis

Verificar status dos workers:
```bash
npm run queue:status
```

Limpar filas:
```bash
npm run queue:clean
```

Verificar logs:
```bash
npm run logs
```