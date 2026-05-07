import { z } from "zod";

export const voidLoanParamsSchema = z.object({
  id: z.coerce.number().int().positive("ID de préstamo inválido"),
});

export const voidLoanBodySchema = z.object({
  void_notes: z
    .string()
    .min(5, "Debe indicar un motivo de anulación más descriptivo")
    .max(255, "El motivo no puede superar los 255 caracteres"),
});