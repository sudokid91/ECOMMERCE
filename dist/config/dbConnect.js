"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = () => {
    mongoose_1.default.set('strictQuery', false);
    try {
        mongoose_1.default.connect(process.env.MONGODB_URL, () => {
            console.log(`Connect  to MongoDB successfully`);
        });
    }
    catch (error) {
        throw new Error(error.message);
    }
};
exports.dbConnect = dbConnect;
//# sourceMappingURL=dbConnect.js.map