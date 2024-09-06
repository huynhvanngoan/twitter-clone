import UrlPattern from "url-pattern";
import { decodeAccessToken } from "../utils/jwt";
import { getUserById } from "../db/users";

export default defineEventHandler(async (event) => {
    const endpoints = [
        '/api/auth/user',
        '/api/user/tweets',
        '/api/tweets',
        '/api/tweets/*'
    ]

    const isHandledByMiddleware = endpoints.some(endpoint => {
        const pattern = new UrlPattern(endpoint);
        return pattern.match(event.req.url);
    })


    if (!isHandledByMiddleware) {
        return;
    }

    const authorizationHeader = event.req.headers['authorization'];
    if (!authorizationHeader) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }

    const token = authorizationHeader.split(' ')[1];
    const decode = await decodeAccessToken(token);
    if (!decode) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }


    try {
        const userId = decode.id;
        const user = await getUserById(userId);
        if (!user) {
            return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
        }
        event.context.auth = {
            user,
        }
    } catch (error) {
        return sendError(event, createError({ statusCode: 401, statusMessage: 'Unauthorized' }));
    }
});
