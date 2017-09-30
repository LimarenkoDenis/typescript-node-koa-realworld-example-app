"use strict";
// const user = require('./user-schema')
// const article = require('./article-schema')
// const comment = require('./comment-schema')
// const tag = require('./tag-schema')
Object.defineProperty(exports, "__esModule", { value: true });
// module.exports = function (app) {
//   app.schemas = {
//     user,
//     article,
//     comment,
//     tag
//   }
// }
const user_schema_1 = require("./user-schema");
const article_schema_1 = require("./article-schema");
const comment_schema_1 = require("./comment-schema");
const tag_schema_1 = require("./tag-schema");
exports.schemas = (app) => {
    app.schemas = {
        userSchema: user_schema_1.userSchema,
        articleSchema: article_schema_1.articleSchema,
        commentSchema: comment_schema_1.commentSchema,
        tagSchema: tag_schema_1.tagSchema
    };
};
//# sourceMappingURL=index.js.map