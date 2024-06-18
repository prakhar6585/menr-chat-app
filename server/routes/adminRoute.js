import express from 'express'
import { adminLogin, allChats, allMessages, allUsers, getDashboard } from '../controllers/adminController.js';
import { adminLoginValidator, validateHandler } from '../lib/validator.js';


const router = express.Router();


router.post('/verify', adminLoginValidator(), validateHandler, adminLogin);

router.get('/logout')

// only admin can access these routes

router.get('/');

router.get('/users', allUsers)

router.get('/chats', allChats)

router.get('/messages', allMessages)

router.get('/stats', getDashboard)


export default router;