import { Request, Response } from "express";
import { createLoanPaymentSchema } from "../validation/loanPayment.validation.js";
import { createLoanPaymentService } from "../services/loanPayment.create.service.js";

export async function createLoanPaymentController(req: Request, res: Response) {
  try {
    const data = createLoanPaymentSchema.parse(req.body);

    const result = await createLoanPaymentService(data);

    return res.status(201).json({
      status: true,
      message: "Pago registrado correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
}
