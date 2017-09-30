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
// const {getSelect} = require('lib/utils')
const utils_1 = require("../lib/utils");
// const {commentFields, userFields, relationsMaps} = require('lib/relations-map')
const relations_map_1 = require("../lib/relations-map");
const joinJs = require('join-js').default;
module.exports = {
    byComment(comment, ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!comment) {
                ctx.throw(404);
            }
            comment = yield ctx.app.db('comments').first().where({ id: comment });
            if (!comment) {
                ctx.throw(404);
            }
            ctx.params.comment = comment;
            return next();
        });
    },
    get(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = ctx.state;
            const { article } = ctx.params;
            let comments = yield ctx.app.db('comments')
                .select(...utils_1.getSelect('comments', 'comment', relations_map_1.commentFields), ...utils_1.getSelect('users', 'author', relations_map_1.userFields), 'followers.id as author_following')
                .where({ article: article.id })
                .leftJoin('users', 'comments.author', 'users.id')
                .leftJoin('followers', function () {
                this
                    .on('users.id', '=', 'followers.user')
                    .onIn('followers.follower', [user && user.id]);
            });
            comments = joinJs
                .map(comments, relations_map_1.relationsMaps, 'commentMap', 'comment_')
                .map(c => {
                delete c.author.id;
                c.author.following = Boolean(c.author.following);
                return c;
            });
            ctx.body = { comments };
        });
    },
    post(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = ctx.request;
            const { user } = ctx.state;
            const { article } = ctx.params;
            let { comment = {} } = body;
            const opts = { abortEarly: false };
            comment.id = uuid();
            comment.author = user.id;
            comment.article = article.id;
            comment = yield ctx.app.schemas.comment.validate(comment, opts);
            yield ctx.app.db('comments').insert(humps.decamelizeKeys(comment));
            comment.author = _.pick(user, ['username', 'bio', 'image', 'id']);
            ctx.body = { comment };
        });
    },
    del(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment } = ctx.params;
            yield ctx.app.db('comments').del().where({ id: comment.id });
            ctx.body = {};
        });
    }
};
//# sourceMappingURL=comments-controller.js.map