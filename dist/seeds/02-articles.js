"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const faker = require('faker');
const _ = require('lodash');
const uuid = require('uuid');
const slug = require('slug');
const { subMonths } = require('date-fns');
const config = require('../config');
const { getUsers } = require('./01-users');
function getArticles(users) {
    return _.flatMap(users, function (user) {
        return Array.from({ length: 105 }, function () {
            const title = faker.lorem.sentence();
            const date = faker.date.between(subMonths(new Date(), 18), new Date())
                .toISOString();
            return {
                id: uuid(),
                author: user.id,
                title,
                slug: slug(title, { lower: true }),
                body: faker.lorem.sentences(10),
                description: faker.lorem.sentences(2),
                created_at: date,
                updated_at: date
            };
        });
    });
}
exports.getArticles = getArticles;
exports.seed = function (knex) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = getUsers();
        if (config.env.isProd) {
            yield knex('articles').whereIn('author', users.map(u => u.id)).del();
        }
        else {
            yield knex('articles').del();
        }
        return Promise.all(getArticles(users).map(a => knex('articles').insert(a)));
    });
};
//# sourceMappingURL=02-articles.js.map