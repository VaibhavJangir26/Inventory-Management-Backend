import { PrismaClient, Product } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
import cacheService from "../utils/cache_service";
import { cacheKey } from "../utils/cache_key";

export const getAllPdt = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const cacheData= await cacheService.getFromRedis<Product>(cacheKey);
    if(cacheData){
     return res.status(200).json({ msg: "all pdt", data: cacheData });
    }
    const data = await prisma.product.findMany({});
    await cacheService.saveDataInRedis(cacheKey,data,60)
    res.status(200).json({ msg: "all pdt", data: data });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "failed to get all pdt varients", error: error });
  }
};

export const getPdtById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: pdtId } = req.params;
    const data = await prisma.product.findUnique({
      where: {
        id: Number(pdtId),
      },
    });
    if (!data)
      return res.status(404).json({ msg: `no pdt with id->${pdtId} is found` });
    res.status(200).json({ msg: "all pdt", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to get pdt", error: error });
  }
};

export const deletePdt = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: pdtId } = req.params;
    const checkId = await prisma.product.findUnique({
      where: {
        id: Number(pdtId),
      },
    });
    if (!checkId)
      return res
        .status(404)
        .json({ msg: `no pdt with id->${pdtId} is found to delete` });
    const data = await prisma.product.delete({
      where: {
        id: Number(pdtId),
      },
    });
    res.status(200).json({ msg: "pdt deleted successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to delete pdt varient", error: error });
  }
};

export const updatePdt = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: pdtId } = req.params;
    const { name, desc, imgUrl, price } = req.body;
    const checkId = await prisma.order.findUnique({
      where: {
        id: Number(pdtId),
      },
    });
    if (!checkId)
      return res.status(404).json({ msg: `no pdt with id->${pdtId} is found` });
    const data = await prisma.product.update({
      where: {
        id: Number(pdtId),
      },
      data: {
        name: name,
        desc: desc,
        imgUrl: imgUrl,
        price: price,
        updated_at: new Date(Date.now()),
      },
    });
    res.status(200).json({ msg: "pdt updated successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to update pdt", error: error });
  }
};

export const createPdt = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { id: categoryId } = req.params;
    const { name, desc, imgUrl, price } = req.body;
    const data = await prisma.product.create({
      data: {
        name: name,
        desc: desc,
        imgUrl: imgUrl,
        price: price,
        updated_at: new Date(Date.now()),
        category: { connect: { id: Number(categoryId) } },
      },
    });
    res.status(201).json({ msg: "pdt created successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to create pdt", error: error });
  }
};
