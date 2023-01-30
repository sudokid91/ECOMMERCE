"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.unlockUser = exports.blockUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUser = exports.login = exports.createUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jwtToken_1 = require("../config/jwtToken");
const mongoose_1 = require("mongoose");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const user = yield userModel_1.default.findOne({ email: email });
    if (!user) {
        // create a new user
        const newUser = yield userModel_1.default.create(req.body);
        console.log(`newUser: ${newUser}`);
        res.json(newUser);
    }
    else {
        // user already exists
        throw new Error("User already exists");
    }
}));
exports.createUser = createUser;
const login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = (yield userModel_1.default.findOne({ email: email })) || {};
    if (Object.keys(user).length > 0 && (yield user.isPasswordConfirmed(password))) {
        const refreshToken = yield (0, jwtToken_1.generateRefreshToken)(user === null || user === void 0 ? void 0 : user._id);
        const userUpdate = yield userModel_1.default.findOneAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
            refreshToken: refreshToken,
        }, {
            new: true,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000 * 24 * 3,
        });
        res.json({
            _id: user === null || user === void 0 ? void 0 : user._id,
            firstName: user === null || user === void 0 ? void 0 : user.first_name,
            lastName: user === null || user === void 0 ? void 0 : user.last_name,
            mobile: user === null || user === void 0 ? void 0 : user.mobile,
            token: (0, jwtToken_1.generateToken)(user === null || user === void 0 ? void 0 : user._id)
        });
    }
    else {
        throw new Error("Invalid credentials");
    }
}));
exports.login = login;
const refreshToken = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req === null || req === void 0 ? void 0 : req.cookies;
    if (Object.keys(cookie).length === 0)
        throw new Error("No refresh token available in the browser");
    const refreshToken = cookie === null || cookie === void 0 ? void 0 : cookie.refreshToken;
    const user = yield userModel_1.default.findOne({ refreshToken: refreshToken });
    if (Object.keys(user).length > 0) {
        jsonwebtoken_1.default.verify(cookie === null || cookie === void 0 ? void 0 : cookie.refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            var _a;
            if (err || ((_a = user._id) === null || _a === void 0 ? void 0 : _a.toString()) !== (decoded === null || decoded === void 0 ? void 0 : decoded.id)) {
                throw new Error("there was an error verifying the refresh token");
            }
            const accessToken = (0, jwtToken_1.generateToken)(user === null || user === void 0 ? void 0 : user._id);
            res.json(accessToken);
        });
    }
    else {
        throw new Error("Can not retrieve");
    }
}));
exports.refreshToken = refreshToken;
const logout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = req === null || req === void 0 ? void 0 : req.cookies;
    if (!cookie)
        throw new Error("No refresh token available in the browser");
    const refreshToken = cookie === null || cookie === void 0 ? void 0 : cookie.refreshToken;
    const user = yield userModel_1.default.findOne({ refreshToken: refreshToken });
    console.log(user);
    if (Object.keys(user).length > 0) {
        yield userModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
            refreshToken: ""
        });
    }
    else {
        throw new Error("Can not retrieve by token is have not been configured from cookie");
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204); // forbidden
}));
exports.logout = logout;
const getAllUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userModel_1.default.find();
        res.json(users);
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.getAllUser = getAllUser;
const getUserById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, mongoose_1.isValidObjectId)(id);
    try {
        const user = yield userModel_1.default.findById(id);
        res.json(user);
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.getUserById = getUserById;
const updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    (0, mongoose_1.isValidObjectId)(_id);
    const { first_name, last_name, email, mobile } = req.body;
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(_id, {
            first_name: first_name,
            last_name: last_name,
            email,
            mobile,
        });
        res.json(user);
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.updateUser = updateUser;
const deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    (0, mongoose_1.isValidObjectId)(_id);
    const { first_name, last_name, email, mobile } = req.body;
    try {
        const user = yield userModel_1.default.findByIdAndDelete(_id, {
            first_name: first_name,
            last_name: last_name,
            email,
            mobile,
        });
        res.json(user);
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.deleteUser = deleteUser;
const blockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, mongoose_1.isValidObjectId)(id);
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(id, {
            isBlocked: true,
        }, {
            new: true,
        });
        res.json({
            message: "User blocked",
        });
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.blockUser = blockUser;
const unlockUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    (0, mongoose_1.isValidObjectId)(id);
    try {
        const user = yield userModel_1.default.findByIdAndUpdate(id, {
            isBlocked: false,
        }, {
            new: true,
        });
        res.json({
            message: "User unlocked successfully",
        });
    }
    catch (error) {
        throw new Error(error);
    }
}));
exports.unlockUser = unlockUser;
//# sourceMappingURL=userController.js.map