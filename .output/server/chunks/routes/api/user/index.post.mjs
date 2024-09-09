import { p as prisma, u as useRuntimeConfig, d as defineEventHandler } from '../../../runtime.mjs';
import formidable from 'formidable';
import { c as createTweet, t as tweetTransformer } from '../../../_/tweet.mjs';
import { v2 } from 'cloudinary';
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

const createMediaFile = (mediaFileData) => {
  return prisma.mediaFile.create({
    data: mediaFileData
  });
};

const cloudinary = () => {
  const config = useRuntimeConfig();
  v2.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret
  });
  return v2;
};
const uploadImageToCloudinary = async (image) => {
  return await new Promise((resolve, reject) => {
    cloudinary().uploader.upload(image, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
};

const index_post = defineEventHandler(async (event) => {
  var _a, _b, _c;
  const form = formidable({});
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(event.req, (err, fields2, files2) => {
      if (err) {
        return reject(err);
      }
      const normalizedFields = Object.fromEntries(
        Object.entries(fields2).map(([key, value]) => [key, value[0]])
      );
      const normalizedFiles = Object.fromEntries(
        Object.entries(files2).map(([key, value]) => [key, value[0]])
      );
      resolve({ fields: normalizedFields, files: normalizedFiles });
    });
  });
  const userId = (_c = (_b = (_a = event.context) == null ? void 0 : _a.auth) == null ? void 0 : _b.user) == null ? void 0 : _c.id;
  const tweetData = {
    text: fields.text,
    // Ensure text is a string
    authorId: userId
  };
  const replyTo = fields.replyTo;
  if (replyTo && replyTo !== "null" && replyTo !== "undefined") {
    tweetData.replyToId = replyTo;
  }
  const tweet = await createTweet(tweetData);
  const filePromises = Object.keys(files).map(async (key) => {
    const file = files[key];
    const cloudinaryResource = await uploadImageToCloudinary(file.filepath);
    return createMediaFile({
      url: cloudinaryResource.secure_url,
      providerPublicId: cloudinaryResource.public_id,
      userId,
      tweetId: tweet.id
    });
  });
  await Promise.all(filePromises);
  return {
    tweet: tweetTransformer(tweet)
  };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
