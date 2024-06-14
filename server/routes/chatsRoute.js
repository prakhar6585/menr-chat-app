import express from 'express';
import { addMembers, deleteChat, getChatDetails, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from '../controllers/chatController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { attachmentsMulter } from '../middlewares/multer.js';

const router = express.Router();

router.post('/new', isAuthenticated, newGroupChat);
router.get('/my', isAuthenticated, getMyChats);
router.get('/my/groups', isAuthenticated, getMyGroups);
router.put('/addmembers', isAuthenticated, addMembers);
router.put('/removemember', isAuthenticated, removeMembers);
router.delete('/leave/:id', isAuthenticated, leaveGroup);

//send attachments
router.post('/message', isAuthenticated, attachmentsMulter, sendAttachments)

// get messages 
router.get('/message/:id',)
// get chat details , rename, delete
router.route('/:id').get(getChatDetails).put(renameGroup).delete(deleteChat);


export default router;

