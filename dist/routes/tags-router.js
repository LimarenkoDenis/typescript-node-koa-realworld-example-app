"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tags_controller_1 = require("./../controllers/tags-controller");
const Router = require('koa-router');
// const ctrl = require('controllers').tags
const router = new Router();
router.get('/tags', tags_controller_1.tags.get);
exports.tagsRoutes = router.routes();
// module.exports = router.routes()
//# sourceMappingURL=tags-router.js.map