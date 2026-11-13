import { z } from "zod";

export const bookSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().min(1),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Book = z.infer<typeof bookSchema>;

export type CreateBookInput = {
  title: string;
  author: string;
  isbn: string;
};

export type UpdateBookInput = {
  title?: string | undefined;
  author?: string | undefined;
  isbn?: string | undefined;
};
