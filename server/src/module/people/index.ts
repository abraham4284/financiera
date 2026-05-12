import { Router } from "express";
import clientsRoutes from "./clients/index.js";

const router = Router();

router.use(clientsRoutes);

export default router;
