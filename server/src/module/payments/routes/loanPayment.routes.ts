import { Router } from "express";
import { createLoanPaymentController } from "../controllers/loanPayment.controller.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.post(
  "/loan-payments",
  requireAuth,
  requireRoles([1]),
  userAction,
  createLoanPaymentController,
);

export default router;
