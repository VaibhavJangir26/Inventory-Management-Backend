import { Request, Response, NextFunction } from "express";

export const AccessPermission = (rbac: number[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as any;

    if (typeof user?.role !== "number" || !rbac.includes(user.role)) {
      res
        .status(403)
        .json({ msg: "you dont have permission to access this resource" });
      return;
    }

    next();
  };
};
