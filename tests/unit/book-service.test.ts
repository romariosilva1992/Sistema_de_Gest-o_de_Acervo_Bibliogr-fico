import { describe, expect, it } from "vitest";
import { AppError } from "../../src/domain/errors.js";
import { InMemoryBookRepository } from "../../src/repositories/in-memory-book-repository.js";
import { BookService } from "../../src/services/book-service.js";

describe("BookService", () => {
  it("cria um livro e preserva a data de criação ao atualizar", () => {
    const service = new BookService(new InMemoryBookRepository());
    const created = service.create({
      title: "O Hobbit",
      author: "J. R. R. Tolkien",
      isbn: "978-8595084742",
    });

    const updated = service.update(created.id, { title: "O Hobbit: edição revisada" });

    expect(updated.title).toBe("O Hobbit: edição revisada");
    expect(updated.createdAt).toBe(created.createdAt);
    expect(updated.updatedAt).toBeTruthy();
  });

  it("rejeita ISBN duplicado e atualizações para ISBN já utilizado", () => {
    const service = new BookService(new InMemoryBookRepository());
    const first = service.create({ title: "Livro A", author: "Autora A", isbn: "isbn-1" });
    const second = service.create({ title: "Livro B", author: "Autor B", isbn: "isbn-2" });

    expect(() =>
      service.create({ title: "Livro C", author: "Autor C", isbn: "isbn-1" }),
    ).toThrow(AppError);
    expect(() => service.update(second.id, { isbn: first.isbn })).toThrow(
      "Já existe um livro cadastrado com este ISBN.",
    );
  });

  it("retorna erro 404 ao consultar um livro inexistente", () => {
    const service = new BookService(new InMemoryBookRepository());

    expect(() => service.get("nao-existe")).toThrow(
      expect.objectContaining({ statusCode: 404 }),
    );
  });
});
