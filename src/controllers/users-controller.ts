import * as humps from 'humps';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as bcrypt from 'bcrypt';
import { errors } from '../lib/errors';
import { generateJWTforUser } from '../lib/utils';

export const users = {

  async get (ctx) {
    const user = generateJWTforUser(ctx.state.user)

    ctx.body = {user}
  },

  async post (ctx) {
    const {body} = ctx.request
    let {user = {}} = body
    const opts = {abortEarly: false, context: {validatePassword: true}}

    user.id = uuid()
    console.log(user);
    console.log(ctx.app.schemas);
    
    user = await ctx.app.schemas.userSchema.validate(user, opts)
    console.log(user);
    user.password = await bcrypt.hash(user.password, 10)

    await ctx.app.db('users').insert(humps.decamelizeKeys(user))

    user = generateJWTforUser(user)

    ctx.body = {user: _.omit(user, ['password'])}
  },

  async put (ctx) {
    const {body} = ctx.request
    let {user: fields = {}} = body
    const opts = {abortEarly: false, context: {validatePassword: false}}

    if (fields.password) {
      opts.context.validatePassword = true
    }

    let user = Object.assign({}, ctx.state.user, fields)
    console.log(user);
    
    user = await ctx.app.schemas.userSchema.validate(user, opts)

    if (fields.password) {
      user.password = await bcrypt.hash(user.password, 10)
    }

    user.updatedAt = new Date().toISOString()

    await ctx.app.db('users')
      .where({id: user.id})
      .update(humps.decamelizeKeys(user))

    user = generateJWTforUser(user)

    ctx.body = {user: _.omit(user, ['password'])}
  },

  async login (ctx) {
    const {body} = ctx.request

    if (!_.isObject(body.user) || !body.user.email || !body.user.password) {
      ctx.throw(
        422,
        new errors.ValidationError(['is invalid'], '', 'email or password')
      )
    }

    let user = await ctx.app.db('users')
      .first()
      .where({email: body.user.email})

    if (!user) {
      ctx.throw(
        422,
        new errors.ValidationError(['is invalid'], '', 'email or password')
      )
    }

    const isValid = await bcrypt.compare(body.user.password, user.password)

    if (!isValid) {
      ctx.throw(
        422,
        new errors.ValidationError(['is invalid'], '', 'email or password')
      )
    }

    user = generateJWTforUser(user)

    ctx.body = {user: _.omit(user, ['password'])}
  }

}
