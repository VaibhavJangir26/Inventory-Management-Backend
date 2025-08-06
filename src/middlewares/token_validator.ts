import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const TokenValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    var authHeader = req.headers.authorization as string;
    if (!authHeader)
      return res.status(400).json({ msg: "access token is required" });

    const token = authHeader.split(" ")[1];

    const verify = jwt.verify(
      token,
      process.env.jwt_access_secret!
    ) as JwtPayload;
    console.log(verify);

    req.user = verify;
    next();
  } catch (error) {
    res.status(403).json({ msg: "access token is not correct or expire" });
    return;
  }
};
