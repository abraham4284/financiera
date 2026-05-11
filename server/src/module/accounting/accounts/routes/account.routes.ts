import { Router } from "express";
import {
  createAccountController,
  getAccountByIdController,
  getAccountsController,
  toggleAccountStatusController,
  updateAccountController,
} from "../controllers/account.controller.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.get(
  "/account",
  requireAuth,
  requireRoles([1]),
  userAction,
  getAccountsController,
);
router.get(
  "/account/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  getAccountByIdController,
);
router.post(
  "/account",
  requireAuth,
  requireRoles([1]),
  userAction,
  createAccountController,
);
router.put(
  "/account/:id",
  requireAuth,
  requireRoles([1]),
  userAction,
  updateAccountController,
);
router.patch(
  "/account/:id/status",
  requireAuth,
  requireRoles([1]),
  userAction,
  toggleAccountStatusController,
);

export default router;
