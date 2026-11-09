import { NextFunction, Response, Request } from "express";
import { customRequest } from "../types/index.js";

export const check = (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  req.userId = 945678;
  next();
};
