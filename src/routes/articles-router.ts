import { articles } from './../controllers/articles-controller';
const Router = require('koa-router')
// const ctrl = require('controllers').articles

const router = new Router()

// const auth = require('middleware/auth-required-middleware')
import { authMiddleware } from '../middleware/auth-required-middleware';

router.param('slug', articles.bySlug)
router.param('comment', articles.comments.byComment)

router.get('/articles', articles.get)
router.post('/articles', authMiddleware, articles.post)

router.get('/articles/feed', authMiddleware, articles.feed.get)

router.get('/articles/:slug', articles.getOne)
router.put('/articles/:slug', authMiddleware, articles.put)
router.del('/articles/:slug', authMiddleware, articles.del)

router.post('/articles/:slug/favorite', authMiddleware, articles.favorite.post)
router.del('/articles/:slug/favorite', authMiddleware, articles.favorite.del)

router.get('/articles/:slug/comments', articles.comments.get)
router.post('/articles/:slug/comments', authMiddleware, articles.comments.post)
router.del('/articles/:slug/comments/:comment', authMiddleware, articles.comments.del)

export const articleRoutes = router.routes()
