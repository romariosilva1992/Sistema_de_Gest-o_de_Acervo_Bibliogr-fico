import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { bookSchema, type Book } from "../domain/book.js";
import type { BookRepository } from "./book-repository.js";
import { z } from "zod";

const booksSchema = z.array(bookSchema);

export class JsonBookRepository implements BookRepository {
  private books: Book[];

  constructor(private readonly filePath: string) {
    mkdirSync(dirname(filePath), { recursive: true });
    try {
      this.books = booksSchema.parse(JSON.parse(readFileSync(filePath, "utf8")));
    } catch (error) {
      if (isMissingFile(error)) {
        this.books = [];
        this.persist();
      } else {
        throw error;
      }
    }
  }

  findAll(): Book[] {
    return [...this.books];
  }

  findById(id: string): Book | undefined {
    return this.books.find((book) => book.id === id);
  }

  findByIsbn(isbn: string): Book | undefined {
    return this.books.find((book) => book.isbn === isbn);
  }

  save(book: Book): void {
    const index = this.books.findIndex((item) => item.id === book.id);
    if (index === -1) {
      this.books.push(book);
    } else {
      this.books[index] = book;
    }
    this.persist();
  }

  delete(id: string): boolean {
    const originalLength = this.books.length;
    this.books = this.books.filter((book) => book.id !== id);
    if (this.books.length === originalLength) return false;
    this.persist();
    return true;
  }

  private persist(): void {
    const temporaryPath = `${this.filePath}.tmp`;
    writeFileSync(temporaryPath, JSON.stringify(this.books, null, 2), "utf8");
    renameSync(temporaryPath, this.filePath);
  }
}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}
