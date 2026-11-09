import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorCode } from "../config/errorCode.js";
import { getUserById, updateUser } from "../services/authService.js";
import { customRequest } from "../types/index.js";
import { createError } from "../utlis/error.js";

export const auth = (req: customRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  const generateNewToken = async () => {
    if (!refreshToken) {
      return next(
        createError(
          "You are not an unauthenticated user.",
          401,
          errorCode.unauthenticated,
        ),
      );
    }
    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: number;
        phone: string;
      };
    } catch (error) {
      return next(
        createError(
          "You are not an unauthenticated user.",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an unauthenticated user.",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    const user = await getUserById(decoded.id);
    if (!user) {
      return next(
        createError(
          "This account has not registered",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    if (decoded.phone !== user.phone) {
      return next(
        createError(
          "You are not an unauthenticated user.",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    if (user.randToken !== refreshToken) {
      return next(
        createError(
          "You are not an unauthenticated user.",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    const accessTokenPayload = { id: user?.id };
    const refreshTokenPayload = { id: user?.id, phone: user?.phone };

    const newAccessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: 60 * 15,
      },
    );

    const newRefreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "30d",
      },
    );

    const updateUserData = {
      randToken: newRefreshToken,
    };
    await updateUser(user!.id, updateUserData);

    res
      .cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

    req.userId = decoded.id;
    next();
  };

  if (!accessToken) {
    // const error: any = new Error("Access Token has expired.");
    // error.status = 401;
    // error.errorCode = "Error_Access_Token_Expired";
    // return next(error);
    generateNewToken();
  } else {
    let decoded;

    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: number;
      };
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return generateNewToken();
      } else {
        error.message = "Access Token is invalid";
        error.status = 400;
        error.errorCode = errorCode.attack;
        return next(error);
      }
    }

    // JWT has been successfully verified at this point.

    if (isNaN(decoded.id)) {
      return next(
        createError(
          "You are not an unauthenticated user.",
          401,
          errorCode.unauthenticated,
        ),
      );
    }

    req.userId = decoded.id;
    next();
  }
};
