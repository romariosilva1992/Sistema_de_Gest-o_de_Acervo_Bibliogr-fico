import "dotenv/config";
import { z } from "zod";
import { createApp } from "./app.js";
import { logger } from "./observability/logger.js";
import { JsonBookRepository } from "./repositories/json-book-repository.js";

const environmentSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATA_FILE: z.string().min(1).default("./data/books.json"),
});
const environment = environmentSchema.parse(process.env);

const app = createApp(new JsonBookRepository(environment.DATA_FILE));
app.listen(environment.PORT, "0.0.0.0", () => {
  logger.info({ port: environment.PORT }, "API iniciada");
});
