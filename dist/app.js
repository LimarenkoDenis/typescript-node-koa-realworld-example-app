"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const config = require('config')
const config_1 = require("./config");
const http = require('http');
const Koa = require('koa');
const app = new Koa();
app.keys = [config_1.config.secret];
// require('schemas')(app)
const schemas_1 = require("./schemas");
schemas_1.schemas(app);
const responseTime = require('koa-response-time');
const helmet = require('koa-helmet');
const logger = require('koa-logger');
// const camelizeMiddleware = require('middleware/camelize-middleware')
const camelize_middleware_1 = require("./middleware/camelize-middleware");
const error_middleware_1 = require("./middleware/error-middleware");
// const error = require('middleware/error-middleware')
// const db = require('middleware/db-middleware')
const db_middleware_1 = require("./middleware/db-middleware");
// const cors = require('kcors')
const cors = require("kcors");
// const jwt = require('middleware/jwt-middleware')
const jwt_middleware_1 = require("./middleware/jwt-middleware");
// const bodyParser = require('koa-bodyparser');
const bodyParser = require("koa-bodyparser");
// const pagerMiddleware = require('middleware/pager-middleware')
const pager_middleware_1 = require("./middleware/pager-middleware");
// const userMiddleware = require('middleware/user-middleware')
const user_middleware_1 = require("./middleware/user-middleware");
// const routes = require('routes')
const routes_1 = require("./routes");
if (!config_1.config.env.isTest) {
    app.use(responseTime());
    app.use(helmet());
}
app.use(logger());
app.use(camelize_middleware_1.camelizeMiddleware);
app.use(error_middleware_1.error);
app.use(db_middleware_1.db(app));
app.use(cors(config_1.config.cors));
app.use(jwt_middleware_1.jwt);
app.use(bodyParser(config_1.config.bodyParser));
app.use(user_middleware_1.userMiddleware);
app.use(pager_middleware_1.pagerMiddleware);
app.use(routes_1.router.routes());
app.use(routes_1.router.allowedMethods());
app.server = require('http-shutdown')(http.createServer(app.callback()));
app.shutDown = function shutDown() {
    let err;
    console.log('Shutdown');
    if (this.server.listening) {
        this.server.shutdown(error => {
            if (error) {
                console.error(error);
                err = error;
            }
            this.db.destroy()
                .catch(error => {
                console.error(error);
                err = error;
            })
                .then(() => process.exit(err ? 1 : 0));
        });
    }
};
module.exports = app;
//# sourceMappingURL=app.js.map