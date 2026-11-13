import express, { type ErrorRequestHandler } from "express";
import { pinoHttp } from "pino-http";
import type { Logger } from "pino";
import swaggerUi from "swagger-ui-express";
import { z, ZodError } from "zod";
import { AppError } from "./domain/errors.js";
import { logger } from "./observability/logger.js";
import { metricsMiddleware, registry } from "./observability/metrics.js";
import type { BookRepository } from "./repositories/book-repository.js";
import { BookService } from "./services/book-service.js";
import openApiDocument from "./openapi.js";

const createBookSchema = z.object({
  title: z.string().trim().min(1).max(200),
  author: z.string().trim().min(1).max(200),
  isbn: z.string().trim().min(1).max(20),
});

const updateBookSchema = createBookSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Informe ao menos um campo para atualizar.",
);

export function createApp(repository: BookRepository, appLogger: Logger = logger) {
  const app = express();
  const books = new BookService(repository);

  app.use(pinoHttp({ logger: appLogger }));
  app.use(express.json({ limit: "1mb" }));
  app.use(metricsMiddleware);

  app.get("/health", (_request, response) => {
    response.json({ status: "ok" });
  });

  app.get("/metrics", async (_request, response, next) => {
    try {
      response.set("Content-Type", registry.contentType);
      response.end(await registry.metrics());
    } catch (error) {
      next(error);
    }
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.get("/api/books", (_request, response) => {
    response.json({ data: books.list() });
  });

  app.post("/api/books", (request, response) => {
    const input = createBookSchema.parse(request.body);
    response.status(201).json({ data: books.create(input) });
  });

  app.get("/api/books/:id", (request, response) => {
    response.json({ data: books.get(request.params.id) });
  });

  app.patch("/api/books/:id", (request, response) => {
    const input = updateBookSchema.parse(request.body);
    response.json({ data: books.update(request.params.id, input) });
  });

  app.delete("/api/books/:id", (request, response) => {
    books.remove(request.params.id);
    response.status(204).end();
  });

  const errorHandler: ErrorRequestHandler = (error, _request, response, next) => {
    if (response.headersSent) {
      next(error);
      return;
    }
    if (error instanceof ZodError) {
      response.status(400).json({
        error: "Dados inválidos.",
        details: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }
    if (error instanceof AppError) {
      response.status(error.statusCode).json({ error: error.message });
      return;
    }
    if (error instanceof SyntaxError && "body" in error) {
      response.status(400).json({ error: "Corpo JSON inválido." });
      return;
    }
    appLogger.error({ err: error }, "Erro não tratado na requisição");
    response.status(500).json({ error: "Erro interno do servidor." });
  };
  app.use(errorHandler);

  return app;
}
