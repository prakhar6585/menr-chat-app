import express from 'express';
import { getMyProfile, login, logout, newUser, searchUser } from '../controllers/userController.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/new', singleAvatar, newUser)
router.post('/login', login);

// Login user : Access Routes
router.get('/me', isAuthenticated, getMyProfile);

router.get('/logout', logout)

router.get('/search', searchUser)

export default router;
