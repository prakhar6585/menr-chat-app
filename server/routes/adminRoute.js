import express from 'express'
import { allChats, allUsers } from '../controllers/adminController.js';


const router = express.Router();

router.get('/');

router.post('/verify');

router.get('/logout')

router.get('/users', allUsers)

router.get('/chats', allChats)

router.get('/messages')

router.get('/stats')


export default router;