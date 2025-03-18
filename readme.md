# Projeto de Autenticação JWT

Este é um projeto completo de autenticação usando JSON Web Tokens (JWT) que consiste em uma API construída com Express.js e uma interface frontend em HTML/JavaScript. O sistema demonstra como implementar autenticação segura em aplicações web modernas.

## 📋 Conteúdo

- [Visão Geral](#visão-geral)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Instalação e Configuração](#instalação-e-configuração)
- [Rotas da API](#rotas-da-api)
- [Fluxo de Autenticação](#fluxo-de-autenticação)
- [Explicação do Código](#explicação-do-código)
- [Frontend](#frontend)
- [Melhorias Futuras](#melhorias-futuras)

## 🔍 Visão Geral

Este projeto implementa um sistema de autenticação baseado em JWT, permitindo que apenas usuários autenticados acessem determinadas rotas protegidas. O sistema inclui funcionalidades de login, logout e acesso a recursos protegidos.

O JWT (JSON Web Token) é um padrão aberto (RFC 7519) que define uma maneira compacta e autossuficiente para transmitir informações com segurança entre as partes como um objeto JSON. Essas informações podem ser verificadas e confiáveis porque são assinadas digitalmente.

## 💻 Tecnologias Utilizadas

### Backend:
- Node.js
- Express.js
- jsonwebtoken (para geração e verificação de tokens)
- dotenv-safe (para gerenciamento de variáveis de ambiente)

### Frontend:
- HTML5
- CSS3
- JavaScript (vanilla/puro)
- Fetch API (para requisições HTTP)

## 📁 Estrutura do Projeto

```
jwt_learning_project/
│
├── index.js          # Arquivo principal do servidor Express
├── db.js             # Simulação de banco de dados
├── .env              # Variáveis de ambiente (não versionado)
├── .env.example      # Exemplo de variáveis de ambiente necessárias
├── package.json      # Dependências do projeto
└── frontend/
    └── index.html    # Interface de usuário para testar a API
```

## 🚀 Instalação e Configuração

### Pré-requisitos
- Node.js (v12+)
- npm ou yarn

### Passos para instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd jwt_learning_project
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env` baseado no `.env.example`:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` e defina uma chave secreta forte:
```
SECRET=sua_chave_secreta_muito_forte
```

5. Inicie o servidor:
```bash
npm start
```

6. O servidor estará rodando em `http://localhost:3000`

7. Para testar com o frontend, abra o arquivo `frontend/index.html` em seu navegador.

## 🌐 Rotas da API

### Rotas Públicas

- **GET /** - Rota de teste para verificar se o servidor está funcionando
  - Resposta: `{ message: "Tudo ok por aqui!" }`

- **POST /login** - Autenticar usuário e obter token
  - Body: `{ "user": "nome_do_usuario", "password": "senha" }`
  - Resposta de sucesso: `{ "auth": true, "token": "jwt_token_aqui" }`
  - Resposta de erro: `{ "message": "Login inválido!" }`

- **POST /logout** - Finalizar a sessão
  - Resposta: `{ "auth": false, "token": null }`

### Rotas Protegidas

- **GET /cliente** - Obter lista de clientes (requer autenticação)
  - Header: `Authorization: Bearer jwt_token_aqui`
  - Resposta de sucesso: Array de objetos cliente
  - Resposta de erro: `{ "auth": false, "message": "Failed to authenticate token." }`

## 🔐 Fluxo de Autenticação

1. **Login**: O usuário envia suas credenciais para `/login`
2. **Verificação**: O servidor verifica as credenciais no banco de dados
3. **Geração do Token**: Se as credenciais forem válidas, o servidor gera um JWT contendo o ID do usuário
4. **Armazenamento**: O cliente armazena o token (normalmente no localStorage)
5. **Requisições Autenticadas**: Para acessar rotas protegidas, o cliente inclui o token no header `Authorization`
6. **Verificação do Token**: O middleware `verifyJWT` valida o token em cada requisição para rotas protegidas
7. **Acesso Concedido**: Se o token for válido, o acesso ao recurso é permitido
8. **Expiração**: Após o tempo definido (100 segundos neste exemplo), o token expira e o usuário precisa fazer login novamente
9. **Logout**: O cliente descarta o token quando o usuário faz logout

## 💡 Explicação do Código

### Middleware de Verificação JWT

```javascript
function verifyJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ auth: false, message: 'No token provided.' });
  
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ auth: false, message: 'Token format invalid.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    if (err) return res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
}
```

Este middleware:
1. Extrai o token do header `Authorization`
2. Verifica se o token existe e está no formato correto
3. Valida o token usando a biblioteca JWT
4. Se válido, adiciona o ID do usuário à requisição e passa para o próximo middleware

### Rota de Login

```javascript
app.post('/login', (req, res, next) => {
  try {
    for (let i in db.clientes) {
      if (req.body.user == db.clientes[i].nome && req.body.password == db.clientes[i].password) {
        const id = db.clientes[i].id;
        const token = jwt.sign({id}, process.env.SECRET, {
          expiresIn: 100
        });
        return res.json({auth: true, token: token});
      }
    }
    
    return res.status(500).json({message: "Login inválido!"});
  }
  catch(error) {
    console.log(`Erro: ${error}`);
    return res.status(500).json({
      message: "Erro ao realizar o login",
      error: error.message,
    });
  }
});
```

Esta rota:
1. Recebe credenciais do usuário
2. Verifica se as credenciais correspondem a algum cliente no banco de dados
3. Se válidas, cria um token JWT contendo o ID do cliente
4. Retorna o token para o cliente

## 🖥️ Frontend

O frontend é uma aplicação HTML/JavaScript que permite testar todas as funcionalidades da API:

1. **Login**: Interface para inserir credenciais e obter um token
2. **Testar Rota Pública**: Botão para acessar a rota pública (`/`)
3. **Testar Rota Protegida**: Botão para acessar a rota protegida (`/cliente`)
4. **Logout**: Botão para fazer logout

A aplicação armazena o token no localStorage do navegador e o inclui automaticamente nas requisições para rotas protegidas.

## 🔧 Melhorias Futuras

Este projeto é uma demonstração básica de autenticação JWT. Para um ambiente de produção, considere as seguintes melhorias:

1. **Segurança Avançada**:
   - Implementar hash de senhas (bcrypt)
   - Usar HTTPS
   - Implementar proteção contra CSRF
   - Adicionar rate limiting para prevenir ataques de força bruta

2. **Funcionalidades Adicionais**:
   - Refresh tokens para sessões mais longas
   - Revogação de tokens
   - Múltiplos níveis de acesso/permissões
   - Recuperação de senha

3. **Persistência de Dados**:
   - Substituir o banco de dados simulado por um banco de dados real (MongoDB, PostgreSQL, etc.)

4. **Frontend Aprimorado**:
   - Implementar usando frameworks modernos (React, Vue, Angular)
   - Adicionar validação de formulários
   - Melhorar a experiência do usuário com feedback visual

---

## 📚 Recursos Adicionais

- [JWT.io](https://jwt.io/) - Ferramenta para decodificar e depurar JWTs
- [RFC 7519](https://tools.ietf.org/html/rfc7519) - Especificação JSON Web Token
- [Express.js Documentation](https://expressjs.com/)
- [Best Practices for Authentication](https://blog.gitguardian.com/authentication-and-authorization/)

---

Desenvolvido como um projeto de aprendizado para entender autenticação JWT.