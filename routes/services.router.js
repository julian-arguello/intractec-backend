import express from 'express';
import controller from '../controllers/servicesController.js';
//middleware
import { isAuth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { isSuperAdmin } from '../middleware/isSuperAdmin.js';

const router = express.Router();
router.route('/estado/:id')
    .post([isAuth], controller.statusCreate)
    .delete([isAuth], controller.statusDelete)
    .patch([isAuth], controller.statusUpdate);
    
router.route('/recent/:cant')
    .get([isAuth], controller.viewRecent);
router.route('/statistics')
    .get([isAuth], controller.viewStatistics);
router.route('/')
    .get([isAuth], controller.viewAlls)
    .post([isAuth, isAdmin], controller.create);
router.route('/:id')
    .get([isAuth], controller.viewId)
    .patch([isAuth, isAdmin], controller.update)
    .delete([isAuth, isAdmin], controller.deleteEntity);

export default router;