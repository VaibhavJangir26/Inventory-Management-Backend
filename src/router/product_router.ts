import express from "express";
const router = express.Router();
import z from "zod";

import {
  getAllPdt,
  updatePdt,
  getPdtById,
  deletePdt,
  createPdt,
} from "../controller/product_controller";
import { ZodValidation } from "../middlewares/zod_validation";
import { AccessPermission } from "../middlewares/access_permission";
import { TokenValidator } from "../middlewares/token_validator";
import { roles } from "../utils/role_constants";

const createPdtValidate = z.object({
  name: z.string(),
  desc: z.string(),
  price: z.number(),
  imgUrl: z.string(),
});

router.get(
  "/",
  TokenValidator,
  AccessPermission([roles.ADMIN, roles.CUSTOMER]),
  getAllPdt
);
router.get(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN, roles.CUSTOMER]),
  getPdtById
);
router.post(
  "/create/categoryId/:id",
  ZodValidation(createPdtValidate),
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  createPdt
);
router.put(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  updatePdt
);
router.delete(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  deletePdt
);

export default router;
