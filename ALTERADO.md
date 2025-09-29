# 📦 CRUD JWT JSON - API com Node.js

Esta é uma API BackEnd desenvolvida com Node.js, Express, JWT e persistência em arquivo JSON. Implementa um CRUD de usuários e autenticação baseada em token.

## 🔧 Alterações Realizadas

### 1. **server.js**
**Problemas identificados:**
- Rotas de `items` que não atendiam aos requisitos (CRUD de usuários)
- Toda a lógica centralizada em um único arquivo
- Falta de modularização

**Soluções implementadas:**
- Removidas as rotas de `items`
- Adotada arquitetura modular com rotas separadas
- Configuração básica do Express e porta
- Importação das rotas de autenticação e usuários

### 2. **middleware/auth.js**
**Problemas identificados:**
- Dois arquivos `auth.js` com funções duplicadas
- Chave secreta inconsistente entre arquivos

**Soluções implementadas:**
- Unificado em um único middleware de autenticação
- Implementado `authenticateToken` para verificar JWT
- Chave secreta padronizada

### 3. **utils/db.js**
**Problemas identificadosados:**
- Arquivo com funções JWT, não relacionadas à persistência
- Falta de funções para leitura/escrita no JSON

**Soluções implementadas:**
- Criadas funções `readData()` e `writeData()` para manipulação do arquivo JSON
- Estrutura de dados padronizada: `{ users: [] }`
- Tratamento de erros para arquivo inexistente

### 4. **controllers/authController.js** (NOVO)
**Problemas identificados:**
- Arquivo estava vazio
- Falta de implementação de registro e login

**Soluções implementadas:**
- Função `register()` para cadastrar novos usuários
- Função `login()` para autenticação
- Hash de senhas com bcryptjs
- Geração de token JWT com expiração de 1 hora
- Validação de campos obrigatórios
- Verificação de email duplicado

### 5. **controllers/usersController.js**
**Problemas identificados:**
- Uso de `fs` síncrono (blocking)
- Não utilizava a estrutura modular do utils/db
- Falta de proteção JWT nas rotas
- Senhas sendo retornadas nas respostas

**Soluções implementadas:**
- Refatorado para usar funções assíncronas do `utils/db`
- Implementado CRUD completo: `getAllUsers`, `getUserById`, `updateUser`, `deleteUser`
- Remoção de senhas dos responses
- Tratamento adequado de erros

### 6. **routes/auth.js**
**Problemas identificados:**
- Código estava usando `app` diretamente (deve usar `router`)
- Funções de autenticação misturadas com rotas

**Soluções implementadas:**
- Rotas POST `/auth/register` e POST `/auth/login`
- Importação correta do controller
- Uso do Express Router

### 7. **routes/users.js**
**Problemas identificados:**
- Arquivo continha funções de utilitário JWT
- Falta de rotas protegidas para usuários

**Soluções implementadas:**
- Rotas GET, PUT, DELETE protegidas por JWT
- Aplicação do middleware `authenticateToken` em todas as rotas
- Estrutura correta de rotas

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js instalado
- NPM ou Yarn

### Passo a Passo

1. **Instalação das dependências:**
   ```bash
   npm install express jsonwebtoken bcryptjs uuid
   ```

2. **Estrutura de arquivos:**
   ```
   projeto/
   ├── server.js
   ├── db.json
   ├── middleware/
   │   └── auth.js
   ├── utils/
   │   └── db.js
   ├── controllers/
   │   ├── authController.js
   │   └── usersController.js
   └── routes/
       ├── auth.js
       └── users.js
   ```

3. **Executar o servidor:**
   ```bash
   node server.js
   ```

4. **O servidor estará rodando em:**
   ```
   http://localhost:3000
   ```

## 📡 Endpoints da API

### 🔐 Autenticação

**POST /auth/register** - Registrar novo usuário
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**POST /auth/login** - Fazer login
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### 👥 Usuários (Rotas Protegidas - Requer JWT)

**GET /users** - Listar todos os usuários
```
Headers: Authorization: Bearer <token_jwt>
```

