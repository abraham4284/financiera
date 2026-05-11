import { Request, Response } from "express";
import {
  createZoneSchema,
  toggleZoneStatusSchema,
  updateZoneSchema,
  zoneIdParamSchema,
} from "../validation/zone.validation.js";
import {
  createZoneService,
  getZoneByIdService,
  getZonesService,
  toggleZoneStatusService,
  updateZoneService,
} from "../services/zone.service.js";

export async function createZoneController(req: Request, res: Response) {
  try {
    const data = createZoneSchema.parse(req.body);
    const result = await createZoneService(data);

    return res.status(201).json({
      status: true,
      message: "Zona creada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function getZonesController(req: Request, res: Response) {
  try {
    const onlyActive = req.query.onlyActive !== "false";
    const result = await getZonesService(onlyActive);

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

export async function getZoneByIdController(req: Request, res: Response) {
  try {
    const params = zoneIdParamSchema.parse(req.params);
    const result = await getZoneByIdService(params.id);

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Zona no encontrada",
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

export async function updateZoneController(req: Request, res: Response) {
  try {
    const params = zoneIdParamSchema.parse(req.params);
    const data = updateZoneSchema.parse(req.body);

    const result = await updateZoneService(params.id, data);

    return res.status(200).json({
      status: true,
      message: "Zona actualizada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function toggleZoneStatusController(req: Request, res: Response) {
  try {
    const params = zoneIdParamSchema.parse(req.params);
    const data = toggleZoneStatusSchema.parse(req.body);

    const result = await toggleZoneStatusService(params.id, data);

    return res.status(200).json({
      status: true,
      message:
        data.is_active === 1
          ? "Zona activada correctamente"
          : "Zona desactivada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}