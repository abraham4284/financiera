import { Router } from "express";
import {
  createAdjustmentController,
  createExpenseController,
  createTransferController,
  getGlTransactionByIdController,
  getGlTransactionsController,
} from "../controllers/glTransaction.controller.js";

const router = Router();

router.get("/transactions", getGlTransactionsController);
router.get("/transactions/:idGlTransaction", getGlTransactionByIdController);

router.post("/manual/expenses", createExpenseController);
router.post("/manual/transfers", createTransferController);
router.post("/manual/adjustments", createAdjustmentController);

export default router;