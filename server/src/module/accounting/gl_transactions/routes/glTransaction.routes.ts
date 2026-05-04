import { Router } from "express";
import {
  createAdjustmentController,
  createExpenseController,
  createTransferController,
  getGlTransactionByIdController,
  getGlTransactionsController,
} from "../controllers/glTransaction.controller.js";
import { requireAuth, requireRoles } from "@/middlewares/index.js";

const router = Router();

router.get(
  "/transactions",
  requireAuth,
  requireRoles([1]),
  getGlTransactionsController,
);
router.get(
  "/transactions/:idGlTransaction",
  requireAuth,
  requireRoles([1]),
  getGlTransactionByIdController,
);

router.post(
  "/manual/expenses",
  requireAuth,
  requireRoles([1]),
  createExpenseController,
);
router.post(
  "/manual/transfers",
  requireAuth,
  requireRoles([1]),
  createTransferController,
);
router.post(
  "/manual/adjustments",
  requireAuth,
  requireRoles([1]),
  createAdjustmentController,
);

export default router;
