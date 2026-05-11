import { Router } from "express";
import {
  createGlCategoryController,
  getGlCategoriesController,
  getGlCategoryByIdController,
  toggleGlCategoryStatusController,
  updateGlCategoryController,
} from "../controllers/glCategory.controller.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.get(
  "/gl-categories",
  requireAuth,
  requireRoles([1]),
  userAction,
  getGlCategoriesController,
);
router.get(
  "/gl-categories/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  getGlCategoryByIdController,
);
router.post(
  "/gl-categories",
  requireAuth,
  requireRoles([1]),
  userAction,
  createGlCategoryController,
);
router.put(
  "/gl-categories/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  updateGlCategoryController,
);
router.patch(
  "/gl-categories/:id/status",
  requireAuth,
  requireRoles([1]),
  userAction,
  toggleGlCategoryStatusController,
);

export default router;
