import * as Router from 'koa-router';
const router: Router = new Router();
import { users } from './../controllers/users-controller';
import { authMiddleware } from '../middleware/auth-required-middleware';

router.post('/users/login', users.login);
router.post('/users', users.post);

router.get('/user', authMiddleware, users.get);
router.put('/user', authMiddleware, users.put);

export const usersRoutes: Router.IMiddleware = router.routes();
