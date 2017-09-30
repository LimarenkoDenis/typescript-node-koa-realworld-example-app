import { tags } from './../controllers/tags-controller';
const Router = require('koa-router')
// const ctrl = require('controllers').tags
const router = new Router()

router.get('/tags', tags.get)

export const tagsRoutes = router.routes()
// module.exports = router.routes()
