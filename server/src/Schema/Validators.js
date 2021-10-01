import Joi from '@hapi/joi';

const name = Joi.string().max(255).label('Name').required();
const email = Joi.string().email().label('Email').required();
const username = Joi.string().max(255).min(4)
  .label('Username')
  .required();
const password = Joi.string().max(30).min(6)
  .label('Password')
  .required();

export const loginValidate = Joi.object().keys({
  username,
  password,
});

export const registerValidate = Joi.object().keys({
  username,
  password,
  email,
  name,
});
