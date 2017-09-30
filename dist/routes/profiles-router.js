"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const profiles_controller_1 = require("./../controllers/profiles-controller");
const Router = require('koa-router');
// const ctrl = require('controllers').profiles
const router = new Router();
// const auth = require('middleware/auth-required-middleware')
const auth_required_middleware_1 = require("../middleware/auth-required-middleware");
router.param('username', profiles_controller_1.profiles.byUsername);
router.get('/profiles/:username', profiles_controller_1.profiles.get);
router.post('/profiles/:username/follow', auth_required_middleware_1.authMiddleware, profiles_controller_1.profiles.follow.post);
router.del('/profiles/:username/follow', auth_required_middleware_1.authMiddleware, profiles_controller_1.profiles.follow.del);
exports.profilesRoutes = router.routes();
//# sourceMappingURL=profiles-router.js.map