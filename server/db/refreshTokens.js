import prisma from "./index";

export const createRefreshToken = async ({ token, userId }) => {
    return await prisma.refreshToken.create({
        data: {
            token: token,
            userId: userId
        },
    });
}

export const getRefreshTokenByToken = async (token) => {
    return await prisma.refreshToken.findUnique({
        where: {
            token: token
        },
    });
}

export const removeRefreshTokenByToken = async (token) => {
    return await prisma.refreshToken.delete({
        where: {
            token: token
        },
    });
}

