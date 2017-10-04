const yup = require('yup')
const isUUID = require('validator/lib/isUUID')
import { timeStampSchema } from './time-stamp-schema';

export const commentSchema: any = yup.object().shape({

  id: yup.string()
    .test({
      name: 'id',
      message: '${path} must be uuid', // eslint-disable-line
      test: (value: boolean) => value ? isUUID(value) : true
    }),

  author: yup.string()
    .test({
      name: 'user',
      message: '${path} must be uuid', // eslint-disable-line
      test: (value: boolean) => value ? isUUID(value) : true
    }),

  article: yup.string()
    .test({
      name: 'article',
      message: '${path} must be uuid', // eslint-disable-line
      test: (value: boolean) => value ? isUUID(value) : true
    }),

  body: yup.string()
    .required()
    .trim()

})
  .noUnknown()
  .concat(timeStampSchema);

