// const {jwtSecret, jwtOptions} = require('config')
import {config} from '../config';
const jwt = require('jsonwebtoken')
const _ = require('lodash')

export function generateJWTforUser (user = {}) {
  return Object.assign({}, user, {
    token: jwt.sign({
      sub: _.pick(user, ['id', 'email', 'username'])
    }, config.jwtSecret, config.jwtOptions)
  })
}

export function getSelect (table, prefix, fields) {
  return fields.map(f => `${table}.${f} as ${prefix}_${f}`)
}

// exports.generateJWTforUser = generateJWTforUser
// exports.getSelect = getSelect
