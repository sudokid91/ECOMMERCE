"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMongoId = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validateMongoId = (id) => {
    const isValid = mongoose_1.default.isValidObjectId(id);
    if (!isValid)
        throw new Error('invalid Mongo ID or not found');
};
exports.validateMongoId = validateMongoId;
//# sourceMappingURL=validateMongodbId.js.map