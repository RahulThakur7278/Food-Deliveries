import mongoose from "mongoose";
import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";

export const createItem = async (itemData, userId) => {
    const { name, description, price, image, images, category, food_type, shop } = itemData;

    const shopDetails = await Shop.findById(shop);
    if (!shopDetails) {
        throw new Error("Shop not found");
    }
    if (shopDetails.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized: Only the shop owner can add items");
    }

    const [newItem] = await Item.create([{
        name,
        description,
        price,
        image,
        images,
        category,
        food_type,
        shop
    }]);
    
    shopDetails.items.push(newItem._id);
    await shopDetails.save();
    
    return newItem.toObject();
};

export const getItemsByShopId = async (shopId, queryParams = {}) => {
    const { 
        page = 1, 
        limit = 20, 
        sortBy = 'createdAt', 
        order = 'desc',
        category,
        food_type,
        search = ''
    } = queryParams;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const query = {};
    if (shopId.includes(',')) {
        query.shop = { $in: shopId.split(',') };
    } else {
        query.shop = shopId;
    }
    
    if (category) query.category = category;
    if (food_type) query.food_type = food_type;
    if (search) query.$text = { $search: search };

    const sortConfig = {};
    sortConfig[sortBy] = order === 'asc' ? 1 : -1;

    const items = await Item.find(query)
        .sort(sortConfig)
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

    const total = await Item.countDocuments(query);

    return {
        items,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        }
    };
};

export const getItemById = async (id) => {
    const item = await Item.findById(id).lean();
    if (!item) {
        throw new Error("Item not found");
    }
    return item;
};

export const updateItem = async (itemId, updateData, userId) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new Error("Item not found");
    }

    const shopDetails = await Shop.findById(item.shop).lean();
    if (!shopDetails) {
        throw new Error("Associated shop not found");
    }

    if (shopDetails.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized: Only the shop owner can update this item");
    }

    // Sanitize payload
    const allowedUpdates = ['name', 'description', 'price', 'image', 'images', 'category', 'food_type'];
    const sanitizedUpdate = {};
    Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
            sanitizedUpdate[key] = updateData[key];
        }
    });

    const updatedItem = await Item.findByIdAndUpdate(
        itemId, 
        { $set: sanitizedUpdate }, 
        { returnDocument: 'after', runValidators: true }
    ).lean();

    return updatedItem;
};

export const deleteItem = async (itemId, userId) => {
    const item = await Item.findById(itemId);
    if (!item) {
        throw new Error("Item not found");
    }

    const shopDetails = await Shop.findById(item.shop);
    if (!shopDetails) {
        throw new Error("Associated shop not found");
    }

    if (shopDetails.owner.toString() !== userId.toString()) {
        throw new Error("Unauthorized: Only the shop owner can delete this item");
    }

    await Item.findByIdAndDelete(itemId);

    shopDetails.items = shopDetails.items.filter(id => id.toString() !== itemId.toString());
    await shopDetails.save();
    
    return true;
};
