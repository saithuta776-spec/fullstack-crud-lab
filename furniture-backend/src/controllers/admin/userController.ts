import { Request, Response, NextFunction } from "express";
import { customRequest } from "../../types/index.js";

export const getAllUsers = (
  req: customRequest,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user;
  res.status(200).json({
    message: req.t("welcome"),
    currentUserRole: user.role,
  });
};
