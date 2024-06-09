const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cloudinary configuration
          
cloudinary.config({ 
  cloud_name: 'dbufkxtps', 
  api_key: '247479354542859', 
  api_secret: 'PW6VwhQ75Rw05q6sM6sDFj58j64' 
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Folder name in Cloudinary
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => Date.now().toString() + '-' + file.originalname.split('.')[0]
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
