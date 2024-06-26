import express from 'express';
import { addMembers, deleteChat, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from '../controllers/chatController.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { attachmentsMulter } from '../middlewares/multer.js';
import { addMembersValidator, chatIdValidator, leaveGroupValidator, newGroupChatValidator, removeMemberValidator, renameValidator, sendAttachmentsValidator, validateHandler } from '../lib/validator.js';

const router = express.Router();

router.post('/new', isAuthenticated, newGroupChatValidator(), validateHandler, newGroupChat);
router.get('/my', isAuthenticated, getMyChats);
router.get('/my/groups', isAuthenticated, getMyGroups);
router.put('/addmembers', isAuthenticated, addMembersValidator(), validateHandler, addMembers);
router.put('/removemember', isAuthenticated, removeMemberValidator(), validateHandler, removeMembers);
router.delete('/leave/:id', isAuthenticated, leaveGroupValidator(), validateHandler, leaveGroup);

//send attachments
router.post('/message', isAuthenticated, attachmentsMulter, sendAttachmentsValidator(), validateHandler, sendAttachments);

// get messages 
router.get('/message/:id', chatIdValidator(), validateHandler, getMessages);

// get chat details , rename, delete
router.route('/:id')
    .get(chatIdValidator(), validateHandler, getChatDetails)
    .put(renameValidator(), validateHandler, renameGroup)
    .delete(deleteChat);


export default router;

