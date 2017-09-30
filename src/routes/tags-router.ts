import { tags } from './../controllers/tags-controller';
const Router = require('koa-router')
const router = new Router()

router.get('/tags', tags.get)

export const tagsRoutes = router.routes()
