import * as Router from 'koa-router';
import { tags } from './../controllers/tags-controller';

const router: Router = new Router();

router.get('/tags', tags.get);

export const tagsRoutes: Router.IMiddleware = router.routes();
