"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const errors = require('lib/errors')
const errors_1 = require("./../lib/errors");
const constants_1 = require("./../lib/constants");
// const _ = require('lodash')
const _ = require("lodash");
const http = require('http');
Object.entries(http.STATUS_CODES).forEach(([key, value]) => {
    constants_1.constants.HTTP[key] = value
        .toUpperCase()
        .replace(/\s/igm, '_');
});
exports.error = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield next();
        if (Number(ctx.response.status) === 404 && !ctx.response.body) {
            ctx.throw(404);
        }
    }
    catch (err) {
        ctx.type = 'application/json';
        if (!ctx.response.body) {
            ctx.response.body = { errors: {} };
        }
        // ctx.app.emit('error', err, ctx);
        console.error(err);
        switch (true) {
            case err instanceof errors_1.errors.ValidationError:
                ctx.body.errors = formatValidationError(err);
                ctx.status = _.defaultTo(err.status, 422);
                break;
            case err.code === 'SQLITE_CONSTRAINT': {
                let path = 'unknown';
                if (Number(err.errno) === 19) {
                    const idx = err.message.lastIndexOf('.');
                    if (idx !== -1) {
                        path = err.message.substring(idx + 1, err.message.length);
                        ctx.body.errors[path] = ['has already been taken'];
                    }
                }
                ctx.status = _.defaultTo(err.status, 422);
                break;
            }
            case Number(err.code) === 23505: {
                let path = 'unknown';
                const [key] = err.detail.match(/\(.+?\)/g);
                if (key) {
                    path = key.substr(1, key.length - 2);
                }
                ctx.body.errors[path] = ['has already been taken'];
                ctx.status = _.defaultTo(err.status, 422);
                break;
            }
            default:
                ctx.status = _.defaultTo(err.status, 500);
                break;
        }
    }
    finally {
        if (ctx.body && !ctx.body.code) {
            ctx.body.code = constants_1.constants.HTTP[String(ctx.status)];
        }
    }
});
function formatValidationError(err) {
    const result = {};
    if (err.path) {
        result[err.path] = [_.defaultTo(err.message, 'is not valid')];
    }
    if (err.inner && err.inner.length > 0) {
        err.inner
            .map(err => formatValidationError(err))
            .reduce((prev, curr) => (Object.assign(prev, curr)), result);
    }
    return result;
}
//# sourceMappingURL=error-middleware.js.map