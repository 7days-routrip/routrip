import {
  BAD_REQUEST_ORIGIN_PASSWORD,
  BAD_REQUEST_RESET_PASSWORD,
  BAD_REQUEST_WITHDRAW,
  DATA_UPDATE_FAILED,
  DATA_UPDATE_SUCCESSED,
  NOT_FOUND_USER,
  OK_LOGOUT,
  OK_RESET_PASSWORD,
  OK_RESET_REQUEST,
  OK_WITHDRAW,
  UNAUTHORIZED_NOT_LOGIN,
} from "@/constants/message";
import UsersService from "@/service/users.service";
import { iPatchData } from "@/types/users.types";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const join = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, nickname } = req.body;

  try {
    await UsersService.join(email, password, nickname);
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
    const results = await UsersService.login(email, password);
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
const logout = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      res.setHeader("Authorization", "");
      res.clearCookie("refresh_token");
      res.status(StatusCodes.OK).json({ message: OK_LOGOUT });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};
const userWithdraw = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const dataResult = await UsersService.reqUserWithdraw(userId);
      if (!dataResult.success) throw new Error(dataResult.msg);
      res.setHeader("Authorization", "");
      res.clearCookie("refresh_token");
      res.status(StatusCodes.OK).json({ message: OK_WITHDRAW });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "failed to withdraw")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_WITHDRAW });
    }
  }
};
const checkEmail = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const checkResult = await UsersService.checkEmail(email);
    if (checkResult.success) throw new Error(checkResult.msg);
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
    await UsersService.checkNickname(nickname);
    res.status(StatusCodes.OK).json({
      message: "사용 가능한 닉네임입니다.",
    });
  } catch (error) {
    return res.status(StatusCodes.CONFLICT).json({
      message: "이미 존재하는 닉네임입니다.",
    });
  }
};

const userInfoUpdateRequest = async (req: Request, res: Response) => {
  const patchData: iPatchData = req.body;
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const updateResult = await UsersService.reqUsersUpdate(patchData, userId);
      if (!updateResult.success) throw new Error(updateResult.msg);
      res.status(StatusCodes.OK).json({ message: DATA_UPDATE_SUCCESSED });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "login required")
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
      if (err.message === "failed to update")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: DATA_UPDATE_FAILED });
    }
  }
};

const resetRequest = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const checkResult = await UsersService.checkEmail(data.email);
    if (!checkResult.success) throw new Error(checkResult.msg);
    res.status(StatusCodes.OK).json({ message: OK_RESET_REQUEST });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "존재하지 않는 사용자 입니다.")
        return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_USER });
    }
  }
};
const resetPasswordRequest = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const resetResult = await UsersService.reqPasswordUpate(data);
    if (!resetResult.success) throw new Error(resetResult.msg);
    res.status(StatusCodes.OK).json({ message: OK_RESET_PASSWORD });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "failed to update")
        return res.status(StatusCodes.BAD_REQUEST).json({ message: BAD_REQUEST_RESET_PASSWORD });
    }
  }
};

const userResetPassword = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const getUserData = await UsersService.findUser(userId);
      if (!getUserData) throw new Error("user does not exist");
      const compareReuslt = await UsersService.comparePassword(data.originPassword, getUserData.password);
      if (!compareReuslt) throw new Error("wrong password");
      const resetResult = await UsersService.reqUserPasswordUpdate(data, userId);
      if (!resetResult?.success) throw new Error(resetResult?.msg);
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

const userUploadProfileImg = async (req: Request, res: Response) => {
  try {
    if (req.user?.isLoggedIn) {
      const userId = req.user.id as number;
      const file = req.file as Express.MulterS3.File;
      await UsersService.reqImageUpload(file.location, userId);
      res.status(StatusCodes.OK).json({
        url: file.location,
      });
    } else {
      throw new Error("login required");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === ("login required" || "user does not exist"))
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: UNAUTHORIZED_NOT_LOGIN });
    }
  }
};
const UsersController = {
  join,
  login,
  checkEmail,
  checkNickname,
  userInfoUpdateRequest,
  resetRequest,
  resetPasswordRequest,
  userResetPassword,
  logout,
  userWithdraw,
  userUploadProfileImg,
};

export default UsersController;
