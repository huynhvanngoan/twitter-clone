import { getUserByUsername } from "~/server/db/users";
import bcrypt from "bcrypt";
import { generateTokens, sendRefreshToken } from "~/server/utils/jwt";
import { createRefreshToken } from "~/server/db/refreshTokens";
import { userTransformer } from "../../transformers/user";

export default defineEventHandler(async (event) => {
    const { username, password } = await readBody(event);

    if (!username || !password) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "Invalid username or password",
        }));
    }


    //Check is the user exists
    const user = await getUserByUsername(username);

    if (!user) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "Invalid username or password",
        }));
    }

    //Compare the password
    const isPasswordMatch = bcrypt.compareSync(password, user.password);

    if (!isPasswordMatch) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Invalid username or password",
        }));
    }

    //Generate a token
    //Add Access Token
    //Add Refresh Token
    const { accessToken, refreshToken } = await generateTokens(user);

    //save the refresh token in the database
    await createRefreshToken({
        token: refreshToken,
        userId: user.id,
    });

    //Add http only cookie
    sendRefreshToken(event, refreshToken);


    //Return the token
    return {
        accessToken: accessToken,
        user: userTransformer(user),
    }
});
