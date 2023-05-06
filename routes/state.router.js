import express from 'express';
import controller from '../controllers/stateController.js';

const router = express.Router();
router.get('/', controller.viewAlls);

export default router;
