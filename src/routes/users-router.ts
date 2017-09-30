import { users } from './../controllers/users-controller';
const Router = require('koa-router')
const router = new Router()

import { authMiddleware } from '../middleware/auth-required-middleware';
router.post('/users/login', users.login)
router.post('/users', users.post)

router.get('/user', authMiddleware, users.get)
router.put('/user', authMiddleware, users.put)

export const usersRoutes = router.routes()
