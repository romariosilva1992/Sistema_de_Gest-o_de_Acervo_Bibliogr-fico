import type { Book } from "../domain/book.js";
import type { BookRepository } from "./book-repository.js";

export class InMemoryBookRepository implements BookRepository {
  private readonly books = new Map<string, Book>();

  findAll(): Book[] {
    return [...this.books.values()];
  }

  findById(id: string): Book | undefined {
    return this.books.get(id);
  }

  findByIsbn(isbn: string): Book | undefined {
    return this.findAll().find((book) => book.isbn === isbn);
  }

  save(book: Book): void {
    this.books.set(book.id, book);
  }

  delete(id: string): boolean {
    return this.books.delete(id);
  }
}
