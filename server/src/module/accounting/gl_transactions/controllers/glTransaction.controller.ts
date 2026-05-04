import { Request, Response } from "express";
import {
  createAdjustmentSchema,
  createExpenseSchema,
  createTransferSchema,
} from "../validation/glTransaction.validation.js";
import {
  createExpenseService,
  createTransferService,
  createAdjustmentService,
  getGlTransactionsService,
  getGlTransactionByIdService,
} from "../services/index.js";

export async function createExpenseController(req: Request, res: Response) {
  try {
    const data = createExpenseSchema.parse(req.body);
    const result = await createExpenseService(data);

    return res.status(201).json({
      status: true,
      message: "Gasto registrado correctamente",
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

export async function createTransferController(req: Request, res: Response) {
  try {
    const data = createTransferSchema.parse(req.body);
    const result = await createTransferService(data);

    return res.status(201).json({
      status: true,
      message: "Transferencia registrada correctamente",
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

export async function createAdjustmentController(req: Request, res: Response) {
  try {
    const data = createAdjustmentSchema.parse(req.body);
    const result = await createAdjustmentService(data);

    return res.status(201).json({
      status: true,
      message: "Ajuste registrado correctamente",
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

export async function getGlTransactionsController(
  _req: Request,
  res: Response,
) {
  try {
    const result = await getGlTransactionsService();

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message,
      error,
    });
  }
}

export async function getGlTransactionByIdController(
  req: Request,
  res: Response,
) {
  try {
    const idGlTransaction = Number(req.params.idGlTransaction);
    if (!idGlTransaction) {
      return res.status(400).json({
        status: false,
        message: "ID de transacción inválido",
      });
    }

    const result = await getGlTransactionByIdService(idGlTransaction);

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.message,
      error,
    });
  }
}
