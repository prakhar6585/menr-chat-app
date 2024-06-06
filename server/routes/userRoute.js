import express from 'express';
import { login, newUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/new', newUser)
router.post('/login', login);


export default router;
