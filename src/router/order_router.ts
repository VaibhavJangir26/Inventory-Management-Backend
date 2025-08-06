import express from "express";
const router = express.Router();
import z from "zod";

import {
  getAllOrder,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controller/order_controllert";
import { ZodValidation } from "../middlewares/zod_validation";
import { TokenValidator } from "../middlewares/token_validator";
import { AccessPermission } from "../middlewares/access_permission";
import { roles } from "../utils/role_constants";

const createOrderValidate = z.object({
  status: z.boolean(),
  shipping_add: z.string(),
  billing_add: z.string(),
  total_amount: z.number(),
});

router.get(
  "/",
  TokenValidator,
  AccessPermission([roles.ADMIN, roles.CUSTOMER]),
  getAllOrder
);
router.get(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.ADMIN, roles.CUSTOMER]),
  getOrderById
);
router.post(
  "/create/id/:id",
  ZodValidation(createOrderValidate),
  TokenValidator,
  AccessPermission([roles.CUSTOMER]),
  createOrder
);
router.put(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.CUSTOMER]),
  updateOrder
);
router.delete(
  "/id/:id",
  TokenValidator,
  AccessPermission([roles.CUSTOMER]),
  deleteOrder
);

export default router;
