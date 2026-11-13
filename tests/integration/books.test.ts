import { describe, expect, it } from "vitest";
import request from "supertest";
import pino from "pino";
import { createApp } from "../../src/app.js";
import { InMemoryBookRepository } from "../../src/repositories/in-memory-book-repository.js";

describe("API de livros", () => {
  const app = createApp(new InMemoryBookRepository(), pino({ level: "silent" }));

  it("executa o fluxo de cadastro, consulta, atualização e remoção", async () => {
    const createdResponse = await request(app)
      .post("/api/books")
      .send({ title: "Duna", author: "Frank Herbert", isbn: "978-8576573132" });

    expect(createdResponse.status).toBe(201);
    expect(createdResponse.body.data).toMatchObject({
      title: "Duna",
      author: "Frank Herbert",
      isbn: "978-8576573132",
    });
    const id = createdResponse.body.data.id as string;

    const getResponse = await request(app).get(`/api/books/${id}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.data.id).toBe(id);

    const updateResponse = await request(app)
      .patch(`/api/books/${id}`)
      .send({ title: "Duna (edição nova)" });
    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.data.title).toBe("Duna (edição nova)");

    const deleteResponse = await request(app).delete(`/api/books/${id}`);
    expect(deleteResponse.status).toBe(204);
    expect((await request(app).get(`/api/books/${id}`)).status).toBe(404);
  });

  it("valida o corpo e impede cadastro de ISBN duplicado", async () => {
    const input = { title: "Livro", author: "Pessoa", isbn: "unico-1" };
    expect((await request(app).post("/api/books").send({ ...input, title: "" })).status).toBe(400);
    expect((await request(app).post("/api/books").send(input)).status).toBe(201);
    const duplicate = await request(app).post("/api/books").send(input);
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error).toContain("ISBN");
  });
});
