import { p as prisma } from '../runtime.mjs';

const createRefreshToken = async ({ token, userId }) => {
  return await prisma.refreshToken.create({
    data: {
      token,
      userId
    }
  });
};
const getRefreshTokenByToken = async (token) => {
  return await prisma.refreshToken.findUnique({
    where: {
      token
    }
  });
};
const removeRefreshTokenByToken = async (token) => {
  return await prisma.refreshToken.delete({
    where: {
      token
    }
  });
};

export { createRefreshToken as c, getRefreshTokenByToken as g, removeRefreshTokenByToken as r };
//# sourceMappingURL=refreshTokens.mjs.map
