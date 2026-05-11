import { Request, Response } from "express";
import {
  accountIdParamSchema,
  createAccountSchema,
  toggleAccountStatusSchema,
  updateAccountSchema,
} from "../validation/account.validation.js";
import {
  createAccountService,
  getAccountByIdService,
  getAccountsService,
  toggleAccountStatusService,
  updateAccountService,
} from "../services/account.service.js";

export async function createAccountController(req: Request, res: Response) {
  try {
    const data = createAccountSchema.parse(req.body);
    const result = await createAccountService(data);

    return res.status(201).json({
      status: true,
      message: "Cuenta creada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function getAccountsController(req: Request, res: Response) {
  try {
    const onlyActive = req.query.onlyActive !== "false";
    const result = await getAccountsService(onlyActive);

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function getAccountByIdController(req: Request, res: Response) {
  try {
    const params = accountIdParamSchema.parse(req.params);
    const result = await getAccountByIdService(params.id);

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Cuenta no encontrada",
      });
    }

    return res.status(200).json({
      status: true,
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function updateAccountController(req: Request, res: Response) {
  try {
    const params = accountIdParamSchema.parse(req.params);
    const data = updateAccountSchema.parse(req.body);

    const result = await updateAccountService(params.id, data);

    return res.status(200).json({
      status: true,
      message: "Cuenta actualizada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function toggleAccountStatusController(
  req: Request,
  res: Response,
) {
  try {
    const params = accountIdParamSchema.parse(req.params);
    const data = toggleAccountStatusSchema.parse(req.body);

    const result = await toggleAccountStatusService(params.id, data);

    return res.status(200).json({
      status: true,
      message:
        data.is_active === 1
          ? "Cuenta activada correctamente"
          : "Cuenta desactivada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}