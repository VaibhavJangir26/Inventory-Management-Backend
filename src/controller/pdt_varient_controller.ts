import { PrismaClient, ProductVarients } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
import cacheService from "../utils/cache_service";
import { cacheKey } from "../utils/cache_key";

export const getAllPdtVarient = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: pdtId } = req.params;
    const cacheData = await cacheService.getFromRedis<ProductVarients>(
      cacheKey
    );
    if (cacheData) {
      return res.status(200).json({ msg: "all pdt", data: cacheData });
    }
    const data = await prisma.productVarients.findMany({
      where: {
        pdt_id: Number(pdtId),
      },
    });
    await cacheService.saveDataInRedis(cacheKey, data, 60);
    res.status(200).json({ msg: "all varient of pdt", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "failed to get all pdt varients", error: error });
  }
};

export const deleteVarient = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: varientId, id: pdtId } = req.params;
    const checkId = await prisma.productVarients.findUnique({
      where: {
        id: Number(varientId),
        pdt_id: Number(pdtId),
      },
    });
    if (!checkId)
      return res
        .status(404)
        .json({ msg: `no pdt with id->${pdtId} is found to delete` });
    const data = await prisma.productVarients.delete({
      where: {
        id: Number(varientId),
      },
    });
    res
      .status(200)
      .json({ msg: "pdt varient deleted successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to delete pdt varient", error: error });
  }
};

export const updatePdtVarient = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: pdtId, id: vairentId } = req.params;
    const { slug, varient_name, imgUrl, stock_quantity, price } = req.body;
    const checkId = await prisma.productVarients.findUnique({
      where: {
        id: Number(vairentId),
        pdt_id: Number(pdtId),
      },
    });
    if (!checkId)
      return res
        .status(404)
        .json({ msg: `no pdt varient with id->${pdtId} is found` });
    const data = await prisma.productVarients.update({
      where: {
        id: Number(vairentId),
      },
      data: {
        slug: slug,
        varient_name: varient_name,
        imgUrl: imgUrl,
        stock_quantity: stock_quantity,
        price: price,
        pdt: { connect: { id: Number(pdtId) } },
      },
    });
    res
      .status(200)
      .json({ msg: "pdt varient updated successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to update pdt varient", error: error });
  }
};

export const createPdtVarient = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: pdtId } = req.params;
    const { slug, varient_name, imgUrl, stock_quantity, price } = req.body;
    const checkId = await prisma.product.findUnique({
      where: {
        id: Number(pdtId),
      },
    });
    if (!checkId)
      return res
        .status(404)
        .json({ msg: `no pdt varient with id->${pdtId} is found` });
    const data = await prisma.productVarients.create({
      data: {
        slug: slug,
        varient_name: varient_name,
        imgUrl: imgUrl,
        stock_quantity: stock_quantity,
        price: price,
        created_at: new Date(Date.now()),
        pdt: { connect: { id: Number(pdtId) } },
      },
    });
    res
      .status(201)
      .json({ msg: "pdt varient created successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to create pdt varient", error: error });
  }
};
