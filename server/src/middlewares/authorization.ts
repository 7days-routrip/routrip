import { Request, Response, NextFunction } from "express";

const authorization = async (req: Request, res: Response, next: NextFunction) => {
  const itemId: number = parseInt(req.params.id);
  const userId: number = req.body.user.id;
};

export { authorization };
