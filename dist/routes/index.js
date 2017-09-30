"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require('koa-router');
exports.router = new Router();
const api = new Router();
// const users = require('./users-router')
// const articles = require('./articles-router')
// const profiles = require('./profiles-router')
// const tags = require('./tags-router')
const users_router_1 = require("./users-router");
const articles_router_1 = require("./articles-router");
const profiles_router_1 = require("./profiles-router");
const tags_router_1 = require("./tags-router");
api.use(users_router_1.usersRoutes);
api.use(articles_router_1.articleRoutes);
api.use(profiles_router_1.profilesRoutes);
api.use(tags_router_1.tagsRoutes);
exports.router.use('/api', api.routes());
// module.exports = router
//# sourceMappingURL=index.js.map