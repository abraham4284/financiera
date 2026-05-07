import { Router } from "express";
import {
  createLoanController,
  voidLoanController,
} from "../controllers/index.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.post(
  "/loans",
  requireAuth,
  requireRoles([1]),
  userAction,
  createLoanController,
);

router.patch(
  "/loans/:id/void",
  requireAuth,
  requireRoles([1]),
  userAction,
  voidLoanController,
);

export default router;
