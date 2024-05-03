import usersService from "@/service/users.service";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const join = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, nickName } = req.body;

  try {
    await usersService.join(email, password, nickName);
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 요청입니다.",
    });
  }

  res.status(StatusCodes.CREATED).json({
    message: "회원가입이 완료되었습니다.\n로그인을 진행해주세요.",
  });
};

const usersController = {
  join,
};

export default usersController;
