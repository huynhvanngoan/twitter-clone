import { d as defineEventHandler, e as getCookie, s as sendError, c as createError, f as decodeRefreshToken, h as getUserById, a as generateTokens } from '../../../runtime.mjs';
import { g as getRefreshTokenByToken } from '../../../_/refreshTokens.mjs';
import { u as userTransformer } from '../../../_/user.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';
import 'bcrypt';

const refresh_get = defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refresh_token");
  if (!refreshToken) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Refresh token is missing"
    }));
  }
  const refreshTokenData = await getRefreshTokenByToken(refreshToken);
  if (!refreshTokenData) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Refresh token is invalid"
    }));
  }
  const decodedRefreshToken = await decodeRefreshToken(refreshToken);
  try {
    const user = await getUserById(decodedRefreshToken.id);
    if (!user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "User not found"
      }));
    }
    const { accessToken } = await generateTokens(user);
    return {
      accessToken,
      user: userTransformer(user)
    };
  } catch (error) {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "Something went wrong"
    }));
  }
});

export { refresh_get as default };
//# sourceMappingURL=refresh.get.mjs.map
