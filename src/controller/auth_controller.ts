import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { connect } from "http2";
dotenv.config();

const prisma = new PrismaClient();

export const AdminSignUp = (req: Request, res: Response) => {
  return signup(req, res, 0);
};
export const CustomerSignUp = (req: Request, res: Response) => {
  return signup(req, res, 5);
};

const signup = async (req: Request, res: Response, roleId: number) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const exitingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (exitingUser)
      return res
        .status(400)
        .json({ msg: "user already exits with email ", email: email });
     await prisma.user.create({
      data: {
        email: email,
        password: hashPassword,
        role: { connect: { id: roleId } },
      },
    });
    const person = roleId == 0 ? "Admin" : "User";
    res.status(201).json({ msg: `${person} created successfully` });
  } catch (error) {
    res.status(500).json({ msg: "signup failed", error: error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) return res.status(404).json({ msg: "user not found" });
    const compPass = await bcrypt.compare(password, user.password);
    if (!compPass) return res.status(401).json({ msg: "invalid credentail" });

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role_id },
      process.env.jwt_access_secret!,
      { expiresIn: "15min" }
    );
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role_id },
      process.env.jwt_refresh_secret!,
      { expiresIn: "7d" }
    );
    await prisma.token.create({
      data: {
        refresh_token: refreshToken,
        user: { connect: { id: user.id } },
      },
    });
    res
      .status(201)
      .json({
        msg: "login successfully",
        access_token: accessToken,
        refresh_token: refreshToken,
      });
  } catch (error) {
    res.status(500).json({ msg: "login failed", error: error });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;
    if (!refresh_token)
      return res.status(400).json({ msg: "refresh token is required" });

    const verify = jwt.verify(refresh_token, process.env.jwt_refresh_secret!);
    if (!verify)
      return res
        .status(401)
        .json({ msg: "either token expire or wrong token" });

    await prisma.token.delete({
      where: {
        refresh_token: refresh_token,
      },
    });

    res.status(200).json({ msg: "logout successfully" });
  } catch (error) {
    res.status(500).json({ msg: "logout failed", error: error });
  }
};

export const newTokenGen = async (req: Request, res: Response) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ msg: "refresh_token is required" });
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(
        refresh_token,
        process.env.jwt_refresh_secret!
      ) as JwtPayload;
    } catch (err) {
      return res
        .status(401)
        .json({ msg: "refresh token is expired or invalid" });
    }

    const userId = payload.userId;

    const accessToken = jwt.sign({ userId }, process.env.jwt_access_secret!, {
      expiresIn: "15min",
    });
    const refreshToken = jwt.sign({ userId }, process.env.jwt_refresh_secret!, {
      expiresIn: "7d",
    });

    await prisma.token.create({
      data: {
        refresh_token: refreshToken,
        user_id: userId,
      },
    });

    res.status(200).json({
      msg: "new token generated",
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ msg: "failed to generate new token", error: error });
  }
};
