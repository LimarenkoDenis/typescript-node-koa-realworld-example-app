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
// const {has} = require('lodash')
const lodash_1 = require("lodash");
exports.userMiddleware = (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    if (lodash_1.has(ctx, 'state.jwt.sub.id')) {
        ctx.state.user = yield ctx.app.db('users')
            .first('id', 'email', 'username', 'image', 'bio', 'created_at', 'updated_at')
            .where({ id: ctx.state.jwt.sub.id });
    }
    return next();
});
//# sourceMappingURL=user-middleware.js.map