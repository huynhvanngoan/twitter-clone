import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
    const config = await useRuntimeConfig();

    const accessToken = await jwt.sign({
        id: user.id,
    }, config.jwtAccessSecret, {
        expiresIn: config.jwtAccessExpiresIn,
    });

    return accessToken;

};

const generateRefreshToken = async (user) => {
    const config = await useRuntimeConfig();

    const refreshToken = await jwt.sign({
        id: user.id,
    }, config.jwtRefreshSecret, {
        expiresIn: config.jwtRefreshExpiresIn,
    });

    return refreshToken;
}

export const sendRefreshToken = async (event, token) => {
    setCookie(event, "refresh_token", token, {
        httpOnly: true,
        sameSite: true,
    })
}

export const decodeRefreshToken = async (token) => {
    try {
        const config = await useRuntimeConfig();
        return jwt.verify(token, config.jwtRefreshSecret);
    } catch (error) {
        return error;
    }
}

export const decodeAccessToken = async (token) => {
    try {
        const config = await useRuntimeConfig();
        return jwt.verify(token, config.jwtAccessSecret);
    } catch (error) {
        return error;
    }
}

export const generateTokens = async (user) => {
    const accessToken = await generateAccessToken(user);

    const refreshToken = await generateRefreshToken(user);

    return {
        accessToken: accessToken,
        refreshToken: refreshToken,
    }
}