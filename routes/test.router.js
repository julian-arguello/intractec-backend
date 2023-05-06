import express from 'express';
import controller from '../controllers/testController.js';

const router = express.Router();
router.get('/', controller.info);
router.get('/up', controller.update);

export default router;
