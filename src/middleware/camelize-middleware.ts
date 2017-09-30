const humps = require('humps')
const _ = require('lodash')

export const camelizeMiddleware = async function (ctx, next) {
  await next()
  if (ctx.body && _.isObjectLike(ctx.body)) {
    ctx.body = humps.camelizeKeys(ctx.body)
  }
}
