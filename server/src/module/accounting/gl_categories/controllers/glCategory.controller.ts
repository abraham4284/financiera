import { Request, Response } from "express";
import {
  createGlCategorySchema,
  glCategoryIdParamSchema,
  toggleGlCategoryStatusSchema,
  updateGlCategorySchema,
} from "../validation/glCategory.validation.js";
import {
  createGlCategoryService,
  getGlCategoriesService,
  getGlCategoryByIdService,
  toggleGlCategoryStatusService,
  updateGlCategoryService,
} from "../services/glCategory.service.js";

export async function createGlCategoryController(req: Request, res: Response) {
  try {
    const data = createGlCategorySchema.parse(req.body);
    const result = await createGlCategoryService(data);

    return res.status(201).json({
      status: true,
      message: "Categoría creada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function getGlCategoriesController(req: Request, res: Response) {
  try {
    const onlyActive = req.query.onlyActive !== "false";
    const result = await getGlCategoriesService(onlyActive);

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

export async function getGlCategoryByIdController(req: Request, res: Response) {
  try {
    const params = glCategoryIdParamSchema.parse(req.params);
    const result = await getGlCategoryByIdService(params.id);

    if (!result) {
      return res.status(404).json({
        status: false,
        message: "Categoría no encontrada",
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

export async function updateGlCategoryController(req: Request, res: Response) {
  try {
    const params = glCategoryIdParamSchema.parse(req.params);
    const data = updateGlCategorySchema.parse(req.body);

    const result = await updateGlCategoryService(params.id, data);

    return res.status(200).json({
      status: true,
      message: "Categoría actualizada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}

export async function toggleGlCategoryStatusController(
  req: Request,
  res: Response,
) {
  try {
    const params = glCategoryIdParamSchema.parse(req.params);
    const data = toggleGlCategoryStatusSchema.parse(req.body);

    const result = await toggleGlCategoryStatusService(params.id, data);

    return res.status(200).json({
      status: true,
      message:
        data.is_active === 1
          ? "Categoría activada correctamente"
          : "Categoría desactivada correctamente",
      data: result,
    });
  } catch (error: any) {
    return res.status(400).json({
      status: false,
      message: error.sqlMessage || error.message,
    });
  }
}