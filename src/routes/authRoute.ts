import express from 'express';
import { blockUser, createUser, deleteUser, getAllUser, getUserById, login, logout, refreshToken, unlockUser, updateUser } from '../controller/userController';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', createUser);
router.post('/login', login);
router.get('/all-users', getAllUser);
router.get('/refresh-token', refreshToken);
router.get('/logout', logout);
router.delete('/delete-user', deleteUser);
router.get('/:id', authMiddleware, isAdmin, getUserById);
router.put('/edit-user', authMiddleware, updateUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unlock-user/:id', authMiddleware, isAdmin, unlockUser);

export default router;
