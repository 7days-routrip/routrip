import { AppDataSource } from "@/config/ormSetting";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const setRepo = (type: string) => {
  const repo = AppDataSource.getRepository(type);
  return repo;
};
const authorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof req.user !== "undefined") {
      const itemId: number = parseInt(req.params.id);
      const userId: number = req.user.id;
      let repo;
      if (req.path.includes("trips")) {
        repo = setRepo("journeys");
      } else if (req.path.includes("comments")) {
        repo = setRepo("comments");
      } else if (req.path.includes("posts")) {
        repo = setRepo("posts");
      }

      const findData = await repo?.findOneBy({ id: itemId });
      if (!findData || findData.userId !== userId) throw new Error("잘못된 접근입니다.");
      next();
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "잘못된 접근입니다.") {
        res.status(StatusCodes.FORBIDDEN).json({
          message: err.message,
        });
      }
    }
  }
};

export { authorization };
