import { Request, Response, NextFunction } from "express";
import { customRequest } from "../../types/index.js";
import { body, validationResult } from "express-validator";
import { errorCode } from "../../config/errorCode.js";
import { createError } from "../../utlis/error.js";
import { checkModelIfExist, checkUploadFile } from "../../utlis/check.js";
import imageQueue from "../../jobs/queues/imageQueue.js";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { cacheQueue } from "../../jobs/queues/cacheQueue.js";
import {
  createOneProduct,
  deleteOneProduct,
  getProductById,
  updateOneProduct,
} from "../../services/productService.js";

const removeFiles = async (
  originalFiles: string[],
  optimizeFiles: string[] | null,
) => {
  try {
    for (const originalFile of originalFiles) {
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "uploads/images",
        originalFile,
      );
      await unlink(originalFilePath);
    }

    if (optimizeFiles) {
      for (const optimizedFile of optimizeFiles) {
        const optimizedFilePath = path.join(
          __dirname,
          "../../..",
          "uploads/optimize",
          optimizedFile,
        );
        await unlink(optimizedFilePath);
      }
    }
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.log(error);
    }
  }
};

export const createProduct = [
  body("name", "Name is required.").trim().notEmpty().escape(),

  body("description", "Description is required.").trim().notEmpty().escape(),

  body("price", "Price is required.")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),

  body("discount", "Discount is required")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),

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
    const images = (req.files as Express.Multer.File[]) ?? [];
    const hasImages = images.length > 0;
    console.log("Number of images:", images.length);
    console.log(
      "Uploaded images:",
      images.map((image) => image.filename),
    );

    let productCreated = false;

    try {
      // Validate request fields
      const validation = validationResult(req).array({
        onlyFirstError: true,
      });

      if (validation.length > 0) {
        if (hasImages) {
          const originalFiles = images.map((file: any) => file.filename);
          await removeFiles(originalFiles, null);
        }
        throw createError(validation[0].msg, 400, errorCode.invalid);
      }

      // Check uploaded image
      checkUploadFile(hasImages);

      // Prepare image filename
      const originalFileNames = images.map((file: any) => ({
        path: file.filename,
      }));

      // Prepare post data
      const data: any = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        discount: req.body.discount,
        inventory: Number(req.body.inventory),
        category: req.body.category,
        type: req.body.type,
        tags: req.body.tags ?? [],
        images: originalFileNames,
      };

      // Create post in database
      const product = await createOneProduct(data);
      productCreated = true;

      await cacheQueue.add("invalidate-product-cache", {
        pattern: "products:*",
      });

      await Promise.all(
        images.map((image: any) => {
          const splitFileName = image.filename.split(".")[0];
          return imageQueue.add(
            "optimize-image",
            {
              filePath: image.path,
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
        }),
      );

      // Return success response
      return res.status(201).json({
        message: "Successfully created a new product.",
        postId: product.id,
      });
    } catch (error) {
      // Remove uploaded image if post creation failed
      if (hasImages && !productCreated) {
        const originalFiles = images.map((file: any) => file.filename);
        await removeFiles(originalFiles, null);
      }

      return next(error);
    }
  },
];

export const updateProduct = [
  body("productId", "Product ID is required.").isInt({ min: 1 }),
  body("name", "Name is required.").trim().notEmpty().escape(),

  body("description", "Description is required.").trim().notEmpty().escape(),

  body("price", "Price is required.")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),

  body("discount", "Discount is required")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),

  body("inventory", "Inventory must be a valid integar").isInt({ min: 0 }),

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
    const productId = Number(req.body.productId);
    let productUpdated = false;

    const images = (req.files as Express.Multer.File[]) ?? [];
    console.log("Number of images:", images.length);
    console.log(
      "Uploaded images:",
      images.map((image) => image.filename),
    );
    const hasImages = images.length > 0;

    try {
      const validation = validationResult(req).array({
        onlyFirstError: true,
      });

      if (validation.length > 0) {
        if (hasImages) {
          const originalFiles = images.map((file: any) => file.filename);
          await removeFiles(originalFiles, null);
        }
        throw createError(validation[0].msg, 400, errorCode.invalid);
      }

      const product = await getProductById(productId);
      if (!product) {
        if (hasImages) {
          const originalFiles = images.map((file) => file.filename);
          await removeFiles(originalFiles, null);
        }
        return next(
          createError(
            "This data model does not exist.",
            401,
            errorCode.invalid,
          ),
        );
      }

      const originalFileNames = images.map((file: any) => ({
        path: file.filename,
      }));

      // Prepare product data
      const data: any = {
        name: req.body.name,
        description: req.body.description,
        price: Number(req.body.price),
        discount: Number(req.body.discount),
        inventory: Number(req.body.inventory),
        category: req.body.category,
        type: req.body.type,
        tags: req.body.tags ?? [],
        images: originalFileNames,
      };

      const productUpdate = await updateOneProduct(productId, data);
      productUpdated = true;

      await cacheQueue.add("invalidate-cache", {
        pattern: "products:*",
      });

      if (hasImages) {
        await Promise.all(
          images.map((image: any) => {
            const splitFileName = image.filename.split(".")[0];
            return imageQueue.add(
              "optimize-image",
              {
                filePath: image.path,
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
          }),
        );
        const orgFiles = product.images.map((img) => img.path);
        const optFiles = product.images.map(
          (img) => img.path.split(".")[0] + ".webp",
        );
        await removeFiles(orgFiles, optFiles);
      }

      return res.status(200).json({
        message: "Successfully updated the product.",
        productId: productUpdate.id,
      });

      // Return success response
    } catch (error) {
      if (hasImages && !productUpdated) {
        const originalFiles = images.map((file) => file.filename);
        await removeFiles(originalFiles, null);
      }
      return next(error);
    }
  },
];

export const deleteProduct = [
  body("productId", "Product Id is required.").isInt({ gt: 0 }),
  async (req: customRequest, res: Response, next: NextFunction) => {
    const productId = Number(req.body.productId);

    try {
      const validation = validationResult(req).array({
        onlyFirstError: true,
      });

      if (validation.length > 0) {
        throw createError(validation[0].msg, 400, errorCode.invalid);
      }

      const product = await getProductById(+productId);
      checkModelIfExist(product);

      const productDeleted = await deleteOneProduct(product!.id);
      await cacheQueue.add("invalidate-product-cache", {
        pattern: "products:*",
      });

      const orgFiles = product!.images.map((img) => img.path);
      const optFiles = product!.images.map(
        (img) => img.path.split(".")[0] + ".webp",
      );
      await removeFiles(orgFiles, optFiles);

      res.status(200).json({
        message: "Successfully deleted the post.",
        postId: productDeleted.id,
      });
    } catch (error) {
      return next(error);
    }
  },
];
