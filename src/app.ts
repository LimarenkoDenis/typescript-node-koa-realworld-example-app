import { config } from './config';
import * as http from 'http';
import * as Koa from 'koa';
import * as koaHelmet from 'koa-helmet';
import * as KoaLogger from 'koa-logger';
import { router } from './routes';
import { schemas } from  './schemas';
import * as cors from 'kcors';
import * as bodyParser  from 'koa-bodyparser';

const app = new Koa();
schemas(app);

app.keys = [config.secret];

const responseTime = require('koa-response-time');

import { camelizeMiddleware } from './middleware/camelize-middleware';
import { error } from './middleware/error-middleware';
import { db } from './middleware/db-middleware';
import { jwt } from './middleware/jwt-middleware';
import { pagerMiddleware } from './middleware/pager-middleware';
import { userMiddleware } from './middleware/user-middleware';

if (!config.env.isTest) {
  app.use(responseTime());
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

app.server = require('http-shutdown')(http.createServer(app.callback()));

app.shutDown = function shutDown () {
  let err

  console.log('Shutdown')

  if (this.server.listening) {
    this.server.shutdown(error => {
      if (error) {
        console.error(error)
        err = error
      }

      this.db.destroy()
        .catch(error => {
          console.error(error)
          err = error
        })
        .then(() => process.exit(err ? 1 : 0))
    })
  }
}

module.exports = app;
