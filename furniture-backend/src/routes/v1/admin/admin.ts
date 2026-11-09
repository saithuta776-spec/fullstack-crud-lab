import express from "express";
import { getAllUsers } from "../../../controllers/admin/userController.js";
import { testPermission } from "../../../controllers/api/profileController.js";
import { setMaintenance } from "../../../controllers/admin/systemController.js";
import upload from "../../../middlewares/uploadFile.js";
import {
  createPost,
  deletePost,
  updatePost,
} from "../../../controllers/admin/postController.js";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../../controllers/admin/productController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.post("/maintenance", setMaintenance);

//Posts
router.post("/posts", upload.single("image"), createPost);
router.patch("/posts", upload.single("image"), updatePost);
router.delete("/posts", upload.single("image"), deletePost);

//Products
router.post("/products", upload.array("images", 4), createProduct);
router.patch("/products", upload.array("images", 4), updateProduct);
router.delete("/products", upload.array("images", 4), deleteProduct);

export default router;
