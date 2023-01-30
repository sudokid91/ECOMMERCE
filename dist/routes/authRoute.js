"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/register', userController_1.createUser);
router.post('/login', userController_1.login);
router.get('/all-users', userController_1.getAllUser);
router.get('/refresh-token', userController_1.refreshToken);
router.get('/logout', userController_1.logout);
router.delete('/delete-user', userController_1.deleteUser);
router.get('/:id', authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, userController_1.getUserById);
router.put('/edit-user', authMiddleware_1.authMiddleware, userController_1.updateUser);
router.put('/block-user/:id', authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, userController_1.blockUser);
router.put('/unlock-user/:id', authMiddleware_1.authMiddleware, authMiddleware_1.isAdmin, userController_1.unlockUser);
exports.default = router;
//# sourceMappingURL=authRoute.js.map