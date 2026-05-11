import { z } from "zod";

export const glCategoryIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID de categoría inválido"),
});

export const createGlCategorySchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres").max(120),
  description: z.string().max(255).nullable().optional(),
  nature: z.enum(["INCOME", "EXPENSE"]),
});

export const updateGlCategorySchema = createGlCategorySchema;

export const toggleGlCategoryStatusSchema = z.object({
  is_active: z.union([z.literal(0), z.literal(1)]),
});