import express from "express";
import {
  changeLanguage,
  getMyPhoto,
  testPermission,
  uploadProfile,
  uploadProfileMultiple,
  uploadProfileOptimize,
} from "../../../controllers/api/profileController.js";
import { auth } from "../../../middlewares/auth.js";
import upload from "../../../middlewares/uploadFile.js";
import {
  getInfinitePostsByPagination,
  getPost,
  getPostsByPagination,
} from "../../../controllers/api/postController.js";
import {
  getProduct,
  getProductByPagination,
} from "../../../controllers/api/productController.js";

const router = express.Router();

router.post("/changeLanguage", changeLanguage);
router.get("/test-permission", auth, testPermission);
router.patch("/profile/upload", auth, upload.single("avatar"), uploadProfile);
router.patch(
  "/profile/upload/Optimize",
  auth,
  upload.single("avatar"),
  uploadProfileOptimize,
);
router.patch(
  "/profile/upload/multiple",
  auth,
  upload.array("avatar"),
  uploadProfileMultiple,
);

router.get("/profile/my-photo", getMyPhoto); //for-testing

//POST
router.get("/posts", auth, getPostsByPagination); //Offset
router.get("/posts/infinite", auth, getInfinitePostsByPagination); //Cursor
router.get("/posts/:id", auth, getPost);

//PRODUCT
router.get("/products/infinite", auth, getProductByPagination);
router.get("/products/:id", auth, getProduct);

export default router;
