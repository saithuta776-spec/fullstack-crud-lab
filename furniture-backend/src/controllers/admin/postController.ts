import { Request, Response, NextFunction } from "express";
import { customRequest } from "../../types/index.js";
import { body, validationResult } from "express-validator";
import { errorCode } from "../../config/errorCode.js";
import { createError } from "../../utlis/error.js";
import { createOrUpdateSetting } from "../../services/systemService.js";
import { checkUserExist, checkUserNotExist } from "../../utlis/auth.js";
import { checkUploadFile } from "../../utlis/check.js";
import imageQueue from "../../jobs/queues/imageQueue.js";
import {
  createOnePost,
  deleteOnePost,
  getPostById,
  PostArgs,
  updateOnePost,
} from "../../services/postService.js";
import sanitizeHtml from "sanitize-html";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { getUserById } from "../../services/authService.js";
import { userInfo } from "node:os";
import { cacheQueue } from "../../jobs/queues/cacheQueue.js";

const removeFiles = async (
  originalFile: string,
  optimizeFile: string | null,
) => {
  const originalFilePath = path.join(
    __dirname,
    "../../..",
    "uploads/images",
    originalFile,
  );

  try {
    await unlink(originalFilePath);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.log(error);
    }
  }

  if (optimizeFile) {
    const optimizedFilePath = path.join(
      __dirname,
      "../../..",
      "uploads/optimize",
      optimizeFile,
    );

    try {
      await unlink(optimizedFilePath);
    } catch (error: any) {
      if (error.code !== "ENOENT") {
        console.log(error);
      }
    }
  }
};

export const createPost = [
  body("title", "Title is required.").trim().notEmpty().escape(),

  body("content", "Content is required.").trim().notEmpty().escape(),

  body("body", "Body is required.")
    .trim()
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),

  body("category", "Category is required.").trim().notEmpty().escape(),

  body("type", "Type is required.").trim().notEmpty().escape(),

  body("tags", "Tag is invalid.")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
      }
      return value;
    }),

  async (req: customRequest, res: Response, next: NextFunction) => {
    const image = req.file;
    let postCreated = false;

    try {
      // Validate request fields
      const validation = validationResult(req).array({
        onlyFirstError: true,
      });

      if (validation.length > 0) {
        throw createError(validation[0].msg, 400, errorCode.invalid);
      }

      // Check uploaded image
      checkUploadFile(image);

      // Check user ID
      const userId = req.userId;

      if (userId == null) {
        throw createError("User is not authenticated.", 401, errorCode.invalid);
      }

      // Check whether the user exists
      const user = await getUserById(userId);
      checkUserNotExist(user);

      // Prepare image filename
      const splitFileName = image!.filename.split(".")[0];

      // Prepare post data
      const data: PostArgs = {
        title: req.body.title,
        content: req.body.content,
        body: req.body.body,
        image: image!.filename,
        authorId: userId,
        category: req.body.category,
        type: req.body.type,
        tags: req.body.tags ?? [],
      };

      // Create post in database
      const post = await createOnePost(data);
      postCreated = true;

      await cacheQueue.add("invalidate-cache", {
        pattern: "posts*:",
      });
      // Queue image optimization
      await imageQueue.add(
        "optimize-image",
        {
          filePath: image!.path,
          fileName: `${splitFileName}.webp`,
          width: 835,
          height: 577,
          quality: 100,
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 1000,
          },
        },
      );

      // Return success response
      return res.status(201).json({
        message: "Successfully created a new post.",
        postId: post.id,
      });
    } catch (error) {
      // Remove uploaded image if post creation failed
      if (image && !postCreated) {
        await removeFiles(image.filename, null);
      }

      return next(error);
    }
  },
];

