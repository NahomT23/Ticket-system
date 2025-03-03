import { generateInvitationCode } from '../controllers/adminController.js';
import Router from "express"

import { authorize } from '../middlewares/authMiddleware.js';
import { adminsOnly } from '../middlewares/roleMiddleware.js';

const adminRouter = Router();


adminRouter.post('/generate', authorize, adminsOnly, generateInvitationCode);

export default adminRouter;
