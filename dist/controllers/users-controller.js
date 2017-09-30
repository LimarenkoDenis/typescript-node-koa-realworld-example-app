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
const uuid = require('uuid');
const _ = require('lodash');
const bcrypt = require('bcrypt');
// const {ValidationError} = require('lib/errors')
const errors_1 = require("../lib/errors");
// const {generateJWTforUser} = require('lib/utils')
const utils_1 = require("../lib/utils");
exports.users = {
    get(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = utils_1.generateJWTforUser(ctx.state.user);
            ctx.body = { user };
        });
    },
    post(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = ctx.request;
            let { user = {} } = body;
            const opts = { abortEarly: false, context: { validatePassword: true } };
            user.id = uuid();
            user = yield ctx.app.schemas.user.validate(user, opts);
            user.password = yield bcrypt.hash(user.password, 10);
            yield ctx.app.db('users').insert(humps.decamelizeKeys(user));
            user = utils_1.generateJWTforUser(user);
            ctx.body = { user: _.omit(user, ['password']) };
        });
    },
    put(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = ctx.request;
            let { user: fields = {} } = body;
            const opts = { abortEarly: false, context: { validatePassword: false } };
            if (fields.password) {
                opts.context.validatePassword = true;
            }
            let user = Object.assign({}, ctx.state.user, fields);
            user = yield ctx.app.schemas.user.validate(user, opts);
            if (fields.password) {
                user.password = yield bcrypt.hash(user.password, 10);
            }
            user.updatedAt = new Date().toISOString();
            yield ctx.app.db('users')
                .where({ id: user.id })
                .update(humps.decamelizeKeys(user));
            user = utils_1.generateJWTforUser(user);
            ctx.body = { user: _.omit(user, ['password']) };
        });
    },
    login(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = ctx.request;
            if (!_.isObject(body.user) || !body.user.email || !body.user.password) {
                ctx.throw(422, new errors_1.errors.ValidationError(['is invalid'], '', 'email or password'));
            }
            let user = yield ctx.app.db('users')
                .first()
                .where({ email: body.user.email });
            if (!user) {
                ctx.throw(422, new errors_1.errors.ValidationError(['is invalid'], '', 'email or password'));
            }
            const isValid = yield bcrypt.compare(body.user.password, user.password);
            if (!isValid) {
                ctx.throw(422, new errors_1.errors.ValidationError(['is invalid'], '', 'email or password'));
            }
            user = utils_1.generateJWTforUser(user);
            ctx.body = { user: _.omit(user, ['password']) };
        });
    }
};
//# sourceMappingURL=users-controller.js.map