"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users_controller_1 = require("./../controllers/users-controller");
const Router = require('koa-router');
// const ctrl = require('controllers').users
const router = new Router();
// const auth = require('middleware/auth-required-middleware')
const auth_required_middleware_1 = require("../middleware/auth-required-middleware");
router.post('/users/login', users_controller_1.users.login);
router.post('/users', users_controller_1.users.post);
router.get('/user', auth_required_middleware_1.authMiddleware, users_controller_1.users.get);
router.put('/user', auth_required_middleware_1.authMiddleware, users_controller_1.users.put);
exports.usersRoutes = router.routes();
// module.exports = router.routes()
//# sourceMappingURL=users-router.js.map