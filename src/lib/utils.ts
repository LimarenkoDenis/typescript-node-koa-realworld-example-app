import { config } from '../config';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

export function generateJWTforUser (user = {}): {} {
  return Object.assign({}, user, {
    token: jwt.sign({
      sub: _.pick(user, ['id', 'email', 'username'])
    }, config.jwtSecret, config.jwtOptions)
  });
}

export function getSelect (table, prefix, fields): string {
  return fields.map(f => `${table}.${f} as ${prefix}_${f}`);
}

