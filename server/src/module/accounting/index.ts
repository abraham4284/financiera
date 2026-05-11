import { Router } from "express";
import glTransactionsRoutes from "./gl_transactions/index.js";
import accountRoutes from "./accounts/index.js";
import glCategoriesRoutes from "./gl_categories/index.js";

const router = Router();

router.use(glTransactionsRoutes);
router.use(accountRoutes);
router.use(glCategoriesRoutes);

export default router;
