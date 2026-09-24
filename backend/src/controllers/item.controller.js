import { createItem, getItemsByShopId, getItemById, updateItem, deleteItem } from "../services/item.service.js";
import cloudinaryInstance from "../utils/cloudinary.js";

export const createItemController = async (req, res) => {
    try {
        const { name, description, price, category, food_type, shop } = req.body;

        let images = req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [];
        if (req.body.image && typeof req.body.image === 'string') {
            images.push(req.body.image);
        }

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                if (process.env.NODE_ENV === 'production') {
                    const uploadResult = await cloudinaryInstance(file.path);
                    if (uploadResult?.secure_url) images.push(uploadResult.secure_url);
                } else {
                    images.push(`/uploads/${file.filename}`);
                }
            }
        }

        const itemData = { name, description, price, images, category, food_type, shop };
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
        
        let newImages = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                if (process.env.NODE_ENV === 'production') {
                    const uploadResult = await cloudinaryInstance(file.path);
                    if (uploadResult?.secure_url) newImages.push(uploadResult.secure_url);
                } else {
                    newImages.push(`/uploads/${file.filename}`);
                }
            }
        }
        
        if (newImages.length > 0) {
            let existingImages = updateData.existingImages ? (Array.isArray(updateData.existingImages) ? updateData.existingImages : [updateData.existingImages]) : [];
            if (updateData.image && typeof updateData.image === 'string' && existingImages.length === 0) {
                existingImages.push(updateData.image);
            }
            updateData.images = [...existingImages, ...newImages];
        } else if (updateData.existingImages) {
            updateData.images = Array.isArray(updateData.existingImages) ? updateData.existingImages : [updateData.existingImages];
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
