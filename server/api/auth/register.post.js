import { createUser } from "~/server/db/users";
import { userTransformer } from "../../transformers/user";

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    const { username, email, password, confirmPassword, name } = body;

    if (!username || !email || !password || !confirmPassword || !name) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "All fields are required",
        }));
    }

    if (password !== confirmPassword) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "Bad Request",
            message: "Password and Confirm Password do not match",
        }));
    }

    const userData = {
        username,
        email,
        name,
        password,
        profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXZhdGFyfGVufDB8fDB8fHww",
    }

    const user = await createUser(userData)
    return {
        user: userTransformer(user),
    };
});