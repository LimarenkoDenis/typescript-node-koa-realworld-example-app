"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const {jwtSecret, jwtOptions} = require('config')
const config_1 = require("../config");
const jwt = require('jsonwebtoken');
const _ = require('lodash');
function generateJWTforUser(user = {}) {
    return Object.assign({}, user, {
        token: jwt.sign({
            sub: _.pick(user, ['id', 'email', 'username'])
        }, config_1.config.jwtSecret, config_1.config.jwtOptions)
    });
}
exports.generateJWTforUser = generateJWTforUser;
function getSelect(table, prefix, fields) {
    return fields.map(f => `${table}.${f} as ${prefix}_${f}`);
}
exports.getSelect = getSelect;
// exports.generateJWTforUser = generateJWTforUser
// exports.getSelect = getSelect
//# sourceMappingURL=utils.js.map