import { Request, Response } from "express";
import {
  voidLoanBodySchema,
  voidLoanParamsSchema,
} from "../validation/loanVoid.validation.js";
import { voidLoanService } from "../services/loanVoid.service.js";

export async function voidLoanController(req: Request, res: Response) {
  try {
    const params = voidLoanParamsSchema.parse(req.params);
    const body = voidLoanBodySchema.parse(req.body);

    const result = await voidLoanService({
      loanId: params.id,
      void_notes: body.void_notes,
    });

    return res.status(200).json({
      status: true,
      message: "Préstamo anulado correctamente. Los fondos fueron reintegrados a la cuenta de origen.",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
}