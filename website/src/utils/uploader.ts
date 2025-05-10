import cloudinaryCloud from "cloudinary";
import path from "path";

const cloudinary = cloudinaryCloud.v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

export const uploadFile = async (
  file: File,
  options: cloudinaryCloud.UploadApiOptions,
  maxSize: number = 5 * 1e6
): Promise<cloudinaryCloud.UploadApiResponse> => {
  if (
    !options.allowed_formats?.includes(path.extname(file.name).replace(".", ""))
  ) {
    throw {
      codeName: "FILE_FORMAT",
      message: "File format not allowed",
    };
  }

  if (maxSize && file.size > maxSize) {
    throw {
      codeName: "FILE_SIZE",
      message: "File too big",
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  const mimeType = file.type;

  var encoding = "base64";
  var base64Data = Buffer.from(arrayBuffer).toString("base64");
  var fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        ...options,
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
