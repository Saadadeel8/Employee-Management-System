import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server-express';
import { APP_REFRESH_SECRET, APP_SECRET } from '../../config';
import Users from '../../Models/Model';

export const issueTokens = async ({
  username, email, name, id,
}) => {
  const token = jwt.sign({
    username, email, name, id,
  }, APP_SECRET, {
    expiresIn: 120,
  });
  const refreshToken = jwt.sign({
    username, email, name, id,
  }, APP_REFRESH_SECRET, {
    expiresIn: '2d',
  });
  return {
    token,
    refreshToken,
  };
};

export const getAuthUser = async (request, requiresAuth = false) => {
  const header = request.headers.authorization;
  console.log(header);
  if (header) {
    const token = jwt.verify(header, APP_SECRET);
    console.log('TOKEN_DECODED', token);
    const authUser = await Users.findById(token.id);
    if (!authUser) {
      throw new AuthenticationError('Invalid Token, User Authentication Failed');
    }
    if (requiresAuth) {
      return authUser;
    }
    return null;
  }
};

export const getRefreshTokenUser = async (request) => {
  const header = request.headers.refresh_token;
  if (header) {
    const token = jwt.verify(header, APP_REFRESH_SECRET);
    console.log('TOKEN_DECODED', token);
    const authUser = await Users.findById(token.id);
    if (!authUser) {
      throw new AuthenticationError('Invalid Refresh Token, User Authentication Failed');
    }
    return authUser;
  }
};
