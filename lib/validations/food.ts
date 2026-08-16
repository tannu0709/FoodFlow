import { z } from "zod";

export const foodSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Food name must be at least 2 characters")
    .max(100, "Food name is too long"),

  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(500, "Description is too long"),

  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(50, "Category is too long"),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .max(100000, "Price is too high"),

  image: z.string().trim().optional().or(z.literal("")),

  available: z.boolean().default(true),
});
