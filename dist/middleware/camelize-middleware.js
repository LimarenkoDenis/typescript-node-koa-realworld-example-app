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
const humps = require('humps');
const _ = require('lodash');
exports.camelizeMiddleware = function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield next();
        if (ctx.body && _.isObjectLike(ctx.body)) {
            ctx.body = humps.camelizeKeys(ctx.body);
        }
    });
};
//# sourceMappingURL=camelize-middleware.js.map