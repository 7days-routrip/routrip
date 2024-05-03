import likesRouter from "@/routes/likes.routes";
import postsRouter from "@/routes/posts.routes";
import spotRouter from "@/routes/spot.routes";
import tripRouter from "@/routes/trip.routes";
import userRouter from "@/routes/users.routes";
import { CORS_ORIGIN } from "@/settings";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./config/ormSetting";
import { Continents } from "./models/continents.model";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());


import { Users } from "@/models/users.model";
import { pool } from "./config/mariadb";
app.post("/test", async (req: Request, res: Response) => {
  const user = new Users();
  user.email = req.body.email;
  user.nickName = req.body.nickName;
  user.password = req.body.password;

  const userRepository = AppDataSource.getRepository(Users);
  await userRepository.save(user);

});

app.use("/api/users", userRouter);
app.use("/api/trip", tripRouter);
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/spot", spotRouter);

export default app;
