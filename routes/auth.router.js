import express from 'express';
import controller from '../controllers/authController.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();
router.post('/', controller.login);
router.post('/recovery', controller.recovery);
router.route('/new-password')
    .post(controller.newPass)
    .patch([isAuth], controller.updatePass);


export default router;