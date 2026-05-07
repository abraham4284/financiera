import { Router } from "express";
import {
  createLoanRenewalController,
  getLoanRenewalProposalController,
} from "../controllers/loanRenewal.controller.js";
import { requireAuth, requireRoles, userAction } from "@/middlewares/index.js";

const router = Router();

router.get(
  "/loan-details-proposal/:loanId",
  requireAuth,
  requireRoles([1]),
  userAction,
  getLoanRenewalProposalController,
);
router.post(
  "/loan-details",
  requireAuth,
  requireRoles([1]),
  userAction,
  createLoanRenewalController,
);

export default router;
