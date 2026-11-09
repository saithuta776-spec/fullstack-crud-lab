import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, './uploads/') // Ensure this directory exists
    cb(null, "./uploads/images");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + ext;
    cb(null, uniqueSuffix);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  console.log("Multer received:", file.originalname);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/webp"
  ) {
    console.log("File accepted:", file.originalname);
    cb(null, true);
  } else {
    console.log("File rejected:", file.mimetype);
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 },
  //Userက phoneထဲကနေfile sizeများတဲ့ပုံကိုတင်လို့serverကလက်ခံပေမယ့် သူပြန်ကြည့်ဖို့downတဲ့အခါမှာfile sizeအကြီးကိုdownရတာမလို့
  //internetမကောင်းရင်ကြာနိင်တယ်။ That's why optimization is needed.
});

// export const uploadMemory = multer({
//   storage: multer.memoryStorage(),
//   fileFilter,
//   limits: { fileSize: 1024 * 1024 * 10 },
// });

export default upload;
