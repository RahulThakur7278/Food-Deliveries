import { Router } from "express";
import { createItemController, getShopItemsController, getItemByIdController, updateItemController, deleteItemController, getItemsByCityController } from "../controllers/item.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import upload from "../utils/upload.js";

const router = Router();

router.get("/city/:city", getItemsByCityController);
router.get("/shop/:shopId", getShopItemsController);
router.get("/:id", getItemByIdController);
router.post("/", authMiddleware, upload.array("images", 5), createItemController);
router.put("/:id", authMiddleware, upload.array("images", 5), updateItemController);
router.delete("/:id", authMiddleware, deleteItemController);

export default router;
