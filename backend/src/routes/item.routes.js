import { Router } from "express";
import { createItemController, getShopItemsController, getItemByIdController, updateItemController, deleteItemController } from "../controllers/item.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../utils/upload.js";

const router = Router();

router.get("/shop/:shopId", getShopItemsController);
router.get("/:id", getItemByIdController);
router.post("/", authMiddleware, upload.single("image"), createItemController);
router.put("/:id", authMiddleware, upload.single("image"), updateItemController);
router.delete("/:id", authMiddleware, deleteItemController);

export default router;
