import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { CORS_ORIGIN } from "@/settings";
import userRouter from "@/routes/users.routes";
import tripRouter from "@/routes/trip.routes";
import postsRouter from "@/routes/posts.routes";
import likesRouter from "@/routes/likes.routes";
import spotRouter from "@/routes/spot.routes";

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

app.use("/api/users", userRouter);
app.use("/api/trip", tripRouter);
app.use("/api/posts", postsRouter);
app.use("/api/likes", likesRouter);
app.use("/api/spot", spotRouter);

export default app;
