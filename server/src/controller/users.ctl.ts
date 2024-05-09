import { AppDataSource } from "@/config/ormSetting";
import {
  BAD_REQUEST_ORIGIN_PASSWORD,
  DATA_UPDATE_FAILED,
  DATA_UPDATE_SUCCESSED,
  NOT_FOUND_USER,
  OK_RESET_PASSWORD,
  OK_RESET_REQUEST,
  UNAUTHORIZED_NOT_LOGIN,
} from "@/constants/message";
import { Users } from "@/models/users.model";
import userRepository from "@/repository/users.repo";
import usersService from "@/service/users.service";
import { iPatchData } from "@/types/users.types";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const join = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, nickname } = req.body;

  try {
    await usersService.join(email, password, nickname);
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

const patchUserInfoRequest = async (req: Request, res: Response) => {
  const patchData: iPatchData = req.body;
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id;
      const patchUserInfoResult = await userRepository.patchData(patchData, userId);
      if (!patchUserInfoResult.success) throw new Error(patchUserInfoResult.msg);
      res.status(StatusCodes.OK).json({ message: DATA_UPDATE_SUCCESSED });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "user data don't update")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: DATA_UPDATE_FAILED });
    }
  }
};

const resetRequest = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const resetResult = await userRepository.resetCheck(data);
    if (!resetResult.success) throw new Error(resetResult.msg);
    res.status(StatusCodes.OK).json({ message: OK_RESET_REQUEST });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "user does not exist")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_USER });
    }
  }
};
const resetPasswordRequest = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const resetPasswordResult = await userRepository.resetPassword(data);
    if (!resetPasswordResult.success) throw new Error(resetPasswordResult.msg);
    res.status(StatusCodes.OK).json({ message: OK_RESET_PASSWORD });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "user does not exist")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_USER });
    }
  }
};
const userResetPassword = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id;
      const getUserData = await userRepository.getUserDataRequest(userId);
      console.log(getUserData.createdAt);
      if (!getUserData) throw new Error("login required");
      const resetPasswordResult = await userRepository.userResetPassword(data, getUserData);
      if (!resetPasswordResult?.success) throw new Error(resetPasswordResult?.msg);
      res.status(StatusCodes.OK).json({ message: OK_RESET_PASSWORD });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === ("login required" || "user does not exist"))
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "wrong password")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_ORIGIN_PASSWORD });
    }
  }
};
const usersController = {
  join,
  login,
  checkEmail,
  checkNickname,
  patchUserInfoRequest,
  resetRequest,
  resetPasswordRequest,
  userResetPassword,
};

export default usersController;
