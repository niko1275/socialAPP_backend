import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true,
  });

export const uploadImage = async (filePath) => {
    try {
      const result = await cloudinary.uploader.upload(filePath, { folder: 'replit' });
      console.log('Resultado de Cloudinary:', result);
      return result;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error.message);
      // También puedes acceder a error.name y error.http_code si es necesario
      throw error;
    }
  };
  