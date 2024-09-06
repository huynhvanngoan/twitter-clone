import { removeRefreshTokenByToken } from "~/server/db/refreshTokens";
import { sendRefreshToken } from "~/server/utils/jwt";
export default defineEventHandler(async (event) => {
    

    try {
        const cookies = getCookies(event);
        const refreshToken = cookies.refresh_token;

        // remove the refresh token from the database
        await removeRefreshTokenByToken(refreshToken)
    } catch (error) {
        
    }

    // remove the refresh token in cookies
    sendRefreshToken(event, null);

    return {
        message: 'Logout successful'
    }
    
});