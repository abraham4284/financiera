import { z } from "zod";

const accountTypeSchema = z.enum([
  "CASH",
  "BANK",
  "WALLET",
  "OTHER",
  "LOAN_RECEIVABLE",
  "EQUITY",
]);

const moneySchema = z
  .string()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: "El saldo debe ser numérico",
  })
  .refine((value) => Number(value) >= 0, {
    message: "El saldo inicial no puede ser negativo",
  });

export const accountIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID de cuenta inválido"),
});

export const createAccountSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  type: accountTypeSchema,
  currency: z.string().length(3, "La moneda debe tener 3 caracteres").default("ARS"),
  balance: moneySchema.default("0.00"),
});

export const updateAccountSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(120),
  type: accountTypeSchema,
  currency: z.string().length(3, "La moneda debe tener 3 caracteres").default("ARS"),
});

export const toggleAccountStatusSchema = z.object({
  is_active: z.union([z.literal(0), z.literal(1)]),
});