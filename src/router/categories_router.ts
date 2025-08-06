import express from "express";
const router = express.Router();
import z from "zod";

import {
  getAllCategory,
  getCategoryById,
  updateCategory,
  createCategory,
  deleteCategory,
} from "../controller/categories_controller";
import { ZodValidation } from "../middlewares/zod_validation";
import { TokenValidator } from "../middlewares/token_validator";
import { AccessPermission } from "../middlewares/access_permission";
import { roles } from "../utils/role_constants";

const createValidate = z.object({
  name: z.string(),
  desc: z.string(),
});

router.get(
  "/",
  TokenValidator,
  AccessPermission([roles.ADMIN, roles.CUSTOMER]),
  getAllCategory
);
router.get(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN, roles.CUSTOMER]),
  getCategoryById
);
router.post(
  "/create",
  ZodValidation(createValidate),
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  createCategory
);
router.put(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  updateCategory
);
router.delete(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  deleteCategory
);

export default router;
