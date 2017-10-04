import * as humps from 'humps';
import * as _ from 'lodash';
import * as koa from 'koa';

export const camelizeMiddleware: (ctx: koa.Context, next: Function) => void =
  async (ctx: koa.Context, next: Function) => {
    await next();
    if (ctx.body && _.isObjectLike(ctx.body)) {
      ctx.body = humps.camelizeKeys(ctx.body);
    }
};
