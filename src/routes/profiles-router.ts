import * as Router from 'koa-router';
import { profiles } from './../controllers/profiles-controller';
import { authMiddleware } from '../middleware/auth-required-middleware';

const router: Router = new Router();

router.param('username', profiles.byUsername);

router.get('/profiles/:username', profiles.get);
router.post('/profiles/:username/follow', authMiddleware, profiles.follow.post);
router.del('/profiles/:username/follow', authMiddleware, profiles.follow.del);

export const profilesRoutes: Router.IMiddleware = router.routes();
