import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
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
        trim: true,
        validate: {
            validator: function(v) {
                // Simple email regex
                return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password:{
        type: String,
        required: true,
        select: false,
        minlength: [6, 'Password must be at least 6 characters'],
        validate: {
            validator: function(v) {
                // At least one letter and one number
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(v);
            },
            message: 'Password must be at least 6 characters and contain at least one letter and one number'
        }
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
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
const User = mongoose.model('User', userSchema);
export default User;

