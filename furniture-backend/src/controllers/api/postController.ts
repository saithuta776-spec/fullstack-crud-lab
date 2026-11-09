import { Request, Response, NextFunction } from "express";
import { customRequest } from "../../types/index.js";
import { body, validationResult, param, query } from "express-validator";
import { errorCode } from "../../config/errorCode.js";
import { createError } from "../../utlis/error.js";
import { createOrUpdateSetting } from "../../services/systemService.js";
import { getUserById } from "../../services/authService.js";
import { checkUserNotExist } from "../../utlis/auth.js";
import {
  getPostLists,
  getPostWithRelations,
} from "../../services/postService.js";
import { use } from "i18next";
import { json } from "node:stream/consumers";
import { getOrSetCache } from "../../utlis/cache.js";

export const getPost = [
  param("id", "Post ID is required").isInt({ gt: 0 }),
  async (req: customRequest, res: Response, next: NextFunction) => {
    const validation = validationResult(req).array({ onlyFirstError: true });

    // If validation error occurs
    if (validation.length > 0) {
      return next(createError(validation[0].msg, 400, errorCode.invalid));
    }

    const postId = Number(req.params.id);
    const userId = req.userId;

    // Check authenticated user
    if (userId == null) {
      return next(
        createError("User is not authenticated.", 401, errorCode.invalid),
      );
    }

    const user = await getUserById(userId);
    checkUserNotExist(user);

    // Get post details
    // const post = await getPostWithRelations(postId);
    const cacheKey = `posts:${JSON.stringify(postId)}`;
    const post = await getOrSetCache(cacheKey, async () => {
      return await getPostWithRelations(postId);
    });

    // Check whether post exists
    if (!post) {
      return next(createError("Post does not exist.", 404, errorCode.invalid));
    }

    res.status(200).json({ message: "Post Detail", post });
  },
];

//Offset Pagination
export const getPostsByPagination = [
  query("page", "Page number must be unsigned integar")
    .isInt({ gt: 0 })
    .optional(),
  query("limit", "Limit number must be unsinged integar")
    .isInt({ gt: 0, max: 100 })
    .optional(),

  async (req: customRequest, res: Response, next: NextFunction) => {
    const validation = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (validation.length > 0) {
      return next(createError(validation[0].msg, 400, errorCode.invalid));
    }

    const page = req.query.page ?? 1;
    const limit = req.query.limit ?? 5;
    const userId = req.userId;

    // Check authenticated user
    if (userId == null) {
      return next(
        createError("User is not authenticated.", 401, errorCode.invalid),
      );
    }

    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const skip = (+page - 1) * +limit;
    const options = {
      skip,
      take: +limit + 1,
      select: {
        id: true,
        // authorId: true,
        title: true,
        content: true,
        image: true,
        updatedAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    };

    // const posts = await getPostLists(options);
    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return await getPostLists(options);
    });

    const hasNextPage = posts.length > +limit;
    let nextPage = null;
    const previousPage = +page !== 1 ? +page - 1 : null;
    if (hasNextPage) {
      posts.pop();
      nextPage = +page + 1;
    }

    res.status(200).json({
      message: "Get All Posts",
      currentPage: page,
      hasNextPage,
      nextPage,
      previousPage,
      posts,
    });
  },
];

//Cusor Pagination
export const getInfinitePostsByPagination = [
  query("cursor", "Cursor must be POST ID").isInt({ gt: 0 }).optional(),
  query("limit", "Limit must be an unsinged integar")
    .isInt({ gt: 0 })
    .optional(),
  async (req: customRequest, res: Response, next: NextFunction) => {
    const validation = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (validation.length > 0) {
      return next(createError(validation[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit ?? 3;
    const userId = req.userId;

    // Check authenticated user
    if (userId == null) {
      return next(
        createError("User is not authenticated.", 401, errorCode.invalid),
      );
    }

    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const options = {
      take: +limit + 1,
      skip: lastCursor ? 1 : 0,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        updatedAt: true,
        author: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    };

    // const posts = await getPostLists(options);
    const cacheKey = `posts:${JSON.stringify(req.query)}`;
    const posts = await getOrSetCache(cacheKey, async () => {
      return await getPostLists(options);
    });

    const hasNextPage = posts.length > +limit;
    if (hasNextPage) {
      posts.pop();
    }

    const newCurosr = posts.length > 0 ? posts[posts.length - 1].id : null;
    res.status(200).json({
      message: "Get All infinite posts",
      hasNextPage,
      newCurosr,
      Previous_Cursor: lastCursor,
      posts,
    });
  },
];
