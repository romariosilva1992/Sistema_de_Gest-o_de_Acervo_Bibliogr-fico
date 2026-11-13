# ADR 0001: Escolha da arquitetura da API de biblioteca

- Status: Aceito
- Date: 2026-11-13

## Contexto

O projeto precisa de uma API simples, eficiente, fácil de executar localmente e com testes automatizados. O domínio escolhido é a gestão de livros de uma biblioteca, com operações de cadastro, consulta, atualização e remoção.

Também precisamos manter a solução didática e organizada em camadas, sem depender de infraestrutura complexa como banco de dados externo em um primeiro momento. A equipe deseja reduzir custos operacionais e facilitar a manutenção do código, preservando a possibilidade de evoluir para outros armazenamentos futuramente.

## Decisão

Usar uma arquitetura em camadas com Node.js + TypeScript + Express, seguindo os princípios SOLID e o padrão Repository Pattern.

### Detalhes da decisão

- A camada de domínio fica responsável pelas regras de negócio e entidades.
- O serviço (`BookService`) concentra a lógica do caso de uso.
- O repositório abstrai o armazenamento, permitindo trocar a implementação sem afetar a regra de negócio.
- A persistência padrão será em arquivo JSON para manter a execução leve e autônoma.
- Em testes, será utilizado um repositório em memória para garantir isolamento e previsibilidade.

## Alternativas consideradas

### 1. Persistência direta em arquivo pela camada HTTP

Não foi escolhida porque misturava responsabilidades e tornava a lógica mais difícil de testar e evoluir.

### 2. Uso de SQLite ou PostgreSQL desde o início

Embora seja uma opção robusta, exigiria mais infraestrutura e complexidade operacional. Para um projeto de nível simples, isso aumentaria o esforço inicial sem necessidade imediata.

### 3. Arquitetura monolítica simples sem separação de camadas

Também foi descartada, pois dificultaria a manutenção e a expansão do código conforme o domínio crescesse.

## Consequências positivas

- Melhor organização do código por responsabilidade.
- Testes mais simples e determinísticos.
- Facilidade de trocar a implementação de persistência no futuro.
- Execução local e com Docker muito simples.
- Menor curva de operação para um projeto acadêmico ou de aprendizagem.

## Consequências negativas

- O uso de JSON não é ideal para alta concorrência ou ambientes com grande volume de dados.
- A persistência em arquivo pode apresentar limitações em cenários de múltiplas instâncias.
- O projeto foi desenhado para demonstrar arquitetura e boa prática, não para produção de larga escala.

## Observação de implementação

A aplicação foi estruturada com separação clara entre:

- `src/domain` para entidades e erros de domínio
- `src/services` para regras de negócio
- `src/repositories` para acesso a dados
- `src/app.ts` para montagem da aplicação
- `src/server.ts` para inicialização do servidor

Essa divisão atende ao objetivo de manter o backend simples, sustentável e alinhado ao padrão de arquitetura de software esperado pelo curso.
