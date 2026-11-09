import { NextFunction, Response, Request } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.render("404", { title: "404 error", message: "Page Not Found" });
};
