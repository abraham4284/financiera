import { z } from "zod";

export const createExpenseSchema = z.object({
  transaction_date: z.string().min(1, "La fecha es obligatoria"),
  description: z.string().min(3, "La descripción es obligatoria"),
  idAccount: z.coerce.number().positive("La cuenta es obligatoria"),
  idGlCategorie: z.coerce.number().positive("La categoría es obligatoria"),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
});

export const createTransferSchema = z.object({
  transaction_date: z.string().min(1, "La fecha es obligatoria"),
  description: z.string().min(3, "La descripción es obligatoria"),
  fromAccountId: z.coerce.number().positive("La cuenta origen es obligatoria"),
  toAccountId: z.coerce.number().positive("La cuenta destino es obligatoria"),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
});

export const createAdjustmentSchema = z.object({
  transaction_date: z.string().min(1, "La fecha es obligatoria"),
  description: z.string().min(3, "La descripción es obligatoria"),
  idAccount: z.coerce.number().positive("La cuenta es obligatoria"),
  adjustment_type: z.enum(["INCREASE", "DECREASE"]),
  amount: z.coerce.number().positive("El monto debe ser mayor a 0"),
});