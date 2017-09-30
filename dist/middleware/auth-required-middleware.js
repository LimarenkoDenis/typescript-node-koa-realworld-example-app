"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const {UnauthorizedError} = require('lib/errors')
const errors_1 = require("../lib/errors");
exports.authMiddleware = function (ctx, next) {
    if (!ctx.state.user) {
        ctx.throw(401, new errors_1.errors.UnauthorizedError());
    }
    return next();
};
//# sourceMappingURL=auth-required-middleware.js.map