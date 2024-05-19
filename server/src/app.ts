import likesRouter from "@/routes/likes.routes";
import postsRouter from "@/routes/posts.routes";
import spotRouter from "@/routes/spots.routes";
import journeyRouter from "@/routes/journeys.routes";
import userRouter from "@/routes/users.routes";
import commentRouter from "@/routes/comments.routes";
import mypageRouter from "@/routes/mypages.routes";
import categoryRouter from "@/routes/categories.routes";
import { CORS_ORIGIN } from "@/settings";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import "reflect-metadata";

const app = express();

app.use(express.json({limit : '10mb'}));
app.use(express.urlencoded({ limit : '10mb', extended: false }));

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.sendStatus(500);
});
app.use(cookieParser());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    exposedHeaders: ["Authorization"],
  }),
);

app.use("/api/users", userRouter);
app.use("/api/journeys", journeyRouter);
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/spots", spotRouter);
app.use("/api/comments", commentRouter);
app.use("/api/mypages", mypageRouter);
app.use("/api/categories", categoryRouter);

export default app;
