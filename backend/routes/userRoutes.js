import express from 'express';
import { getUsersForSidebar } from '../controllers/usercontroller.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/', protectRoute, getUsersForSidebar);

export default router;