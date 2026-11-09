import { NextFunction, Response, Request } from "express";
import { customRequest } from "../types/index.js";

export const healthControllers = (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  res
    .status(200)
    .json({ message: "This is response from server", user_Id: req.userId });
};
