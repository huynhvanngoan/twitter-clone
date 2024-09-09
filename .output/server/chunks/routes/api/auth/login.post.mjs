import { d as defineEventHandler, r as readBody, s as sendError, c as createError, g as getUserByUsername, a as generateTokens, b as sendRefreshToken } from '../../../runtime.mjs';
import bcrypt from 'bcrypt';
import { c as createRefreshToken } from '../../../_/refreshTokens.mjs';
import { u as userTransformer } from '../../../_/user.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';

const login_post = defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);
  if (!username || !password) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: "Invalid username or password"
    }));
  }
  const user = await getUserByUsername(username);
  if (!user) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: "Invalid username or password"
    }));
  }
  const isPasswordMatch = bcrypt.compareSync(password, user.password);
  if (!isPasswordMatch) {
    return sendError(event, createError({
      statusCode: 400,
      statusMessage: "Bad Request",
      message: "Invalid username or password"
    }));
  }
  const { accessToken, refreshToken } = await generateTokens(user);
  await createRefreshToken({
    token: refreshToken,
    userId: user.id
  });
  sendRefreshToken(event, refreshToken);
  return {
    accessToken,
    user: userTransformer(user)
  };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
