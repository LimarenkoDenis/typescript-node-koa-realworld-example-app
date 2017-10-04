import * as Router from 'koa-router';
import { usersRoutes } from './users-router';
import { articleRoutes } from './articles-router';
import { profilesRoutes } from './profiles-router';
import { tagsRoutes } from './tags-router';

export const router: Router = new Router();
const api: Router = new Router();

api.use(usersRoutes);
api.use(articleRoutes);
api.use(profilesRoutes);
api.use(tagsRoutes);

router.use('/api', api.routes());