export const updatePost = [
  body("postId", "Post Id is required.").isInt({ min: 1 }),
  body("title", "Title is required.").trim().notEmpty().escape(),
  body("content", "Content is required.").trim().notEmpty().escape(),
  body("body", "Body is required.")
    .trim()
    .notEmpty()
    .customSanitizer((value) => sanitizeHtml(value))
    .notEmpty(),
  body("category", "Category is required.").trim().notEmpty().escape(),
  body("type", "Type is required.").trim().notEmpty().escape(),
  body("tags", "Tag is invalid.")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (typeof value === "string") {
        // FIX: Trim tags before filtering empty values.
        return value
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== "");
      }

      return value;
    }),

  async (req: customRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const postId = Number(req.body.postId);
    let postUpdated = false;
    const image = req.file;

    try {
      const validation = validationResult(req).array({
        onlyFirstError: true,
      });

      if (validation.length > 0) {
        throw createError(validation[0].msg, 400, errorCode.invalid);
      }

      if (userId == null) {
        throw createError("User is not authenticated.", 401, errorCode.invalid);
      }

      const user = await getUserById(userId!);
      checkUserNotExist(user);

      const post = await getPostById(postId);
      if (!post) {
        if (image) {
          await removeFiles(image.filename, null);
        }
        return next(
          createError(
            "This data model does not exist.",
            401,
            errorCode.invalid,
          ),
        );
      }

      if (userId !== post.authorId) {
        if (image) {
          await removeFiles(image.filename, null);
        }
        return next(
          createError(
            "This action is not allowed.",
            403,
            errorCode.unauthorised,
          ),
        );
      }

      const oldImage = post.image;

      // Prepare post data
      const data: PostArgs = {
        title: req.body.title,
        content: req.body.content,
        body: req.body.body,
        image: image ? image.filename : post.image,
        authorId: userId,
        category: req.body.category,
        type: req.body.type,
        tags: req.body.tags ?? [],
      };

      const postUpdate = await updateOnePost(postId, data);
      postUpdated = true;

      await cacheQueue.add("invalidate-cache", {
        pattern: "posts:*",
      });

      if (image) {
        const splitFileName = req.file?.filename.split(".")[0];

        await imageQueue.add("optimize-image", {
          filePath: image.path,
          fileName: `${splitFileName}.webp`,
          width: 835,
          height: 577,
          quality: 50,
        });
        if (oldImage && oldImage !== image.filename) {
          const oldOptimizedFile = `${oldImage.split(".")[0]}.webp`;

          await removeFiles(oldImage, oldOptimizedFile);
        }
      }

      return res.status(200).json({
        message: "Successfully updated the post.",
        postId: postUpdate.id,
      });

      // Return success response
    } catch (error) {
      if (req.file && !postUpdated) {
        await removeFiles(req.file.filename, null);
      }
      return next(error);
    }
  },
];

export const deletePost = [
  body("postId", "Post Id is required.").isInt({ gt: 0 }),
  async (req: customRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const postId = Number(req.body.postId);

    try {
      const validation = validationResult(req).array({
        onlyFirstError: true,
      });

      if (validation.length > 0) {
        throw createError(validation[0].msg, 400, errorCode.invalid);
      }

      if (userId == null) {
        throw createError("User is not authenticated.", 401, errorCode.invalid);
      }

      const user = await getUserById(userId!);
      checkUserNotExist(user);

      const post = await getPostById(postId);
      if (!post) {
        return next(
          createError(
            "This data model does not exist.",
            401,
            errorCode.invalid,
          ),
        );
      }

      if (userId !== post.authorId) {
        return next(
          createError(
            "This action is not allowed.",
            403,
            errorCode.unauthorised,
          ),
        );
      }

      const postDeleted = await deleteOnePost(postId);
      await cacheQueue.add("invalidate-cache", {
        pattern: "posts:*",
      });
      const optimizedFile = `${post.image.split(".")[0]}.webp`;
      await removeFiles(post!.image, optimizedFile);

      res.status(200).json({
        message: "Successfully deleted the post.",
        postId: postDeleted.id,
      });
    } catch (error) {
      return next(error);
    }
  },
];
