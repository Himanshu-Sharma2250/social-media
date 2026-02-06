import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localImagePath) => {
    try {
        if (!localImagePath) return null;

        const uploadResult = await cloudinary.uploader.upload(localImagePath, {
            resource_type: "image" // this is the type of file -> image or video or text 
        })

        console.log("The uploaded image response: ", uploadResult.url);

        return uploadResult;
    } catch (error) {
        fs.unlinkSync(localImagePath); // remove the locally saved temp file as the upload operation failed
        console.error("Error in uploading image: ", error);

        return null;
    }
};

const deleteImageFromCloudinary = async (public_id) => {
    try {
        const result = cloudinary.uploader.destroy(public_id);

        console.log("The result is : ", result);

        return result;
    } catch (error) {
        console.error("Error in deleting image from cloudinary: ", error);

        return null;
    }
};

export {uploadOnCloudinary, deleteImageFromCloudinary};