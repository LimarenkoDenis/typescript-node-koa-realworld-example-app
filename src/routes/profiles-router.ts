import { profiles } from './../controllers/profiles-controller';
const Router = require('koa-router')
// const ctrl = require('controllers').profiles
const router = new Router()

// const auth = require('middleware/auth-required-middleware')
import { authMiddleware } from '../middleware/auth-required-middleware';

router.param('username', profiles.byUsername)

router.get('/profiles/:username', profiles.get)
router.post('/profiles/:username/follow', authMiddleware, profiles.follow.post)
router.del('/profiles/:username/follow', authMiddleware, profiles.follow.del)

export const profilesRoutes = router.routes()
