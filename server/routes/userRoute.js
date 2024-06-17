import express from 'express';
import { getMyFriends, getMyProfile, getNotifications, login, logout, newUser, searchUser, sendFriendRequest } from '../controllers/userController.js';
import { singleAvatar } from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { acceptRequestValidator, loginValidator, registerValidator, sendrequestValidator, validateHandler } from '../lib/validator.js';


const router = express.Router();

router.post('/new', singleAvatar, registerValidator(), validateHandler, newUser)
router.post('/login', loginValidator, validateHandler, login);

// Login user : Access Routes
router.get('/me', isAuthenticated, getMyProfile);

router.get('/logout', logout)

router.get('/search', searchUser)

router.put('/sendrequest', sendrequestValidator(), validateHandler, sendFriendRequest)

router.put('/acceptrequest', acceptRequestValidator(), validateHandler)

router.get('/notifications', getNotifications)

router.get('/friends', getMyFriends);

export default router;
