"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yup = require('yup');
const timeStampSchema = require('./time-stamp-schema');
const isUUID = require('validator/lib/isUUID');
exports.tagSchema = yup.object().shape({
    id: yup.string()
        .test({
        name: 'id',
        message: '${path} must be uuid',
        test: value => value ? isUUID(value) : true
    }),
    name: yup.string()
        .required()
        .max(30)
        .trim()
})
    .noUnknown()
    .concat(timeStampSchema);
//# sourceMappingURL=tag-schema.js.map