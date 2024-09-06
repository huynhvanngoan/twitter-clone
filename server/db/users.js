import prisma from "./index";
import bcrypt from "bcrypt";


export const createUser = async (userData) => {
    const finalUserData = {
        ...userData,
        password: bcrypt.hashSync(userData.password, 10),
    }
    return await prisma.user.create({
        data: finalUserData,
    });
}

export const getUserByUsername = async (username) => {
    return await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
}

export const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: {
            id: id,
        },
    });
}
