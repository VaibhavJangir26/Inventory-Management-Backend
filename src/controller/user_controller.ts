import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import dotenv from "dotenv";
import cacheSerice from "../utils/cache_service";
import { cacheKey } from "../utils/cache_key";
dotenv.config();

const prisma = new PrismaClient();

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const cachceData= await cacheSerice.getFromRedis<User>(cacheKey);
    if(cachceData){
      return res.status(200).json({ msg: "all users", data: cachceData });
    }
    const data = await prisma.user.findMany({});
    await cacheSerice.saveDataInRedis(cacheKey,data);
    res.status(200).json({ msg: "all users", data: data });
  } catch (error) {
    res.status(500).json({ msg: "error", error: error });
  }
};
