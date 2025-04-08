import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
export const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        trim: true
    },
    lastName:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    phoneNumber:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'seller', 'user'],
        required: true,
        default: 'user'
    },
    isAdmin:{
        type: Boolean,
        default: false
    }
}, { timestamps: true });
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

   