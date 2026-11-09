import { errorCode } from "../config/errorCode.js";
import { createError } from "./error.js";

export const checkUploadFile = (file: any) => {
  if (!file) {
    throw createError("Invalide Image", 409, errorCode.invalid);
  }
};

export const checkModelIfExist = (model: any) => {
  if (!model) {
    // const error: any = new Error("This model does not exist.");
    // error.status = 409;
    // error.code = errorCode.invalid;
    // throw error;

    throw createError("This model does not exist.", 409, errorCode.invalid);
  }
};
