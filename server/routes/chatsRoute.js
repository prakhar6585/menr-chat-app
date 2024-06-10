import express from 'express';
import { newGroupChat } from '../controllers/chatController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/new', isAuthenticated, newGroupChat)


export default router;

