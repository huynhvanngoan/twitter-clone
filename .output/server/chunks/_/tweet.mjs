import { p as prisma } from '../runtime.mjs';
import { u as userTransformer } from './user.mjs';
import human from 'human-time';

const createTweet = async (tweetData) => {
  return await prisma.tweet.create({
    data: tweetData
  });
};
const getTweets = async (params = {}) => {
  return await prisma.tweet.findMany({
    ...params
  });
};
const getTweetById = async (tweetId, params = {}) => {
  return await prisma.tweet.findUnique({
    ...params,
    where: {
      ...params.where,
      id: tweetId
    }
  });
};

const mediaFileTransformer = (mediaFile) => {
  return {
    id: mediaFile.id,
    url: mediaFile.url
  };
};

const tweetTransformer = (tweet) => {
  return {
    id: tweet.id,
    text: tweet.text,
    mediaFiles: !!tweet.mediaFiles ? tweet.mediaFiles.map(mediaFileTransformer) : [],
    author: !!tweet.author ? userTransformer(tweet.author) : null,
    replies: !!tweet.replies ? tweet.replies.map(tweetTransformer) : [],
    replyTo: !!tweet.replyTo ? tweetTransformer(tweet.replyTo) : null,
    repliesCount: !!tweet.replies ? tweet.replies.length : 0,
    postedAtHuman: human(tweet.createdAt)
  };
};

export { getTweets as a, createTweet as c, getTweetById as g, tweetTransformer as t };
//# sourceMappingURL=tweet.mjs.map
