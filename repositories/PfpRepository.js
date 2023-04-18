const cloudinary = require("../config/cloudinary");

const uploadPfp = async (img, user_id) => {
  const options = {
    public_id: `${user_id}_pfp`,
    unique_filename: false,
    overwrite: true,
    folder: `${user_id}`,
  };
  const uploadResponse = await cloudinary.uploader.upload(img, options);
  return uploadResponse;
};

module.exports = { uploadPfp };
