import { param } from "express-validator";
import { customRequest } from "../../types/index.js";
import { Request, Response, NextFunction } from "express";
import { body, validationResult, query } from "express-validator";
import { errorCode } from "../../config/errorCode.js";
import { createError } from "../../utlis/error.js";
import { getOrSetCache } from "../../utlis/cache.js";
import {
  getProductsList,
  getProductWithRelations,
} from "../../services/productService.js";
import { getUserById } from "../../services/authService.js";
import { checkUserNotExist } from "../../utlis/auth.js";
import { checkModelIfExist } from "../../utlis/check.js";

export const getProduct = [
  param("id", "Product ID is required.").isInt({ gt: 0 }),
  async (req: customRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const productId = req.params.id;
    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    const cacheKey = `products:${JSON.stringify(productId)}`;
    const product = await getOrSetCache(cacheKey, async () => {
      return await getProductWithRelations(+productId);
    });

    checkModelIfExist(product);

    res.status(200).json({ message: "Product Detail", product });
  },
];

export const getProductByPagination = [
  query("cursor", "Cursor must be Post ID.").isInt({ gt: 0 }).optional(),
  query("limit", "Limit number must be unsigned integer.")
    .isInt({ gt: 1 })
    .optional(),
  async (req: customRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const lastCursor = req.query.cursor;
    const limit = req.query.limit ?? 3;
    const category = req.query.category;
    const type = req.query.type;

    const userId = req.userId;
    const user = await getUserById(userId!);
    checkUserNotExist(user);

    let categoryList: number[] = [];
    let typeList: number[] = [];

    if (category) {
      categoryList = category
        .toString()
        .split(",")
        .map((c) => Number(c))
        .filter((c) => c > 0);
    }

    if (type) {
      typeList = type
        .toString()
        .split(",")
        .map((t) => Number(t))
        .filter((t) => t > 0);
    }

    const where = {
      AND: [
        categoryList.length > 0 ? { categoryId: { in: categoryList } } : {},
        typeList.length > 0 ? { typeId: { in: typeList } } : {},
      ],
    };
    const options = {
      where,
      skip: lastCursor ? 1 : 0,
      take: +limit + 1,
      cursor: lastCursor ? { id: +lastCursor } : undefined,
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        discount: true,
        status: true,
        images: {
          select: {
            id: true,
            path: true,
          },
          take: 1, // Limit to the first image
        },
      },
      orderBy: {
        id: "desc",
      },
    };

    const cacheKey = `products:${JSON.stringify(req.query)}`;
    const products = await getOrSetCache(cacheKey, async () => {
      return await getProductsList(options);
    });

    const hasNextPage = products.length > +limit;
    if (hasNextPage) {
      products.pop();
    }

    const newCursor =
      products.length > 0 ? products[products.length - 1].id : null;

    res.status(200).json({
      message: "Get All infinite products",
      hasNextPage,
      newCursor,
      prevCursor: lastCursor,
      products,
    });
  },
];
