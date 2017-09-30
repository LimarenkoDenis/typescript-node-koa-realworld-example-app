// const users = require('./users-controller')
// const tags = require('./tags-controller')
// const profiles = require('./profiles-controller')
// const articles = require('./articles-controller')
import { users } from './users-controller';
import { tags } from './tags-controller';
import { profiles } from './profiles-controller';
import { articles } from './articles-controller';

export const ctrl = {
  users,
  tags,
  profiles,
  articles
}
