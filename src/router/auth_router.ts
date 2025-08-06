import express from "express";
const router = express.Router();
import z, { string } from "zod";

import {
  AdminSignUp,
  CustomerSignUp,
  login,
  logout,
  newTokenGen,
} from "../controller/auth_controller";
import { ZodValidation } from "../middlewares/zod_validation";

const singupValidator = z.object({
  name: z.string().optional(),
  email: z.string().email("email format is not correct"),
  password: z.string().min(6, "min 6 length password required"),
});

router.post("/signup/admin", ZodValidation(singupValidator), AdminSignUp);
router.post("/signup/user", ZodValidation(singupValidator), CustomerSignUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", newTokenGen);

export default router;
