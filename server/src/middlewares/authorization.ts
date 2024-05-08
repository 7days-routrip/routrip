import { AppDataSource } from "@/config/ormSetting";
import { UNAUTHORIZED_NOT_LOGIN } from "@/constants/message";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const setRepo = (type: string) => {
  const repo = AppDataSource.getRepository(type);
  return repo;
};
const authorization = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.isLoggedIn) {
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
    } else {
      throw new Error("user does not login");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "잘못된 접근입니다.") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: err.message,
        });
      }
      if (err.message === "user does not login") {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: UNAUTHORIZED_NOT_LOGIN,
        });
      }
    }
  }
};

export { authorization };
