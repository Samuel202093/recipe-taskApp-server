import multer from "multer";
import { v4 as uuidv4 } from 'uuid';
import path from "path";
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      const uniqueNumber = uuidv4();
      cb(null, uniqueNumber + path.extname(file.originalname));
    },
  });


   export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|avif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);
  
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only images are allowed'));
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, 
  });

  export default { upload };