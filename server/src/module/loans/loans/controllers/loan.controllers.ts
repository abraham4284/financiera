import { Request, Response } from "express";
import { createLoanSchema } from "../validation/loan.validation.js";
import { createLoanService } from "../services/loan.create.service.js";

export async function createLoanController(req: Request, res: Response) {
  try {
    const data = createLoanSchema.parse(req.body);
    const result = await createLoanService(data);

    return res.status(201).json({
      status: true,
      message: "Préstamo creado correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.message,
      error,
    });
  }
}
