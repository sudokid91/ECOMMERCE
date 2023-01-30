/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose from 'mongoose'; // Erase if already required
import bcrypt from "bcrypt";

// Declare the Schema of the Mongo model
let userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
    // unique: true,
    index: true,
  },
  last_name: {
    type: String,
    required: true,
    // unique: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  cart: [{ type: Array, default: [] }],
  address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
  wishlist: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
  refreshToken: {
    type: String,
  },
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
  next();
});

userSchema.methods.isPasswordConfirmed = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Export the model
const User = mongoose.model('User', userSchema);

export default User;