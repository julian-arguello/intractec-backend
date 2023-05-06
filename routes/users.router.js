import express from 'express';
import controller from '../controllers/usersController.js';
//middleware
import { isAuth } from '../middleware/auth.js';
import { isSuperAdmin } from '../middleware/isSuperAdmin.js';
import { authEdit } from '../middleware/authEdit.js';

const router = express.Router();
router.route('/')
    .get([isAuth, isSuperAdmin], controller.viewAlls)
    .post([isAuth, isSuperAdmin], controller.register);
router.route('/roles')
    .get([isAuth, isSuperAdmin], controller.viewRoles);
router.route('/:id')
    .get([isAuth, isSuperAdmin], controller.viewId)
    .patch([isAuth, authEdit], controller.update)
    .delete([isAuth, isSuperAdmin], controller.deleteEntity);

export default router;