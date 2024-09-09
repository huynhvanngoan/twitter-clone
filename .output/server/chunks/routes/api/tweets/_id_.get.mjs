import { d as defineEventHandler } from '../../../runtime.mjs';
import { g as getTweetById, t as tweetTransformer } from '../../../_/tweet.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'url-pattern';
import 'jsonwebtoken';
import '@prisma/client';
import 'bcrypt';
import '../../../_/user.mjs';
import 'human-time';

const _id__get = defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const tweet = await getTweetById(id, {
    include: {
      author: true,
      mediaFiles: true,
      replies: {
        include: {
          mediaFiles: true,
          author: true,
          replyTo: {
            include: {
              author: true
            }
          }
        }
      },
      replyTo: {
        include: {
          author: true
        }
      }
    }
  });
  return {
    tweet: tweetTransformer(tweet)
  };
});

export { _id__get as default };
//# sourceMappingURL=_id_.get.mjs.map
