const Router = require('koa-router')
export const router = new Router()
const api = new Router()

// const users = require('./users-router')
// const articles = require('./articles-router')
// const profiles = require('./profiles-router')
// const tags = require('./tags-router')

import { usersRoutes } from './users-router';
import { articleRoutes } from './articles-router';
import { profilesRoutes } from './profiles-router';
import { tagsRoutes } from './tags-router';

api.use(usersRoutes)
api.use(articleRoutes)
api.use(profilesRoutes)
api.use(tagsRoutes)

router.use('/api', api.routes())

// module.exports = router
