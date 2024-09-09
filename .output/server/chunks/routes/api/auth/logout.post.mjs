import { d as defineEventHandler, b as sendRefreshToken } from '../../../runtime.mjs';
import { r as removeRefreshTokenByToken } from '../../../_/refreshTokens.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';
import 'bcrypt';

const logout_post = defineEventHandler(async (event) => {
  try {
    const cookies = getCookies(event);
    const refreshToken = cookies.refresh_token;
    await removeRefreshTokenByToken(refreshToken);
  } catch (error) {
  }
  sendRefreshToken(event, null);
  return {
    message: "Logout successful"
  };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
