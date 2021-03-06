import mongoose from 'mongoose';

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
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  stripe_id: {
    type: String,
    default: null,
  },
  role: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    default: null,
  },
});
const User = mongoose.model('User', userSchema);

export default User;
