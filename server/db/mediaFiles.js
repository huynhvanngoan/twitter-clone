import prisma from "./index";

export const createMediaFile = (mediaFileData) => {
    return prisma.mediaFile.create({
        data: mediaFileData
    })
}