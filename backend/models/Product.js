import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    unit: {
        type: String,
        enum: ['kg', 'piece'],
        default: 'kg',
        required: true
    },
    image: [{ type: String, trim: true }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', 
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);