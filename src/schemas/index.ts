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
