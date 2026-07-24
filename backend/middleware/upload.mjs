import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
  destination(req, file, cb){
    cb(null, 'public/images') // це папка куди треба зберегти файл
  },
  filename(req, file, cb) {
    const date = new Date().toISOString().replace(/:/g, '-');
    cb(null, date + '-' + Buffer.from(file.originalname, 'latin1').toString('utf8')) // як назвати файл який передається
  },
});

const types = ['image/png', 'image/jpg', 'image/jpeg'];

const fileFilter = (req, file, cb) => {
  if (types.includes(file.mimetype)) {
    cb(null, true); // приймаєм файл
  } else {
    cb(null, false); // відхиляєм файл
  }
};

const upload = multer({storage, fileFilter});

export default upload;