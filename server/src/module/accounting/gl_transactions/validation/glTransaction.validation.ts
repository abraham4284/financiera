import { z } from "zod";

const amountSchema = z
  .string()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: "El monto debe ser numérico",
  })
  .refine((value) => Number(value) > 0, {
    message: "El monto debe ser mayor a 0",
  });

const dateSchema = z.string().min(1, "La fecha es obligatoria");

export const createExpenseSchema = z.object({
  transaction_date: dateSchema,
  description: z.string().min(3).max(255),
  idAccount: z.number().int().positive(),
  idGlCategorie: z.number().int().positive(),
  amount: amountSchema,
  note: z.string().max(255).optional(),
});

export const createTransferSchema = z
  .object({
    transaction_date: dateSchema,
    description: z.string().min(3).max(255),
    idAccountFrom: z.number().int().positive(),
    idAccountTo: z.number().int().positive(),
    idGlCategorie: z.number().int().positive(),
    amount: amountSchema,
    note: z.string().max(255).optional(),
  })
  .refine((data) => data.idAccountFrom !== data.idAccountTo, {
    message: "La cuenta origen y destino no pueden ser la misma",
    path: ["idAccountTo"],
  });

export const createAdjustmentSchema = z.object({
  transaction_date: dateSchema,
  description: z.string().min(3).max(255),
  idAccount: z.number().int().positive(),
  idGlCategorie: z.number().int().positive(),
  entry_type: z.enum(["DEBIT", "CREDIT"]),
  amount: amountSchema,
  note: z.string().max(255).optional(),
});