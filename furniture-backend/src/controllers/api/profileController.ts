import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import { errorCode } from "../../config/errorCode.js";
import { customRequest } from "../../types/index.js";
import { authorise } from "../../utlis/authorise.js";
import { getUserById, updateUser } from "../../services/authService.js";
import { checkUserNotExist } from "../../utlis/auth.js";
import { userInfo } from "node:os";
import { checkUploadFile } from "../../utlis/check.js";
import path from "node:path";
import { unlink } from "node:fs/promises";
import sharp from "sharp";
import imageQueue from "../../jobs/queues/imageQueue.js";

export const changeLanguage = [
  query("lng", "Invalid Language code.")
    .trim()
    .notEmpty()
    .matches("^[a-z]+$")
    .isLength({ min: 2, max: 3 }),
  (req: customRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = errorCode.invalid;
      return next(error);
    }

    const { lng } = req.query;
    res.cookie("i18next", lng);
    res.status(200).json({ message: req.t("changeLan", { lang: lng }) });
  },
];

export const testPermission = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserNotExist(user);
  const info: any = {
    title: "Testing Permission",
  };

  const can = authorise(true, user!.role, "ADMIN");
  if (can) {
    info.content = "You have a permission to read this line.";
  }

  res.status(200).json({
    info,
  });
};

export const uploadProfile = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  // console.log("FILE:", req.file);
  // console.log("BODY:", req.body);
  const userId = req.userId;
  const image = req.file;

  const user = await getUserById(userId!);
  checkUserNotExist(user);
  checkUploadFile(image);

  // console.log("Image ---> ", image);
  const fileName = image?.filename;

  if (user?.image) {
    try {
      const filePath = path.join(
        __dirname,
        "../../..",
        "uploads/images",
        user.image,
      );
      await unlink(filePath);
    } catch (error) {
      console.log(error);
    }
  }
  const userData = {
    image: fileName,
  };
  await updateUser(user!.id, userData);

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    image: fileName,
  });
};

export const getMyPhoto = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  const file = path.join(
    __dirname,
    "../../..",
    "uploads/images",
    "1790436505852-242295859-poster.jpg",
  );

  res.sendFile(file, (err) => {
    if (err) {
      res.status(404).send("File not Found");
    }
  });
};

export const uploadProfileMultiple = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log("FILE:", req.files);

  res.status(200).json({
    message: "Profile picture uploaded successfully",
  });
};

export const uploadProfileOptimize = async (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log("🔥 OPTIMIZE CONTROLLER RUNNING");
  // console.log("FILE:", req.file);
  // console.log("BODY:", req.body);
  const userId = req.userId;
  const image = req.file;

  const user = await getUserById(userId!);
  checkUserNotExist(user);
  checkUploadFile(image);

  // console.log("Image ---> ", image);
  const splitFileName = req.file?.filename.split(".")[0];
  const job = await imageQueue.add("optimize-image", {
    filePath: req.file?.path,
    fileName: `${splitFileName}.webp`,
    width: 200,
    height: 200,
    quality: 50,
  });
  // try {
  //   const optimizedImage = path.join(
  //     __dirname,
  //     "../../..",
  //     "uploads/images/",
  //     fileName,
  //   );
  //   await sharp(req.file?.buffer)
  //     .resize(200, 200)
  //     .webp({ quality: 50 })
  //     .toFile(optimizedImage);
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: "Image Optimization Failed" });
  //   return;
  // }
  console.log("Current DB image:", user?.image);
  if (user?.image) {
    try {
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "uploads/images",
        user.image,
      );
      const optimizedFilePath = path.join(
        __dirname,
        "../../..",
        "uploads/optimize",
        user.image.split(".")[0] + ".webp",
      );
      await unlink(optimizedFilePath);
      await unlink(originalFilePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.log(error);
      }
    }
  }
  const userData = {
    image: req.file?.filename,
  };
  await updateUser(user!.id, userData);

  res.status(200).json({
    message: "Profile picture uploaded successfully",
    image: splitFileName,
    jobId: job.id,
  });
};
