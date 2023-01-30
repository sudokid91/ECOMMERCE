/* eslint-disable @typescript-eslint/no-unused-vars */
import User from "../models/userModel";
import jwt from 'jsonwebtoken';
import asyncHandler from "express-async-handler";

const authMiddleware = asyncHandler(async (req: any, res, next: any) => {
  let token: any;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized");
    }
  } else {
    throw new Error("There is no authorization");
  }
});

const isAdmin = asyncHandler(async (req: any, res, next: any) => {
  const { email } = req.user;
  const user = await User.findOne({ email });
  if (user && user.role !== "admin") {
    throw new Error("You are not allowed to access this admin account");
  } else next();

});

export { authMiddleware, isAdmin }
