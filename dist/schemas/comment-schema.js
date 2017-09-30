"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require('yup');
const timeStampSchema = require('./time-stamp-schema');
const isUUID = require('validator/lib/isUUID');
exports.commentSchema = yup.object().shape({
    id: yup.string()
        .test({
        name: 'id',
        message: '${path} must be uuid',
        test: value => value ? isUUID(value) : true
    }),
    author: yup.string()
        .test({
        name: 'user',
        message: '${path} must be uuid',
        test: value => value ? isUUID(value) : true
    }),
    article: yup.string()
        .test({
        name: 'article',
        message: '${path} must be uuid',
        test: value => value ? isUUID(value) : true
    }),
    body: yup.string()
        .required()
        .trim()
})
    .noUnknown()
    .concat(timeStampSchema);
//# sourceMappingURL=comment-schema.js.map