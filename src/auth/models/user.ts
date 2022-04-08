import mongoose from 'mongoose';

// create a schema that contains: unique email, password and role
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    token: { 
        type: String,
        default: null,
    }
});
const User = mongoose.model('User', userSchema);

export default User;