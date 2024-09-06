import prisma from "./index";

export const createTweet = async (tweetData) => {
    return await prisma.tweet.create({
        data: tweetData
    })


}

export const getTweets = async (params = {}) => {
    return await prisma.tweet.findMany({
        ...params
    })
}

export const getTweetById = async (tweetId, params = {}) => {
    return await prisma.tweet.findUnique({
        ...params,
        where: {
            ...params.where,
            id: tweetId
        },
    })
}