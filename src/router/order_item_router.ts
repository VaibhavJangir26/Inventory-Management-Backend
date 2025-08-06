import express from "express";
const router = express.Router();

import {
  getAllPlacedOrder,
  getPlcedOrderById,
  updatePlacedOrder,
  createPlacedOrder,
  deletePlacedOrder,
} from "../controller/order_item_controller";

router.get("/", getAllPlacedOrder);
router.get("/id/:id", getPlcedOrderById);
router.put("/id/:id", updatePlacedOrder);
router.post("/orderId/:id/varientId/:id", createPlacedOrder);
router.delete("/id/:id", deletePlacedOrder);

export default router;
