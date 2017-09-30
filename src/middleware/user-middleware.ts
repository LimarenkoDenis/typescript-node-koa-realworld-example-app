// const {has} = require('lodash')
import { has } from  'lodash';
export const userMiddleware = async (ctx, next) => {
  if (has(ctx, 'state.jwt.sub.id')) {
    ctx.state.user = await ctx.app.db('users')
      .first(
        'id',
        'email',
        'username',
        'image',
        'bio',
        'created_at',
        'updated_at'
      )
      .where({id: ctx.state.jwt.sub.id})
  }

  return next()
}
