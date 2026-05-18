import e, { Request, Response } from "express";
import {
  clientIdParamSchema,
  createClientSchema,
  toggleClientStatusSchema,
  updateClientSchema,
} from "../validation/client.validation.js";
import {
  createClientService,
  getClientByIdService,
  getClientsService,
  toggleClientStatusService,
  updateClientService,
} from "../services/client.service.js";
import { ZodError } from "zod";
import { formatZodErrors } from "@/helpers/handleZodError.js";

export async function createClientController(req: Request, res: Response) {
  try {
    const data = createClientSchema.parse(req.body);
    const result = await createClientService(data);

    return res.status(201).json({
      status: true,
      message: "Cliente creado correctamente",
      data: result,
    });
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        status: false,
        message: "Error de validación",
        errors: formatZodErrors(error),
      });
    }

    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message || "Error inesperado",
    });
  }
}

export async function getClientsController(req: Request, res: Response) {
  try {
    const onlyActive = req.query.onlyActive !== "false";

    const idZone = req.query.idZone ? Number(req.query.idZone) : undefined;

    if (req.query.idZone && Number.isNaN(idZone)) {
      return res.status(400).json({
        status: false,
        message: "El filtro idZone debe ser numérico",
      });
    }

    const result = await getClientsService(onlyActive, idZone);

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

export async function getClientByIdController(req: Request, res: Response) {
  try {
    const params = clientIdParamSchema.parse(req.params);
    const result = await getClientByIdService(params.id);

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Cliente no encontrado",
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

export async function updateClientController(req: Request, res: Response) {
  try {
    const params = clientIdParamSchema.parse(req.params);
    const data = updateClientSchema.parse(req.body);

    const result = await updateClientService(params.id, data);

    return res.status(200).json({
      status: true,
      message: "Cliente actualizado correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function toggleClientStatusController(
  req: Request,
  res: Response,
) {
  try {
    const params = clientIdParamSchema.parse(req.params);
    const data = toggleClientStatusSchema.parse(req.body);

    const result = await toggleClientStatusService(params.id, data);

    return res.status(200).json({
      status: true,
      message:
        data.is_active === 1
          ? "Cliente activado correctamente"
          : "Cliente desactivado correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}
