import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const getAllPlacedOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const category = await prisma.orderItem.findMany({});
    res.status(200).json({ msg: "all placed order", data: category });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "failed to get all placed order", error: error });
  }
};

export const getPlcedOrderById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: placedOrderId } = req.params;
    const data = await prisma.orderItem.findUnique({
      where: {
        id: Number(placedOrderId),
      },
    });
    if (!data)
      return res.status(404).json({ msg: "no placed order with id found" });
    res
      .status(200)
      .json({ msg: `placed order by id ${placedOrderId}`, data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "failed to get placed order by id", error: error });
  }
};

export const createPlacedOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: orderId, id: varientId } = req.params;
    const { quantity, varient_price } = req.body;
    const data = await prisma.orderItem.create({
      data: {
        quantity: quantity,
        varient_price: varient_price,
        order: { connect: { id: Number(orderId) } },
        pdt_varient: { connect: { id: Number(varientId) } },
      },
    });
    res
      .status(201)
      .json({ msg: "placed order created successfully", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "failed to create placed order", error: error });
  }
};

export const updatePlacedOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: orderId } = req.params;
    const { quantity, varient_price } = req.body;
    const checkId = await prisma.orderItem.findUnique({
      where: {
        id: Number(orderId),
      },
    });
    if (!checkId)
      return res
        .status(404)
        .json({ msg: `no placed order with id->${orderId} is found` });
    const data = await prisma.orderItem.update({
      where: {
        id: Number(orderId),
      },
      data: {
        quantity: quantity,
        varient_price: varient_price,
      },
    });
    res
      .status(200)
      .json({ msg: "order placed updated successfully", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "failed to update order placed", error: error });
  }
};

export const deletePlacedOrder = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: orderId } = req.params;
    const checkId = await prisma.orderItem.findUnique({
      where: {
        id: Number(orderId),
      },
    });
    if (!checkId)
      return res.status(404).json({
        msg: `no placed order with id->${orderId} is found to delete`,
      });
    const data = await prisma.orderItem.delete({
      where: {
        id: Number(orderId),
      },
    });
    res
      .status(200)
      .json({ msg: "placed order deleted successfully", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "failed to delete placed order", error: error });
  }
};
