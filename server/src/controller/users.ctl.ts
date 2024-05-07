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

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const results = await usersService.login(email, password);
    // 토큰 전달
    res.setHeader("Authorization", `Bearer ${results.accessToken}`);
    res.cookie("refresh_token", results.refreshToken, {
      httpOnly: true,
    });

    res.status(StatusCodes.OK).json({
      message: "로그인이 완료되었습니다.",
      userId: results.user.id,
      nickName: results.user.nickName,
    });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "아이디 또는 비밀번호가 일치하지 않습니다.",
    });
  }
};

const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    await usersService.checkEmail(email);
    res.status(StatusCodes.OK).json({
      message: "사용 가능한 이메일입니다.",
    });
  } catch (error) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "이미 존재하는 이메일입니다.",
    });
  }
};

const checkNickname = async (req: Request, res: Response, next: NextFunction) => {
  const { nickname } = req.body;

  try {
    await usersService.checkNickname(nickname);
    res.status(StatusCodes.OK).json({
      message: "사용 가능한 닉네임입니다.",
    });
  } catch (error) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "이미 존재하는 닉네임입니다.",
    });
  }
};

const usersController = {
  join,
  login,
  checkEmail,
  checkNickname,
};

export default usersController;
