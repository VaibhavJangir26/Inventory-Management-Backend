import express, { Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./router/user_router";
import authRouter from "./router/auth_router";
import categoryRouter from "./router/categories_router";
import orderRouter from "./router/order_router";
import pdtVarientRouter from "./router/pdt_varient_router";
import pdtRouter from "./router/product_router";
import placedOrder from "./router/order_item_router";

const app = express();
dotenv.config();
const port_no: number | string = process.env.Port_No || 3000;
app.use(express.json());

app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/order", orderRouter);
app.use("/pdtvarient", pdtVarientRouter);
app.use("/pdt", pdtRouter);
app.use("/placed", placedOrder);

app.use((req: Request, res: Response) => {
  res.status(404).json({ msg: "resource not found" });
});

app.listen(port_no, () => {
  console.log("Server get started...");
});
