import express from 'express';
import controller from '../controllers/authController.js';

const router = express.Router();
router.post('/', controller.login);
router.post('/recovery', controller.recovery);
router.post('/new-password', controller.newPass);

export default router;
