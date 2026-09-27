import mongoose from "mongoose";
import Shop from "../models/shop.model.js";
import User from "../models/user.model.js";
import Item from "../models/item.model.js";

export const createShop = async (shopData) => {
    const { owner, name, description, logo, address, city, state, zipcode, country } = shopData;

    const user = await User.findById(owner).lean();
    if (!user) {
        throw new Error("User not found");
    }
    // Depending on your role schema, verify role here. Assuming "owner" or "admin".
    if (user.role !== "owner" && user.role !== "admin") {
        throw new Error("User is not authorized to create a shop");
    }

    const shop = await Shop.create({
        owner,
        name,
        description,
        logo,
        address,
        city,
        state,
        zipcode,
        country
    });

    return shop;
};

export const getAllShops = async (queryParams = {}) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
        search = ''
    } = queryParams;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = {};
    if (search) {
        query.$text = { $search: search };
    }

    // Add owner filter if provided
    if (queryParams.owner) {
        query.owner = queryParams.owner;
    }

    // Add city filter if provided
    if (queryParams.city && queryParams.city.toLowerCase() !== 'all') {
        query.city = { $regex: new RegExp(`^${queryParams.city.trim()}$`, 'i') };
    }

    // Add zipcode filter if provided
    if (queryParams.zipcode) {
        query.zipcode = { $regex: new RegExp(`^${queryParams.zipcode.trim()}$`, 'i') };
    }

    const sortConfig = {};
    // If searching, we often want to sort by text score, but for now we keep the user's sort config unless they specifically want score. 
    // We'll just stick to standard sorting for simplicity.
    sortConfig[sortBy] = order === 'asc' ? 1 : -1;

    const shops = await Shop.find(query)
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name email')
        .lean();

    const total = await Shop.countDocuments(query);

    return {
        shops,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        }
    };
};

export const getShopById = async (id) => {
    const shop = await Shop.findById(id)
        .populate('owner', 'name email phone')
        .populate('items')
        .lean();

    if (!shop) {
        throw new Error("Shop not found");
    }
    return shop;
};

export const updateShop = async (id, updateData, userId) => {
    const shop = await Shop.findById(id);

    if (!shop) {
        throw new Error("Shop not found");
    }
    if (shop.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized: Only the owner can update this shop");
    }

    // Sanitize payload: Prevent updating sensitive or unchangeable fields
    const allowedUpdates = ['name', 'description', 'logo', 'address', 'city', 'state', 'zipcode', 'country'];
    const sanitizedUpdate = {};
    Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
            sanitizedUpdate[key] = updateData[key];
        }
    });

    const updatedShop = await Shop.findByIdAndUpdate(
        id,
        { $set: sanitizedUpdate },
        { returnDocument: 'after', runValidators: true }
    ).lean();

    return updatedShop;
};

export const deleteShop = async (id, userId) => {
    const shop = await Shop.findById(id);

    if (!shop) {
        throw new Error("Shop not found");
    }
    if (shop.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized: Only the owner can delete this shop");
    }

    // 1. Delete all items belonging to this shop
    await Item.deleteMany({ shop: id });

    // 2. Delete the shop itself
    await Shop.findByIdAndDelete(id);

    return true;
};

export const getShopByCity = async (city, queryParams = {}) => {
    const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        order = 'desc',
        zipcode,
        search = ''
    } = queryParams;

    const query = {};

    if (city && city.toLowerCase() !== 'all') {
        query.city = { $regex: new RegExp(`^${city.trim()}$`, 'i') };
    }

    if (zipcode) {
        query.zipcode = { $regex: new RegExp(`^${zipcode.trim()}$`, 'i') };
    }

    if (search) {
        query.$text = { $search: search };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortConfig = {};
    sortConfig[sortBy] = order === 'asc' ? 1 : -1;

    const shops = await Shop.find(query)
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('owner', 'name email')
        .lean();

    const total = await Shop.countDocuments(query);

    return {
        shops,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        }
    };
};