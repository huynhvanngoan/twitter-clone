import { d as defineEventHandler, j as getQuery } from '../../runtime.mjs';
import { a as getTweets, t as tweetTransformer } from '../../_/tweet.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';
import 'bcrypt';
import '../../_/user.mjs';
import 'human-time';

const index_get = defineEventHandler(async (event) => {
  const { query } = getQuery(event);
  const prismaQuery = {
    include: {
      author: true,
      mediaFiles: true,
      replies: {
        include: {
          author: true
        }
      },
      replyTo: {
        include: {
          author: true
        }
      }
    },
    orderBy: [{
      createdAt: "desc"
    }]
  };
  if (!!query) {
    prismaQuery.where = {
      text: {
        contains: query
      }
    };
  }
  const tweets = await getTweets(prismaQuery);
  return {
    // query,
    tweets: tweets.map(tweetTransformer)
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
