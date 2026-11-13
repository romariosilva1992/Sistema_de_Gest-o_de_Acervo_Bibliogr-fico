import { randomUUID } from "node:crypto";
import type {
  Book,
  CreateBookInput,
  UpdateBookInput,
} from "../domain/book.js";
import { AppError } from "../domain/errors.js";
import type { BookRepository } from "../repositories/book-repository.js";

export class BookService {
  constructor(private readonly repository: BookRepository) {}

  list(): Book[] {
    return this.repository.findAll();
  }

  get(id: string): Book {
    const book = this.repository.findById(id);
    if (!book) throw new AppError("Livro não encontrado.", 404);
    return book;
  }

  create(input: CreateBookInput): Book {
    if (this.repository.findByIsbn(input.isbn)) {
      throw new AppError("Já existe um livro cadastrado com este ISBN.", 409);
    }
    const now = new Date().toISOString();
    const book: Book = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
    this.repository.save(book);
    return book;
  }

  update(id: string, input: UpdateBookInput): Book {
    const current = this.get(id);
    if (input.isbn && input.isbn !== current.isbn && this.repository.findByIsbn(input.isbn)) {
      throw new AppError("Já existe um livro cadastrado com este ISBN.", 409);
    }
    const updated: Book = {
      ...current,
      title: input.title ?? current.title,
      author: input.author ?? current.author,
      isbn: input.isbn ?? current.isbn,
      updatedAt: new Date().toISOString(),
    };
    this.repository.save(updated);
    return updated;
  }

  remove(id: string): void {
    if (!this.repository.delete(id)) throw new AppError("Livro não encontrado.", 404);
  }
}
