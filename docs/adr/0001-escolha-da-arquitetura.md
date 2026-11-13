# ADR 0001: Escolha da arquitetura

## Status

Aceito

## Contexto

O projeto precisa oferecer uma API backend pequena, fácil de executar localmente
ou via Docker e simples de testar. O domínio escolhido é o cadastro e a consulta
de livros de uma biblioteca.

## Drivers da decisão

- Baixa complexidade operacional para um projeto de nível simples.
- Separação entre regras de negócio, transporte HTTP e persistência.
- Testes automatizados sem dependência de infraestrutura externa.
- Persistência entre reinicializações no modo padrão.

## Opções consideradas

1. Express com armazenamento JSON encapsulado por repositório.
2. Express com SQLite e dependência de banco nativo.
3. Express com PostgreSQL e serviço adicional no Docker Compose.

## Decisão

Usar Node.js com TypeScript e Express, camada de serviço para as regras de
negócio e Repository Pattern para isolar o armazenamento. A implementação padrão
persiste os livros em arquivo JSON; testes usam um repositório em memória. O
arquivo é gravado de forma atômica por meio de arquivo temporário e renomeação.

## Consequências

**Positivas**

- A API sobe com um único serviço e não exige banco externo.
- A interface `BookRepository` permite substituir o armazenamento sem alterar
  regras de negócio ou rotas.
- O repositório em memória torna os testes determinísticos e independentes do
  disco.

**Negativas**

- JSON não é adequado para alta concorrência, grandes volumes ou múltiplas
  instâncias da API; o armazenamento é voltado a fins didáticos.
- As operações de arquivo são síncronas e bloqueiam o event loop por períodos
  curtos.

## Confirmação

Executar `npm run check` e `docker compose up --build`; verificar o CRUD em
`/api/books`, a documentação em `/api-docs` e a persistência após reiniciar o
container.
