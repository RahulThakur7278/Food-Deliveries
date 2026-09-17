import mongoose from "mongoose";

const shopSchema = new mongoose.Schema({
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
    logo: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    zipcode: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true })

// Indexes for performance (Search, Filtering, and Foreign Keys)
shopSchema.index({ name: 'text', description: 'text' });
shopSchema.index({ owner: 1 });
shopSchema.index({ city: 1, state: 1 });

const Shop = mongoose.model("Shop", shopSchema)
export default Shop 