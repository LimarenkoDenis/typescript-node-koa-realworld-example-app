const yup = require('yup')
const isUUID = require('validator/lib/isUUID')
import { timeStampSchema } from './time-stamp-schema';

export const articleSchema: any = yup.object().shape({

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

  slug: yup.string()
    .trim(),

  title: yup.string()
    .required()
    .trim(),

  body: yup.string()
    .required()
    .trim(),

  description: yup.string()
    .required()
    .trim(),

  favoritesCount: yup.number()
    .required()
    .default(0),

  tagList: yup.array()
    .of(yup.string())

})
  .noUnknown()
  .concat(timeStampSchema);

