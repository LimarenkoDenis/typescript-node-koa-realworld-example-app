// const {UnauthorizedError} = require('lib/errors')
import {errors} from '../lib/errors';

export const authMiddleware = function (ctx, next) {
  if (!ctx.state.user) {
    ctx.throw(401, new errors.UnauthorizedError());
  }
  return next()
}
