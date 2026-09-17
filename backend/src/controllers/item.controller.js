import { createItem, getItemsByShopId, getItemById, updateItem, deleteItem } from "../services/item.service.js";
import cloudinaryInstance from "../utils/cloudinary.js";

export const createItemController = async (req, res) => {
    try {
        const { name, description, price, category, food_type, shop } = req.body;

        let image = req.body.image;
        if (req.file) {
            if (process.env.NODE_ENV === 'production') {
                const uploadResult = await cloudinaryInstance(req.file.path);
                image = uploadResult?.secure_url;
            } else {
                image = `/uploads/${req.file.filename}`;
            }
        }

        const itemData = { name, description, price, image, category, food_type, shop };
        const item = await createItem(itemData, req.user._id);
        
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        if (error.message === "Shop not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.startsWith("Unauthorized")) {
            return res.status(403).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Failed to create item", error: error.message });
    }
};

export const getShopItemsController = async (req, res) => {
    try {
        const { shopId } = req.params;
        const itemsData = await getItemsByShopId(shopId, req.query);
        res.status(200).json({ success: true, data: itemsData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch items", error: error.message });
    }
};

export const getItemByIdController = async (req, res) => {
    try {
        const item = await getItemById(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        res.status(200).json({ success: true, data: item });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch item", error: error.message });
    }
};

export const updateItemController = async (req, res) => {
    try {
        const itemId = req.params.id;
        let updateData = { ...req.body };
        
        if (req.file) {
            if (process.env.NODE_ENV === 'production') {
                const uploadResult = await cloudinaryInstance(req.file.path);
                updateData.image = uploadResult?.secure_url;
            } else {
                updateData.image = `/uploads/${req.file.filename}`;
            }
        }

        const updatedItem = await updateItem(itemId, updateData, req.user._id);
        res.status(200).json({ success: true, data: updatedItem });
    } catch (error) {
        if (error.message === "Item not found" || error.message === "Associated shop not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.startsWith("Unauthorized")) {
            return res.status(403).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Failed to update item", error: error.message });
    }
};

export const deleteItemController = async (req, res) => {
    try {
        const itemId = req.params.id;
        await deleteItem(itemId, req.user._id);
        res.status(200).json({ success: true, message: "Item deleted successfully" });
    } catch (error) {
        if (error.message === "Item not found" || error.message === "Associated shop not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.startsWith("Unauthorized")) {
            return res.status(403).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Failed to delete item", error: error.message });
    }
};
