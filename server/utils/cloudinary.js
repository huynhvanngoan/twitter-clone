import { v2 as _cloudinary } from "cloudinary";

const cloudinary = () => {
    const config = useRuntimeConfig();

    _cloudinary.config({
        cloud_name: config.cloudinaryCloudName,
        api_key: config.cloudinaryApiKey,
        api_secret: config.cloudinaryApiSecret,
    })

    return _cloudinary;
}

export const uploadImageToCloudinary = async (image) => {
    return await new Promise((resolve, reject) => {
       
        cloudinary().uploader.upload(image, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        })
    })
};