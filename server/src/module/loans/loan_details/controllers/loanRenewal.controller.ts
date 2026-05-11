import { Request, Response } from "express";
import {
  createLoanRenewalService,
  getMensualLibreRenewalProposalService,
} from "../services/loanRenewal.service.js";
import { createLoanRenewalSchema } from "../validation/loanRenewal.validation.js";

export async function getLoanRenewalProposalController(
  req: Request,
  res: Response,
) {
  try {
    const loanId = Number(req.params.loanId);
    if (!loanId) {
      return res.status(400).json({
        status: false,
        message: "ID de préstamo inválido",
      });
    }

    const result = await getMensualLibreRenewalProposalService(loanId);
    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
}

export async function createLoanRenewalController(req: Request, res: Response) {
  try {
    const data = createLoanRenewalSchema.parse(req.body);
    const result = await createLoanRenewalService(data);

    return res.status(201).json({
      status: true,
      message: "Renovación creada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
    });
  }
}
