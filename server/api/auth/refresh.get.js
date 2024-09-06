import { getRefreshTokenByToken } from "~/server/db/refreshTokens";
import { getUserById } from "~/server/db/users";
import { decodeRefreshToken } from "~/server/utils/jwt";
import { userTransformer } from "../../transformers/user";

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, 'refresh_token')

    if (!refreshToken) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Refresh token is missing'
        }));
    }

    const refreshTokenData = await getRefreshTokenByToken(refreshToken);

    if (!refreshTokenData) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Refresh token is invalid'
        }));
    }

    const decodedRefreshToken = await decodeRefreshToken(refreshToken);

    try {
        const user = await getUserById(decodedRefreshToken.id);

        if (!user) {
            return sendError(event, createError({
                statusCode: 401,
                statusMessage: 'User not found'
            }));
        }

        const { accessToken } = await generateTokens(user);

        return {
            accessToken,
            user: userTransformer(user)
        }

    } catch (error) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Something went wrong'
        }));
    }

});