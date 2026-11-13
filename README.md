# Projeto B - Biblioteca API

## Visão geral

Este projeto é uma API REST de domínio único para gestão de livros em uma biblioteca. O objetivo principal é permitir o cadastro, consulta, atualização e remoção de registros com regras de negócio simples e consistentes, preservando integridade, rastreabilidade e facilidade de execução local.

O fluxo principal da aplicação é:

1. O cliente envia requisições HTTP para a API.
2. A camada de roteamento e validação recebe os dados.
3. O serviço de domínio aplica as regras de negócio (por exemplo, ISBN único e validação de campos).
4. O repositório persiste as informações em JSON para manter a solução simples e executável sem banco de dados externo.
5. A API retorna respostas padronizadas em JSON com status HTTP adequados.

## Romario Alves da Silva - engenharia de software 

### Requisitos

- Docker e Docker Compose (recomendado)
- ou Node.js 22+ e npm 10+
- opcionalmente, k6 para teste de carga

### Opção 1: executar com Docker Compose

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Esse comando inicia a API na porta `3000` e monta o ambiente necessário para execução. Para rodar em segundo plano:

```bash
docker compose up --build -d
```

Verifique a API:

```bash
curl http://localhost:3000/health
```

Resposta esperada:

```json
{"status":"ok"}
```

Para encerrar:

```bash
docker compose down
```

Se quiser remover também os dados persistidos em volume, use:

```bash
docker compose down -v
```

### Opção 2: executar localmente

1. Instale as dependências:

```bash
npm ci
```

2. Inicie a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

3. A API ficará disponível em:

```text
http://localhost:3000
```

4. Para rodar a versão compilada:

```bash
npm run build
npm start
```

## Domínio escolhido

O domínio adotado é o de uma biblioteca simples. Cada livro possui atributos como:

- `id`
- `title`
- `author`
- `isbn`
- `createdAt`
- `updatedAt`

A solução foi modelada para representar um cenário real de cadastro e consulta de acervo, com regras de integridade como:

- ISBN obrigatório
- ISBN único por registro
- campos obrigatórios no cadastro
- atualização parcial de dados
- retorno explícito de erro para entradas inválidas

## Testes unitários e de integração

### Executar testes unitários e de integração

```bash
npm test
```

### Executar em modo watch

```bash
npm run test:watch
```

### Validar lint e build

```bash
npm run lint
npm run build
```

### Verificação completa do projeto

```bash
npm run check
```

## Tecnologias utilizadas

- Node.js 22
- TypeScript
- Express 5
- Zod para validação
- Pino para logs estruturados
- Prometheus Client para métricas
- Swagger UI e OpenAPI para documentação
- Vitest + Supertest para testes
- Docker Compose para execução em container
- k6 para teste de carga

## Documentação da API

- Documentação OpenAPI: [docs/openapi.yaml](docs/openapi.yaml)
- ADR: [docs/adr/0001-decisao.md](docs/adr/0001-decisao.md)

## Endpoints principais

| Método | Caminho | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Verifica a saúde da API |
| `GET` | `/api/books` | Lista todos os livros |
| `POST` | `/api/books` | Cria um novo livro |
| `GET` | `/api/books/:id` | Consulta um livro por ID |
| `PATCH` | `/api/books/:id` | Atualiza parcialmente um livro |
| `DELETE` | `/api/books/:id` | Remove um livro |

Exemplo de cadastro:

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"O Hobbit","author":"J. R. R. Tolkien","isbn":"978-8595084742"}'
```

## Observações finais

A solução foi pensada para ser simples de aprender, fácil de executar e adequada ao nível de um projeto de pós graduação acadêmico ou de treinamento em arquitetura de software. No entanto, eu compilei este código que foi organizado em camadas com separação clara entre domínio, serviço, persistência e transporte HTTP.

