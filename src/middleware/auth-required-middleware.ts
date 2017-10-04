import { errors } from '../lib/errors';
import * as koa from 'koa';

export const authMiddleware: (ctx: koa.Context, next: Function) => void = (ctx: koa.Context, next: Function) => {
  if (!ctx.state.user) {
    ctx.throw(401, new errors.UnauthorizedError());
  }
  return next();
};
