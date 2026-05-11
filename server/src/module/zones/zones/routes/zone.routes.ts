import { Router } from "express";
import {
  createZoneController,
  getZoneByIdController,
  getZonesController,
  toggleZoneStatusController,
  updateZoneController,
} from "../controllers/zone.controller.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.get(
  "/zones",
  requireAuth,
  requireRoles([1]),
  userAction,
  getZonesController,
);
router.get(
  "/zones/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  getZoneByIdController,
);
router.post(
  "/zones",
  requireAuth,
  requireRoles([1]),
  userAction,
  createZoneController,
);
router.put(
  "/zones/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  updateZoneController,
);
router.patch(
  "/zones/:id/status",
  requireAuth,
  requireRoles([1]),
  userAction,
  toggleZoneStatusController,
);

export default router;
