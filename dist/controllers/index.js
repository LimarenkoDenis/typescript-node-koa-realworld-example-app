"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const users = require('./users-controller')
// const tags = require('./tags-controller')
// const profiles = require('./profiles-controller')
// const articles = require('./articles-controller')
const users_controller_1 = require("./users-controller");
const tags_controller_1 = require("./tags-controller");
const profiles_controller_1 = require("./profiles-controller");
const articles_controller_1 = require("./articles-controller");
exports.ctrl = {
    users: users_controller_1.users,
    tags: tags_controller_1.tags,
    profiles: profiles_controller_1.profiles,
    articles: articles_controller_1.articles
};
//# sourceMappingURL=index.js.map