import type { Book } from "../domain/book.js";

export interface BookRepository {
  findAll(): Book[];
  findById(id: string): Book | undefined;
  findByIsbn(isbn: string): Book | undefined;
  save(book: Book): void;
  delete(id: string): boolean;
}
