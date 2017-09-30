// const config = require('config')
import { config } from './config';
const http = require('http')
const Koa = require('koa')

const app = new Koa()

app.keys = [config.secret]

// require('schemas')(app)
import { schemas } from  './schemas';
schemas(app);

const responseTime = require('koa-response-time')
const helmet = require('koa-helmet')
const logger = require('koa-logger')
// const camelizeMiddleware = require('middleware/camelize-middleware')
import { camelizeMiddleware } from './middleware/camelize-middleware';
import { error } from './middleware/error-middleware';

// const error = require('middleware/error-middleware')
// const db = require('middleware/db-middleware')
import { db } from './middleware/db-middleware';

// const cors = require('kcors')
import * as cors from 'kcors';

// const jwt = require('middleware/jwt-middleware')
import { jwt } from './middleware/jwt-middleware';

// const bodyParser = require('koa-bodyparser');
import * as bodyParser  from 'koa-bodyparser';
// const pagerMiddleware = require('middleware/pager-middleware')
import { pagerMiddleware } from './middleware/pager-middleware';

// const userMiddleware = require('middleware/user-middleware')
import { userMiddleware } from './middleware/user-middleware';

// const routes = require('routes')
import { router } from './routes';

if (!config.env.isTest) {
  app.use(responseTime())
  app.use(helmet())
}

app.use(logger())

app.use(camelizeMiddleware)

app.use(error)
app.use(db(app))
app.use(cors(config.cors));
app.use(jwt)
app.use(bodyParser(config.bodyParser))

app.use(userMiddleware)
app.use(pagerMiddleware)

app.use(router.routes())
app.use(router.allowedMethods())

app.server = require('http-shutdown')(http.createServer(app.callback()))

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

module.exports = app
