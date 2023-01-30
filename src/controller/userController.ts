import User from "../models/userModel";
import asyncHandler from "express-async-handler";
import { generateRefreshToken, generateToken } from "../config/jwtToken";
import mongoose, { isValidObjectId } from "mongoose";
import jwt from 'jsonwebtoken';

interface IRequest extends Request {
  body: any;
  params?: any;
  user?: any;
  cookies?: any;
}

interface IResponse extends Response {
  json: any;
  cookie: any;
}

const createUser = asyncHandler(async (req: IRequest, res: IResponse) => {
  const email = req.body.email;

  const user = await User.findOne({ email: email });

  if (!user) {
    // create a new user
    const newUser = await User.create(req.body);
    console.log(`newUser: ${newUser}`)
    res.json(newUser);
  } else {
    // user already exists
    throw new Error("User already exists");
  }
});


const login = asyncHandler(async (req: IRequest, res: IResponse) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }) || {} as any;
  if (Object.keys(user).length > 0 && await user.isPasswordConfirmed(password)) {
    const refreshToken = await generateRefreshToken(user?._id);
    const userUpdate = await User.findOneAndUpdate(user?._id, {
      refreshToken: refreshToken,
    }, {
      new: true,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000 * 24 * 3,
    })
    res.json({
      _id: user?._id,
      firstName: user?.first_name,
      lastName: user?.last_name,
      mobile: user?.mobile,
      token: generateToken(user?._id)
    });
  } else {
    throw new Error("Invalid credentials");
  }
});

const refreshToken = asyncHandler(async (req: IRequest, res: IResponse) => {
  const cookie = req?.cookies;
  if (Object.keys(cookie).length === 0) throw new Error("No refresh token available in the browser");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (Object.keys(user).length > 0) {
    jwt.verify(cookie?.refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user._id?.toString() !== decoded?.id) {
        throw new Error("there was an error verifying the refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json(accessToken);
    });
  } else {
    throw new Error("Can not retrieve")
  }
});

const logout = asyncHandler(async (req: any, res: any) => {
  const cookie = req?.cookies;
  if (!cookie) throw new Error("No refresh token available in the browser")
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken: refreshToken });
  if (Object.keys(user).length > 0) {
    await User.findByIdAndUpdate(user?._id, {
      refreshToken: ""
    });
  } else {
    throw new Error("Can not retrieve by token is have not been configured from cookie");
  }
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  return res.sendStatus(204); // forbidden
});

const getAllUser = asyncHandler(async (req: IRequest, res: IResponse) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    throw new Error(error);
  }

});

const getUserById = asyncHandler(async (req: IRequest, res: IResponse) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }

});

const updateUser = asyncHandler(async (req: IRequest, res: IResponse) => {
  const { _id } = req.user;
  isValidObjectId(_id);
  const { first_name, last_name, email, mobile } = req.body;
  try {
    const user = await User.findByIdAndUpdate(_id, {
      first_name: first_name,
      last_name: last_name,
      email,
      mobile,
    });
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }

});

const deleteUser = asyncHandler(async (req: IRequest, res: IResponse) => {
  const { _id } = req.user;
  isValidObjectId(_id);
  const { first_name, last_name, email, mobile } = req.body;
  try {
    const user = await User.findByIdAndDelete(_id, {
      first_name: first_name,
      last_name: last_name,
      email,
      mobile,
    });
    res.json(user);
  } catch (error) {
    throw new Error(error);
  }

});

const blockUser = asyncHandler(async (req: IRequest, res: IResponse) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const user = await User.findByIdAndUpdate(id, {
      isBlocked: true,
    }, {
      new: true,
    })
    res.json({
      message: "User blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

const unlockUser = asyncHandler(async (req: IRequest, res: IResponse) => {
  const { id } = req.params;
  isValidObjectId(id);
  try {
    const user = await User.findByIdAndUpdate(id, {
      isBlocked: false,
    }, {
      new: true,
    })
    res.json({
      message: "User unlocked successfully",
    });
  } catch (error) {
    throw new Error(error);
  }
});

export { createUser, login, getAllUser, getUserById, updateUser, deleteUser, blockUser, unlockUser, refreshToken, logout }