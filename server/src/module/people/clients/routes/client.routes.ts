import { Router } from "express";
import {
  createClientController,
  getClientByIdController,
  getClientsController,
  toggleClientStatusController,
  updateClientController,
} from "../controllers/client.controller.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.get(
  "/clients",
  requireAuth,
  requireRoles([1]),
  userAction,
  getClientsController,
);
router.get(
  "/clients/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  getClientByIdController,
);
router.post(
  "/clients",
  requireAuth,
  requireRoles([1]),
  userAction,
  createClientController,
);
router.put(
  "/clients/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  updateClientController,
);
router.patch(
  "/clients/:id/status",
  requireAuth,
  requireRoles([1]),
  userAction,
  toggleClientStatusController,
);

export default router;
