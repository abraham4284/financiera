import { z } from "zod";

export const createLoanPaymentSchema = z.object({
  payment_date: z.string(),
  amount: z
    .string()
    .refine((v) => Number(v) > 0, "El monto debe ser mayor a 0"),
  payment_method: z.enum([
    "CASH",
    "TRANSFER",
    "BANK_DEPOSIT",
    "MERCADO_PAGO",
    "CARD",
    "OTHER",
  ]),
  reference: z.string().optional(),
  received_by: z.string().optional(),
  idLoans: z.number(),
  idAccount: z.number(),
  idGlCategorie: z.number(),
});