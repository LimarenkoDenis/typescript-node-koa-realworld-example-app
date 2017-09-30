"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const articles_controller_1 = require("./../controllers/articles-controller");
const Router = require('koa-router');
// const ctrl = require('controllers').articles
const router = new Router();
// const auth = require('middleware/auth-required-middleware')
const auth_required_middleware_1 = require("../middleware/auth-required-middleware");
router.param('slug', articles_controller_1.articles.bySlug);
router.param('comment', articles_controller_1.articles.comments.byComment);
router.get('/articles', articles_controller_1.articles.get);
router.post('/articles', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.post);
router.get('/articles/feed', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.feed.get);
router.get('/articles/:slug', articles_controller_1.articles.getOne);
router.put('/articles/:slug', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.put);
router.del('/articles/:slug', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.del);
router.post('/articles/:slug/favorite', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.favorite.post);
router.del('/articles/:slug/favorite', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.favorite.del);
router.get('/articles/:slug/comments', articles_controller_1.articles.comments.get);
router.post('/articles/:slug/comments', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.comments.post);
router.del('/articles/:slug/comments/:comment', auth_required_middleware_1.authMiddleware, articles_controller_1.articles.comments.del);
exports.articleRoutes = router.routes();
//# sourceMappingURL=articles-router.js.map