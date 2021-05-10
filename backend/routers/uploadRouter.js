import multer from 'multer';
import express from 'express';
import { isAuth } from '../utils.js';
import fs from "fs";

const uploadRouter = express.Router();

uploadRouter.post('/delete', (req, res) => {
  try {
    fs.unlinkSync(`.${req.body.image}`);
  } catch (error) {
    console.log("File not found");
  }
  res.send("success");
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `uploads/${req.user._id}`);
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});
const upload = multer({ storage });
uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

const brandStorage = multer.diskStorage({
  destination(req, file, cb) {
    if(fs.existsSync(`uploads/${req.user._id}/brand`)) {
      cb(null, `uploads/${req.user._id}/brand`);
    } else {
      fs.mkdirSync(`uploads/${req.user._id}`);
      fs.mkdirSync(`uploads/${req.user._id}/brand`);
      fs.mkdirSync(`uploads/${req.user._id}/instagram`);
      cb(null, `uploads/${req.user._id}/brand`);
    }
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});
var brandUpload = multer({ storage: brandStorage });
uploadRouter.post('/brand', isAuth, brandUpload.single('image'), function (req, res) {
  res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

export default uploadRouter;
