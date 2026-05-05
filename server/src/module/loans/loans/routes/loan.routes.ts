import { Router } from "express";
import { createLoanController } from "../controllers/loan.controllers.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.post(
  "/loans",
  requireAuth,
  requireRoles([1]),
  userAction,
  createLoanController,
);

export default router;
