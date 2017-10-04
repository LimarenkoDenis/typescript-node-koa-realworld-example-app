import { config } from './config';
import * as Koa from 'koa';
import * as koaHelmet from 'koa-helmet';
import * as KoaLogger from 'koa-logger';
import * as cors from 'kcors';
import * as bodyParser  from 'koa-bodyparser';

import { router } from './routes';
import { schemas } from  './schemas';

import { camelizeMiddleware } from './middleware/camelize-middleware';
import { error } from './middleware/error-middleware';
import { db } from './middleware/db-middleware';
import { jwt } from './middleware/jwt-middleware';
import { pagerMiddleware } from './middleware/pager-middleware';
import { userMiddleware } from './middleware/user-middleware';

const app = new Koa();
schemas(app);

app.keys = [config.secret];

if (!config.env.isTest) {
  app.use(koaHelmet());
}

app.use(KoaLogger());

app.use(camelizeMiddleware);

app.use(error);
app.use(db(app));
app.use(cors(config.cors));
app.use(jwt);
app.use(bodyParser(config.bodyParser));

app.use(userMiddleware);
app.use(pagerMiddleware);

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.server.port, config.server.host, () => {
  // tslint:disable-next-line
  console.log(`Listening ${config.server.host}:${config.server.port}`);
});

