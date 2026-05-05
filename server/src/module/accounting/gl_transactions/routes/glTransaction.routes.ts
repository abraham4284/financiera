import { Router } from "express";
import {
  createAdjustmentController,
  createExpenseController,
  createTransferController,
  getGlTransactionByIdController,
  getGlTransactionsController,
} from "../controllers/glTransaction.controller.js";
import { requireAuth, requireRoles,userAction } from "@/middlewares/index.js";

const router = Router();

router.get(
  "/transactions",
  requireAuth,
  requireRoles([1]),
  userAction,
  getGlTransactionsController,
);
router.get(
  "/transactions/:idGlTransaction",
  requireAuth,
  requireRoles([1]),
  userAction,
  getGlTransactionByIdController,
);

router.post(
  "/manual/expenses",
  requireAuth,
  requireRoles([1]),
  userAction,
  createExpenseController,
);
router.post(
  "/manual/transfers",
  requireAuth,
  requireRoles([1]),
  userAction,
  createTransferController,
);
router.post(
  "/manual/adjustments",
  requireAuth,
  requireRoles([1]),
  userAction,
  createAdjustmentController,
);

export default router;
