import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Beverage", "Pizza", "Burger", "Pasta", "Rice", "Noodles"]
    },
    food_type: {
        type: String,
        required: true,
        enum: ["Veg", "Non-Veg"]
    },
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop"
    }

}, { timestamps: true })
const Item = mongoose.model("Item", itemSchema)
export default Item