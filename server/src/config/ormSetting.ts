
import { Comments } from "@/models/comments.model";
import { Continents } from "@/models/continents.model";
import { Countries } from "@/models/countries.model";
import { DaySeq } from "@/models/daySeq.model";
import { Journeys } from "@/models/journeys.model";
import { Likes } from "@/models/likes.model";
import { Picks } from "@/models/picks.model";
import { Places } from "@/models/places.model";
import { Posts } from "@/models/posts.model";
import { RouteDays } from "@/models/routeDays.model";
import { Routes } from "@/models/routes.model";
import { Users } from "@/models/users.model";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "@/settings";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mariadb",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  timezone: 'Asia/Seoul',
  synchronize: true,
  logging: true,
  connectTimeout: 30000,
  entities: [Users, Comments, Continents, Countries, Journeys, Likes, Picks, Places, Posts, RouteDays, Routes, DaySeq],
});

AppDataSource.initialize()
  .then(() => {})
  .catch((error) => {
    console.log(error);
  });

