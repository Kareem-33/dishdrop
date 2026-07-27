import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME as string, 
  api_key: process.env.CLOUDINARY_KEY as string, 
  api_secret: process.env.CLOUDINARY_SECRET as string
  // secure_distribution: 'mydomain.com',
  // upload_prefix: 'https://api-eu.cloudinary.com'
});

export default cloudinary;