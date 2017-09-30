import { users } from './../controllers/users-controller';
const Router = require('koa-router')
// const ctrl = require('controllers').users
const router = new Router()

// const auth = require('middleware/auth-required-middleware')
import { authMiddleware } from '../middleware/auth-required-middleware';
router.post('/users/login', users.login)
router.post('/users', users.post)

router.get('/user', authMiddleware, users.get)
router.put('/user', authMiddleware, users.put)

export const usersRoutes = router.routes()
// module.exports = router.routes()
