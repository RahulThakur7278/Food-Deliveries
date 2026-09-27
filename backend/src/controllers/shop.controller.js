import { createShop, getAllShops, getShopById, updateShop, deleteShop, getShopByCity } from "../services/shop.service.js";
import cloudinaryInstance from "../utils/cloudinary.js";

export const createShopController = async (req, res) => {
    try {
        const { name, description, address, city, state, zipcode, country, items } = req.body;
        const owner = req.user._id;

        let logo = req.body.logo;
        if (req.file) {
            if (process.env.NODE_ENV === 'production') {
                const uploadResult = await cloudinaryInstance(req.file.path);
                logo = uploadResult?.secure_url;
            } else {
                logo = `/uploads/${req.file.filename}`;
            }
        }

        const shopData = { name, description, address, city, state, zipcode, country, items, logo, owner };
        const shop = await createShop(shopData);

        res.status(201).json({ success: true, data: shop });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to create shop", error: error.message });
    }
};

export const getAllShopsController = async (req, res) => {
    try {
        const shopsData = await getAllShops(req.query);
        res.status(200).json({ success: true, data: shopsData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch shops", error: error.message });
    }
};

export const getShopByIdController = async (req, res) => {
    try {
        const shop = await getShopById(req.params.id);
        if (!shop) {
            return res.status(404).json({ success: false, message: "Shop not found" });
        }
        res.status(200).json({ success: true, data: shop });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch shop", error: error.message });
    }
};

export const updateShopController = async (req, res) => {
    try {
        const shopId = req.params.id;
        let updateData = { ...req.body };

        if (req.file) {
            if (process.env.NODE_ENV === 'production') {
                const uploadResult = await cloudinaryInstance(req.file.path);
                updateData.logo = uploadResult?.secure_url;
            } else {
                updateData.logo = `/uploads/${req.file.filename}`;
            }
        }

        const updatedShop = await updateShop(shopId, updateData, req.user._id);
        res.status(200).json({ success: true, data: updatedShop });
    } catch (error) {
        if (error.message === "Shop not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.startsWith("Unauthorized")) {
            return res.status(403).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Failed to update shop", error: error.message });
    }
};

export const deleteShopController = async (req, res) => {
    try {
        const shopId = req.params.id;
        await deleteShop(shopId, req.user._id);
        res.status(200).json({ success: true, message: "Shop deleted successfully" });
    } catch (error) {
        if (error.message === "Shop not found") {
            return res.status(404).json({ success: false, message: error.message });
        }
        if (error.message.startsWith("Unauthorized")) {
            return res.status(403).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: "Failed to delete shop", error: error.message });
    }
};

export const getShopByCityController = async (req, res) => {
    try {
        const shopsData = await getShopByCity(req.params.city, req.query);
        res.status(200).json({ success: true, data: shopsData });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch shops", error: error.message });
    }
};
