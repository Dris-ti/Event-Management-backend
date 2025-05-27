import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';
import toStream = require('buffer-to-stream');
import * as fs from 'fs';
require('dotenv').config(); 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log('Cloudinary config:', {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
});


@Injectable()
export class CloudinaryService {
    async uploadImage(localPath: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(localPath, { folder: 'event_images' }, (error, result) => {
        fs.unlinkSync(localPath); // Delete local file after upload
        if (error) return reject(error);
        if (!result) return reject(new Error('No result returned from Cloudinary'));
        return resolve(result);
      });
    });
  }
}


