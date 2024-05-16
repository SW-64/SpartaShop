import mongoose from "mongoose";
const product_Schema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        manager: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            enum: ["FOR_SALE", "SOLD_OUT"],
            default: "FOR_SALE",
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Product", product_Schema);
