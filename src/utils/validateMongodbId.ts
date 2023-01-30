import mongoose from "mongoose";

export const validateMongoId = (id: string) => {
  const isValid = mongoose.isValidObjectId(id);
  if (!isValid) throw new Error('invalid Mongo ID or not found');
}