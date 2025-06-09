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
        type: String,
        required: true,
        enum: ['fruits', 'vegetables', 'grains', 'other'],
        lowercase: true,
        trim: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Product', productSchema);