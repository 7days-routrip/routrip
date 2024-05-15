import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "@/settings";
import { StatusCodes } from "http-status-codes";
import { getNewAccessToken } from "@/utils/token";
import { AppDataSource } from "@/config/ormSetting";
import { Users } from "@/models/users.model";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // 로그인 요청
  if (token == null) {
    req.user = { isLoggedIn: false };
    next();
  } else {
    jwt.verify(token, JWT_ACCESS_SECRET, (err: any, user: any) => {
      if (err) {
        const refreshToken = req.cookies["refresh_token"];
        // 재로그인 요청
        if (!refreshToken)
          return res.status(StatusCodes.UNAUTHORIZED).json({
            message: "로그인 인증이 만료되었습니다.\n다시 로그인 해주세요.",
          });

        jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err: any, user: any) => {
          // 재로그인 요청
          if (err)
            return res.status(StatusCodes.UNAUTHORIZED).json({
              message: "로그인 인증이 만료되었습니다.\n다시 로그인 해주세요.",
            });
          const userRepository = AppDataSource.getRepository(Users);
          const dbUser = await userRepository.findOne({
            where: {
              id: user.userId,
            },
          });

          if (dbUser && dbUser.id === user.userId) {
            // access-token 토큰 재발급
            const accessToken = getNewAccessToken(user.userId, user.nickName);
            res.setHeader("Authorization", "Bearer " + accessToken);
            req.user = { id: user.userId, nickName: user.nickName, isLoggedIn: true };
            next();
          } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              message: "로그인 인증이 만료되었습니다.\n다시 로그인 해주세요.",
            });
          }
        });
      } else {
        req.user = { id: user.userId, nickName: user.nickName, isLoggedIn: true };
        next();
      }
    });
  }
};

export const authenticateUserPlaceDetail = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // 로그인 요청
  if (token == null) {
    req.user = { isLoggedIn: false };
    next();
    return;
  } else {
    //access 토큰 검증
    jwt.verify(token, JWT_ACCESS_SECRET, (err: any, user: any) => {
      if (err) {
        const refreshToken = req.cookies["refresh_token"];
        // 재로그인 요청
        if (!refreshToken) {
          req.user = { id: user.userId, nickName: user.nickName, isLoggedIn: false };
          next();
          return;
        }

        jwt.verify(refreshToken, JWT_REFRESH_SECRET, async (err: any, user: any) => {
          // 재로그인 요청
          if (err) {
            req.user = { isLoggedIn: false };
            next();
            return;
          }

          const userRepository = AppDataSource.getRepository(Users);
          const dbUser = await userRepository.findOne({
            where: {
              id: user.userId,
            },
          });

          if (dbUser && dbUser.id === user.userId) {
            // access-token 토큰 재발급
            const accessToken = getNewAccessToken(user.userId, user.nickName);
            res.setHeader("Authorization", "Bearer " + accessToken);
            req.user = { id: user.userId, nickName: user.nickName, isLoggedIn: true };
            next();
            return;
          } else {
            req.user = { id: user.userId, nickName: user.nickName, isLoggedIn: false };
            next();
            return;
          }
        });
      } else {
        req.user = { id: user.userId, nickName: user.nickName, isLoggedIn: true };
        next();
        return;
      }
    });
  }
};
