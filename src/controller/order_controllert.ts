import { Order, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import cacheService from "../utils/cache_service";
import { cacheKey } from "../utils/cache_key";
const prisma = new PrismaClient();

export const getAllOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const cacheData = await cacheService.getFromRedis<Order>(cacheKey);
    if (cacheData) {
      return res.status(200).json({ msg: "all orders", data: cacheData });
    }
    const category = await prisma.order.findMany({});
    await cacheService.saveDataInRedis(cacheKey, category);
    res.status(200).json({ msg: "all orders", data: category });
  } catch (error) {
    res.status(500).json({ msg: "failed to get all orders", error: error });
  }
};

export const getOrderById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: categoryId } = req.params;
    const data = await prisma.order.findUnique({
      where: {
        id: Number(categoryId),
      },
    });
    if (!data) return res.status(404).json({ msg: "no order with id found" });
    res.status(200).json({ msg: `order by id ${categoryId}`, data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to get order by id", error: error });
  }
};

export const deleteOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const checkId = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!checkId)
      return res
        .status(404)
        .json({ msg: `no order with id->${id} is found to delete` });
    const data = await prisma.order.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ msg: "order deleted successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to delete category", error: error });
  }
};

export const updateOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const { status, shipping_address, billing_address, total_amount } =
      req.body;
    const checkId = await prisma.order.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!checkId)
      return res.status(404).json({ msg: `no order with id->${id} is found` });
    const data = await prisma.order.update({
      where: {
        id: Number(id),
      },
      data: {
        status: status,
        shipping_add: shipping_address,
        billing_add: billing_address,
        total_amount: total_amount,
      },
    });
    res.status(200).json({ msg: "order updated successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to update order", error: error });
  }
};

export const createOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: userId } = req.params;
    const { status, shipping_add, billing_add, total_amount } = req.body;

    const data = await prisma.order.create({
      data: {
        status: status,
        shipping_add: shipping_add,
        billing_add: billing_add,
        total_amount: total_amount,
        user: { connect: { id: Number(userId) } },
        order_date: new Date(Date.now()),
      },
    });
    res.status(201).json({ msg: "order created successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to create order", error: error });
  }
};
