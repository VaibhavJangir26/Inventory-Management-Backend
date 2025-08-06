import express from "express";
const router = express.Router();
import z, { number } from "zod";

import {
  getAllPdtVarient,
  deleteVarient,
  updatePdtVarient,
  createPdtVarient,
} from "../controller/pdt_varient_controller";
import { ZodValidation } from "../middlewares/zod_validation";
import { TokenValidator } from "../middlewares/token_validator";
import { AccessPermission } from "../middlewares/access_permission";
import { roles } from "../utils/role_constants";

const pdtVarientValidate = z.object({
  slug: z.string(),
  imgUrl: z.string(),
  varient_name: z.string(),
  price: z.number(),
  stock_quantity: z.number(),
});

router.get(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN, roles.CUSTOMER]),
  getAllPdtVarient
);
router.post(
  "/create/pdtid/:id",
  ZodValidation(pdtVarientValidate),
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  createPdtVarient
);
router.patch(
  "/pdtid/:id/varientid/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  updatePdtVarient
);
router.delete(
  "/pdtid/:id/varientid/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN]),
  deleteVarient
);

export default router;
