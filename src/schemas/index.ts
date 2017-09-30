// const user = require('./user-schema')
// const article = require('./article-schema')
// const comment = require('./comment-schema')
// const tag = require('./tag-schema')

// module.exports = function (app) {
//   app.schemas = {
//     user,
//     article,
//     comment,
//     tag
//   }
// }

import { userSchema } from './user-schema';
import { articleSchema } from './article-schema';
import { commentSchema } from './comment-schema';
import { tagSchema } from './tag-schema';

export const schemas: (app) => void = (app) => {
  app.schemas = {
    userSchema,
    articleSchema,
    commentSchema,
    tagSchema
  };
};
