const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Biblioteca API",
    version: "1.0.0",
    description: "API para cadastro e consulta de livros.",
  },
  servers: [{ url: "http://localhost:3000" }],
  paths: {
    "/api/books": {
      get: {
        summary: "Lista todos os livros",
        responses: {
          "200": {
            description: "Lista de livros",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { type: "array", items: { $ref: "#/components/schemas/Book" } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Cadastra um livro",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateBook" },
            },
          },
        },
        responses: {
          "201": { description: "Livro cadastrado" },
          "400": { description: "Dados inválidos" },
          "409": { description: "ISBN já cadastrado" },
        },
      },
    },
    "/api/books/{id}": {
      get: {
        summary: "Consulta um livro",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "200": { description: "Livro encontrado" },
          "404": { description: "Livro não encontrado" },
        },
      },
      patch: {
        summary: "Atualiza parcialmente um livro",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateBook" },
            },
          },
        },
        responses: {
          "200": { description: "Livro atualizado" },
          "404": { description: "Livro não encontrado" },
          "409": { description: "ISBN já cadastrado" },
        },
      },
      delete: {
        summary: "Remove um livro",
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
        responses: {
          "204": { description: "Livro removido" },
          "404": { description: "Livro não encontrado" },
        },
      },
    },
  },
  components: {
    schemas: {
      CreateBook: {
        type: "object",
        required: ["title", "author", "isbn"],
        properties: {
          title: { type: "string", example: "O Hobbit" },
          author: { type: "string", example: "J. R. R. Tolkien" },
          isbn: { type: "string", example: "978-8595084742" },
        },
      },
      UpdateBook: {
        type: "object",
        minProperties: 1,
        properties: {
          title: { type: "string" },
          author: { type: "string" },
          isbn: { type: "string" },
        },
      },
      Book: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          author: { type: "string" },
          isbn: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
} as const;

export default openApiDocument;
