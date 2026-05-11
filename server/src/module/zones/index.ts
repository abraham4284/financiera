import { Router } from "express";
import zonesRoutes from "./zones/index.js";

const router = Router();

router.use(zonesRoutes);

export default router;
