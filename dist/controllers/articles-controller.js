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
const slug = require('slug');
const uuid = require('uuid');
const humps = require('humps');
const _ = require('lodash');
const comments = require('./comments-controller');
// const {ValidationError} = require('lib/errors')
const errors_1 = require("../lib/errors");
// const {getSelect} = require('lib/utils')
const utils_1 = require("../lib/utils");
// const {articleFields, userFields, relationsMaps} = require('lib/relations-map')
const relations_map_1 = require("../lib/relations-map");
const joinJs = require('join-js').default;
exports.articles = {
    bySlug(slug, ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!slug) {
                ctx.throw(404);
            }
            const article = yield ctx.app.db('articles')
                .first()
                .where({ slug });
            if (!article) {
                ctx.throw(404);
            }
            const tagsRelations = yield ctx.app.db('articles_tags')
                .select()
                .where({ article: article.id });
            let tagList = [];
            if (tagsRelations && tagsRelations.length > 0) {
                tagList = yield ctx.app.db('tags')
                    .select()
                    .whereIn('id', tagsRelations.map(r => r.tag));
                tagList = tagList.map(t => t.name);
            }
            article.tagList = tagList;
            article.favorited = false;
            const author = yield ctx.app.db('users')
                .first('username', 'bio', 'image', 'id')
                .where({ id: article.author });
            article.author = author;
            article.author.following = false;
            const { user } = ctx.state;
            if (user && user.username !== article.author.username) {
                const res = yield ctx.app.db('followers')
                    .where({ user: article.author.id, follower: user.id })
                    .select();
                if (res.length > 0) {
                    article.author.following = true;
                }
            }
            let favorites = [];
            if (user) {
                favorites = yield ctx.app.db('favorites')
                    .where({ user: user.id, article: article.id })
                    .select();
                if (favorites.length > 0) {
                    article.favorited = true;
                }
            }
            ctx.params.article = article;
            ctx.params.favorites = favorites;
            ctx.params.author = author;
            ctx.params.tagList = tagList;
            ctx.params.tagsRelations = tagsRelations;
            yield next();
            delete ctx.params.author.id;
        });
    },
    get(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user } = ctx.state;
            const { offset, limit, tag, author, favorited } = ctx.query;
            let articlesQuery = ctx.app.db('articles')
                .select(...utils_1.getSelect('articles', 'article', relations_map_1.articleFields), ...utils_1.getSelect('users', 'author', relations_map_1.userFields), ...utils_1.getSelect('articles_tags', 'tag', ['id']), ...utils_1.getSelect('tags', 'tag', ['id', 'name']), 'favorites.id as article_favorited', 'followers.id as author_following')
                .limit(limit)
                .offset(offset)
                .orderBy('articles.created_at', 'desc');
            let conutQuery = ctx.app.db('articles').count();
            if (author && author.length > 0) {
                const subQuery = ctx.app.db('users')
                    .select('id')
                    .whereIn('username', author);
                articlesQuery = articlesQuery.andWhere('articles.author', 'in', subQuery);
                conutQuery = conutQuery.andWhere('articles.author', 'in', subQuery);
            }
            if (favorited && favorited.length > 0) {
                const subQuery = ctx.app.db('favorites')
                    .select('article')
                    .whereIn('user', ctx.app.db('users').select('id').whereIn('username', favorited));
                articlesQuery = articlesQuery.andWhere('articles.id', 'in', subQuery);
                conutQuery = conutQuery.andWhere('articles.id', 'in', subQuery);
            }
            if (tag && tag.length > 0) {
                const subQuery = ctx.app.db('articles_tags')
                    .select('article')
                    .whereIn('tag', ctx.app.db('tags').select('id').whereIn('name', tag));
                articlesQuery = articlesQuery.andWhere('articles.id', 'in', subQuery);
                conutQuery = conutQuery.andWhere('articles.id', 'in', subQuery);
            }
            articlesQuery = articlesQuery
                .leftJoin('users', 'articles.author', 'users.id')
                .leftJoin('articles_tags', 'articles.id', 'articles_tags.article')
                .leftJoin('tags', 'articles_tags.tag', 'tags.id')
                .leftJoin('favorites', function () {
                this.on('articles.id', '=', 'favorites.article')
                    .onIn('favorites.user', [user && user.id]);
            })
                .leftJoin('followers', function () {
                this.on('articles.author', '=', 'followers.user')
                    .onIn('followers.follower', [user && user.id]);
            });
            let [articles, [countRes]] = yield Promise.all([articlesQuery, conutQuery]);
            articles = joinJs
                .map(articles, relations_map_1.relationsMaps, 'articleMap', 'article_')
                .map(a => {
                a.favorited = Boolean(a.favorited);
                a.tagList = a.tagList.map(t => t.name);
                a.author.following = Boolean(a.author.following);
                delete a.author.id;
                return a;
            });
            let articlesCount = countRes.count || countRes['count(*)'];
            articlesCount = Number(articlesCount);
            ctx.body = { articles, articlesCount };
        });
    },
    getOne(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            ctx.body = { article: ctx.params.article };
        });
    },
    post(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { body } = ctx.request;
            let { article } = body;
            let tags;
            const opts = { abortEarly: false };
            article.id = uuid();
            article.author = ctx.state.user.id;
            article = yield ctx.app.schemas.article.validate(article, opts);
            article.slug = slug(_.get(article, 'title', ''), { lower: true });
            if (article.tagList && article.tagList.length > 0) {
                tags = yield Promise.all(article.tagList
                    .map(t => ({ id: uuid(), name: t }))
                    .map(t => ctx.app.schemas.tag.validate(t, opts)));
            }
            try {
                yield ctx.app.db('articles')
                    .insert(humps.decamelizeKeys(_.omit(article, ['tagList'])));
            }
            catch (err) {
                if (Number(err.errno) === 19 || Number(err.code) === 23505) {
                    article.slug = article.slug + '-' + uuid().substr(-6);
                    yield ctx.app.db('articles')
                        .insert(humps.decamelizeKeys(_.omit(article, ['tagList'])));
                }
                else {
                    throw err;
                }
            }
            if (tags && tags.length) {
                for (var i = 0; i < tags.length; i++) {
                    try {
                        yield ctx.app.db('tags').insert(humps.decamelizeKeys(tags[i]));
                    }
                    catch (err) {
                        if (Number(err.errno) !== 19 && Number(err.code) !== 23505) {
                            throw err;
                        }
                    }
                }
                tags = yield ctx.app.db('tags')
                    .select()
                    .whereIn('name', tags.map(t => t.name));
                const relations = tags.map(t => ({
                    id: uuid(),
                    tag: t.id,
                    article: article.id
                }));
                yield ctx.app.db('articles_tags').insert(relations);
            }
            article.favorited = false;
            article.author = _.pick(ctx.state.user, ['username', 'bio', 'image']);
            article.author.following = false;
            ctx.body = { article };
        });
    },
    put(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { article } = ctx.params;
            if (article.author.id !== ctx.state.user.id) {
                ctx.throw(403, new errors_1.errors.ValidationError(['not owned by user'], '', 'article'));
            }
            const { body } = ctx.request;
            let { article: fields = {} } = body;
            const opts = { abortEarly: false };
            let newArticle = Object.assign({}, article, fields);
            newArticle.author = newArticle.author.id;
            newArticle = yield ctx.app.schemas.article.validate(humps.camelizeKeys(newArticle), opts);
            if (fields.title) {
                newArticle.slug = slug(_.get(newArticle, 'title', ''), { lower: true });
            }
            newArticle.updatedAt = new Date().toISOString();
            try {
                yield ctx.app.db('articles')
                    .update(humps.decamelizeKeys(_.pick(newArticle, ['title', 'slug', 'body', 'description', 'updatedAt'])))
                    .where({ id: article.id });
            }
            catch (err) {
                if (Number(err.errno) === 19 || Number(err.code) === 23505) {
                    newArticle.slug = newArticle.slug + '-' + uuid().substr(-6);
                    yield ctx.app.db('articles')
                        .update(humps.decamelizeKeys(_.pick(newArticle, ['title', 'slug', 'body', 'description', 'updatedAt'])))
                        .where({ id: article.id });
                }
                else {
                    throw err;
                }
            }
            if (fields.tagList && fields.tagList.length === 0) {
                yield ctx.app.db('articles_tags')
                    .del()
                    .where({ article: article.id });
            }
            if (fields.tagList && fields.tagList.length > 0) {
                if (_.difference(article.tagList).length || _.difference(fields.tagList).length) {
                    yield ctx.app.db('articles_tags')
                        .del()
                        .where({ article: article.id });
                    let tags = yield Promise.all(newArticle.tagList
                        .map(t => ({ id: uuid(), name: t }))
                        .map(t => ctx.app.schemas.tag.validate(t, opts)));
                    for (var i = 0; i < tags.length; i++) {
                        try {
                            yield ctx.app.db('tags').insert(humps.decamelizeKeys(tags[i]));
                        }
                        catch (err) {
                            if (Number(err.errno) !== 19 && Number(err.code) !== 23505) {
                                throw err;
                            }
                        }
                    }
                    tags = yield ctx.app.db('tags')
                        .select()
                        .whereIn('name', tags.map(t => t.name));
                    const relations = tags.map(t => ({
                        id: uuid(),
                        tag: t.id,
                        article: article.id
                    }));
                    yield ctx.app.db('articles_tags').insert(relations);
                }
            }
            newArticle.author = ctx.params.author;
            newArticle.favorited = article.favorited;
            ctx.body = { article: newArticle };
        });
    },
    del(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            const { article } = ctx.params;
            if (article.author.id !== ctx.state.user.id) {
                ctx.throw(403, new errors_1.errors.ValidationError(['not owned by user'], '', 'article'));
            }
            yield Promise.all([
                ctx.app.db('favorites')
                    .del()
                    .where({ user: ctx.state.user.id, article: article.id }),
                ctx.app.db('articles_tags')
                    .del()
                    .where({ article: article.id }),
                ctx.app.db('articles')
                    .del()
                    .where({ id: article.id })
            ]);
            ctx.body = {};
        });
    },
    feed: {
        get(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { user } = ctx.state;
                const { offset, limit } = ctx.query;
                const followedQuery = ctx.app.db('followers')
                    .pluck('user')
                    .where({ follower: user.id });
                let [articles, [countRes]] = yield Promise.all([
                    ctx.app.db('articles')
                        .select(...utils_1.getSelect('articles', 'article', relations_map_1.articleFields), ...utils_1.getSelect('users', 'author', relations_map_1.userFields), ...utils_1.getSelect('articles_tags', 'tag', ['id']), ...utils_1.getSelect('tags', 'tag', ['id', 'name']), 'favorites.id as article_favorited')
                        .whereIn('articles.author', followedQuery)
                        .limit(limit)
                        .offset(offset)
                        .orderBy('articles.created_at', 'desc')
                        .leftJoin('users', 'articles.author', 'users.id')
                        .leftJoin('articles_tags', 'articles.id', 'articles_tags.article')
                        .leftJoin('tags', 'articles_tags.tag', 'tags.id')
                        .leftJoin('favorites', function () {
                        this.on('articles.id', '=', 'favorites.article')
                            .onIn('favorites.user', [user && user.id]);
                    }),
                    ctx.app.db('articles').count().whereIn('author', followedQuery)
                ]);
                articles = joinJs
                    .map(articles, relations_map_1.relationsMaps, 'articleMap', 'article_')
                    .map(a => {
                    a.favorited = Boolean(a.favorited);
                    a.tagList = a.tagList.map(t => t.name);
                    a.author.following = true;
                    delete a.author.id;
                    return a;
                });
                let articlesCount = countRes.count || countRes['count(*)'];
                articlesCount = Number(articlesCount);
                ctx.body = { articles, articlesCount };
            });
        }
    },
    favorite: {
        post(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { article } = ctx.params;
                if (article.favorited) {
                    ctx.body = { article: ctx.params.article };
                    return;
                }
                yield Promise.all([
                    ctx.app.db('favorites').insert({
                        id: uuid(),
                        user: ctx.state.user.id,
                        article: article.id
                    }),
                    ctx.app.db('articles')
                        .increment('favorites_count', 1)
                        .where({ id: article.id })
                ]);
                article.favorited = true;
                article.favorites_count = Number(article.favorites_count) + 1;
                ctx.body = { article: ctx.params.article };
            });
        },
        del(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const { article } = ctx.params;
                if (!article.favorited) {
                    ctx.body = { article: ctx.params.article };
                    return;
                }
                yield Promise.all([
                    ctx.app.db('favorites')
                        .del()
                        .where({ user: ctx.state.user.id, article: article.id }),
                    ctx.app.db('articles')
                        .decrement('favorites_count', 1)
                        .where({ id: article.id })
                ]);
                article.favorited = false;
                article.favorites_count = Number(article.favorites_count) - 1;
                ctx.body = { article: ctx.params.article };
            });
        }
    },
    comments
};
//# sourceMappingURL=articles-controller.js.map