import mongoose from 'mongoose';
export const dbConnect = () => {
  mongoose.set('strictQuery', false)
  try {
    mongoose.connect(process.env.MONGODB_URL, () => {
      console.log(`Connect  to MongoDB successfully`);
    })
  } catch (error) {
    throw new Error(error.message);
  }
};