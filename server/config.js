import dotenv from 'dotenv';

dotenv.config();

export const {
  DB,
  APP_PORT,
  NODE_ENV,
  APP_SECRET,
  APP_REFRESH_SECRET,
} = process.env;
