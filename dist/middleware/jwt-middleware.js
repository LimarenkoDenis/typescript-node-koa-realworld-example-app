"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaJwt = require('koa-jwt');
// const {jwtSecret} = require('config')
const config_1 = require("./../config");
exports.jwt = koaJwt({
    getToken(ctx, opts) {
        const { authorization } = ctx.header;
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            return authorization.split(' ')[1];
        }
        if (authorization && authorization.split(' ')[0] === 'Token') {
            return authorization.split(' ')[1];
        }
        return null;
    },
    secret: config_1.config.jwtSecret,
    passthrough: true,
    key: 'jwt'
});
//# sourceMappingURL=jwt-middleware.js.map