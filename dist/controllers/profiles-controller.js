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
const _ = require('lodash');
const uuid = require('uuid');
// const {getSelect} = require('lib/utils')
const utils_1 = require("../lib/utils");
const relations_map_1 = require("../lib/relations-map");
const joinJs = require('join-js').default;
exports.profiles = {
    byUsername(username, ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!username) {
                ctx.throw(404);
            }
            const { user } = ctx.state;
            ctx.params.profile = yield ctx.app.db('users')
                .select(...utils_1.getSelect('users', 'profile', relations_map_1.userFields), 'followers.id as profile_following')
                .where({ username })
                .leftJoin('followers', function () {
                this
                    .on('users.id', '=', 'followers.user')
                    .onIn('followers.follower', [user && user.id]);
            });
            if (!ctx.params.profile || !ctx.params.profile.length) {
                ctx.throw(404);
            }
            ctx.params.profile = joinJs.mapOne(ctx.params.profile, relations_map_1.relationsMaps, 'userMap', 'profile_');
            yield next();
            if (ctx.body.profile) {
                ctx.body.profile = _.omit(ctx.body.profile, 'id');
                ctx.body.profile.following = Boolean(ctx.body.profile.following);
            }
        });
    },
    get(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { profile } = ctx.params;
            ctx.body = { profile };
        });
    },
    follow: {
        post(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { profile } = ctx.params;
                const { user } = ctx.state;
                if (profile.following) {
                    ctx.body = { profile };
                    return;
                }
                if (user.username !== profile.username) {
                    const follow = {
                        id: uuid(),
                        user: profile.id,
                        follower: user.id
                    };
                    try {
                        yield ctx.app.db('followers').insert(follow);
                    }
                    catch (err) {
                        if (Number(err.errno) !== 19 && Number(err.code) !== 23505) {
                            throw err;
                        }
                    }
                    profile.following = true;
                }
                ctx.body = { profile };
            });
        },
        del(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { profile } = ctx.params;
                const { user } = ctx.state;
                if (!profile.following) {
                    ctx.body = { profile };
                    return;
                }
                yield ctx.app.db('followers')
                    .where({ user: profile.id, follower: user.id })
                    .del();
                profile.following = false;
                ctx.body = { profile };
            });
        }
    }
};
//# sourceMappingURL=profiles-controller.js.map