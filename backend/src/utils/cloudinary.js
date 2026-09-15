import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"
const cloudinaryInstance = async (file) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder: 'food_delivery',
            resource_type: 'auto'
        })
        fs.unlinkSync(file)
        return result
    } catch (error) {
        console.log(error.message)
        fs.unlinkSync(file)
    }
}

export default cloudinaryInstance