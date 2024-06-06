const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
          destination: './uploads/', // Folder kahan pe image save hoga
          filename: (req, file, cb) => { // File ka naam kaise hoga
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
          }
        });
        
        const upload = multer({ storage: storage });
        module.exports = upload;