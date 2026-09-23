import { Router } from "express";
import authRoutes from "./auth.routes.js";
import documentRoutes from "./document.routes.js";
import shopRoutes from "./shop.routes.js";
import itemRoutes from "./item.routes.js";
import ownerRoutes from "./owner.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/documents', documentRoutes);
router.use('/shops', shopRoutes);
router.use('/items', itemRoutes);
router.use('/owner', ownerRoutes);

export default router;
