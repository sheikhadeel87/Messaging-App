import express from 'express';
import { sendMessage, getMessages, deleteMessage, editMessage } from '../controllers/messagecontroller.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.post("/send/:id", protectRoute, sendMessage);
router.get('/:id', protectRoute, getMessages);
router.delete('/:messageId', protectRoute, deleteMessage);
router.put('/:messageId', protectRoute, editMessage);

export default router;