**GET /users/:id** - Buscar usuário por ID
```
Headers: Authorization: Bearer <token_jwt>
```

**PUT /users/:id** - Atualizar usuário
```
Headers: Authorization: Bearer <token_jwt>
```
```json
{
  "nome": "Novo Nome",
  "email": "novo@email.com"
}
```

**DELETE /users/:id** - Deletar usuário
```
Headers: Authorization: Bearer <token_jwt>
```

## 🧪 Testando com Thunder Client

### 1. Configuração do Ambiente
- Instale a extensão Thunder Client no VSCode
- Crie uma nova coleção chamada "CRUD JWT API"

### 2. Fluxo de Teste Recomendado:

**a) Registrar usuário:**
- Método: POST
- URL: `http://localhost:3000/auth/register`
- Body (JSON):
  ```json
  {
    "nome": "Teste User",
    "email": "teste@email.com",
    "senha": "123456"
  }
  ```

**b) Fazer login:**
- Método: POST
- URL: `http://localhost:3000/auth/login`
- Body (JSON):
  ```json
  {
    "email": "teste@email.com",
    "senha": "123456"
  }
  ```
- **Salve o token** retornado na response

**c) Testar rotas protegidas:**
- Adicione header: `Authorization: Bearer <seu_token>`
- Teste as rotas GET, PUT, DELETE em `/users`

### 3. Variáveis de Ambiente no Thunder Client:
Crie variáveis para facilitar os testes:
- `baseUrl`: `http://localhost:3000`
- `token`: (atualize após cada login)

## 🔒 Segurança Implementada

- ✅ Senhas criptografadas com bcryptjs
- ✅ Tokens JWT com expiração de 1 hora
- ✅ Middleware de autenticação em rotas protegidas
- ✅ IDs únicos com UUID
- ✅ Validação de campos obrigatórios
- ✅ Verificação de email duplicado
- ✅ Senhas nunca retornadas nas responses

## 📊 Estrutura do Banco de Dados (db.json)

```json
{
  "users": [
    {
      "id": "uuid-unico",
      "nome": "Nome do Usuário",
      "email": "email@provedor.com",
      "senha": "hash-bcrypt"
    }
  ]
}
```

## 🐛 Solução de Problemas

**Erro 401 - Token não fornecido:**
- Verifique se o header Authorization está no formato: `Bearer <token>`

**Erro 403 - Token inválido:**
- Faça login novamente para gerar um novo token

**Erro 404 - Usuário não encontrado:**
- Verifique se o ID do usuário está correto

**Erro 500 - Erro interno:**
- Verifique se o arquivo `db.json` existe e tem permissão de escrita

## 🔍 Verificação de Funcionamento da Aplicação

Para verificar se a aplicação está funcionando corretamente, siga estes passos:

### 1. **Iniciar o Servidor**
```bash
cd prova3bimpro
npm install
node server.js
```

O servidor deve exibir: `Server running on port 3000`

### 2. **Testar Endpoint de Registro**
Execute o comando curl para registrar um usuário:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Test User","email":"test@example.com","senha":"password123"}'
```

**Resposta esperada:** JSON com `token` e `user` (sem senha).

### 3. **Testar Endpoint de Login**
Use o email e senha registrados:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","senha":"password123"}'
```

**Resposta esperada:** JSON com `token` e `user`.

### 4. **Testar Rotas Protegidas**
Use o token obtido no login para acessar usuários:
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <seu_token_aqui>"
```

**Resposta esperada:** Lista de usuários (sem senhas).

### 5. **Correções Aplicadas**
- **Versão do uuid:** Alterada de `^13.0.0` para `^9.0.0` no `package.json` para compatibilidade com CommonJS.
- Execute `npm install` após a alteração para instalar a versão correta.

Se todos os testes passarem sem erros, a aplicação está funcionando corretamente.

---

**Desenvolvido como parte de exercício prático de API REST com autenticação JWT**

*Usado DeepSeek e BlackBox*