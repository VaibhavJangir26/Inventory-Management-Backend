import { Category, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import cacheService from "../utils/cache_service";
import { cacheKey } from "../utils/cache_key";
const prisma = new PrismaClient();

export const getAllCategory = async (req: Request, res: Response):Promise<Response|void> => {
  try {
    const cacheData= await cacheService.getFromRedis<Category>(cacheKey);
    if(cacheData){
      return res.status(200).json({ msg: "all category", data: cacheData});
    }
    const category = await prisma.category.findMany({});
    await cacheService.saveDataInRedis(cacheKey,category,60);
    res.status(200).json({ msg: "all category", data: category });
  } catch (error) {
    res.status(500).json({ msg: "failed to get all pdt", error: error });
  }
};

export const getCategoryById = async (req: Request, res: Response):Promise<Response|void> => {
  try {
    const { id: categoryId } = req.params;
    const data = await prisma.category.findUnique({
      where: {
        id: Number(categoryId),
      },
    });
    if(!data) return res.status(404).json({msg: "no category with id found"});
    res.status(200).json({ msg: `category by id ${categoryId}`, data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to get category by id", error: error });
  }
};

export const createCategory = async (req: Request, res: Response):Promise<Response|void>=> {
  try {
    const { name, desc } = req.body;
    const data = await prisma.category.create({
      data: {
        name: name,
        desc: desc,
      },
    });
    res.status(201).json({ msg: "category created successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to create category", error: error });
  }
};

export const updateCategory = async (req: Request, res: Response):Promise<Response|void>=> {
  try {
    const { id } = req.params;
    const { name, desc } = req.body;
    const checkId= await prisma.category.findUnique({
        where: {
            id:Number(id)
        }
    });
    if(!checkId) return res.status(404).json({msg: `no category with id->${id} is found`})
    const data = await prisma.category.update({
      where: {
        id: Number(id),
      },
      data: {
        name: name,
        desc: desc,
      },
    });
    res.status(200).json({ msg: "category updated successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to update category", error: error });
  }
};

export const deleteCategory = async (req: Request, res: Response):Promise<Response|void>=> {
  try {
    const { id } = req.params;
    const checkId= await prisma.category.findUnique({
        where: {
            id:Number(id)
        }
    });
    if(!checkId) return res.status(404).json({msg: `no category with id->${id} is found to delete`})
    const data = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ msg: "category deleted successfully", data: data });
  } catch (error) {
    res.status(500).json({ msg: "failed to delete category", error: error });
  }
};
