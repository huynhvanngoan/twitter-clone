import formidable from 'formidable';
import { createTweet } from '~/server/db/tweets';
import { tweetTransformer } from '../../../transformers/tweet';
import { createMediaFile } from '~/server/db/mediaFiles';
import { uploadImageToCloudinary } from '~/server/utils/cloudinary';

export default defineEventHandler(async (event) => {
    const form = formidable({});

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.req, (err, fields, files) => {
            if (err) {
                return reject(err);
            }

            // Convert fields and files to not be arrays
            const normalizedFields = Object.fromEntries(
                Object.entries(fields).map(([key, value]) => [key, value[0]])
            );

            const normalizedFiles = Object.fromEntries(
                Object.entries(files).map(([key, value]) => [key, value[0]])
            );

            resolve({ fields: normalizedFields, files: normalizedFiles });
        });
    });

    const userId = event.context?.auth?.user?.id;

    const tweetData = {
        text: fields.text, // Ensure text is a string
        authorId: userId,
    };

    const replyTo = fields.replyTo;

    if (replyTo && replyTo !== 'null' && replyTo !== 'undefined') {
        tweetData.replyToId = replyTo;
    }

    const tweet = await createTweet(tweetData);

    const filePromises = Object.keys(files).map(async key => {
        const file = files[key];
        const cloudinaryResource = await uploadImageToCloudinary(file.filepath);

        return createMediaFile({
            url: cloudinaryResource.secure_url,
            providerPublicId: cloudinaryResource.public_id,
            userId,
            tweetId: tweet.id,
        })
    })

    await Promise.all(filePromises);


    return {
        tweet: tweetTransformer(tweet),
    };
});