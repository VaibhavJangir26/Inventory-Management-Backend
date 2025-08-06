import express from "express";
const router = express.Router();

import { getAllUser } from "../controller/user_controller";

router.get("/", getAllUser);

export default router;
