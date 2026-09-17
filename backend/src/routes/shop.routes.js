import { Router } from "express";
import { createShopController, getAllShopsController, getShopByIdController, updateShopController, deleteShopController } from "../controllers/shop.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../utils/upload.js";

const router = Router();

router.get("/", getAllShopsController);
router.get("/:id", getShopByIdController);
router.post("/", authMiddleware, upload.single("logo"), createShopController);
router.put("/:id", authMiddleware, upload.single("logo"), updateShopController);
router.delete("/:id", authMiddleware, deleteShopController);

export default router;
