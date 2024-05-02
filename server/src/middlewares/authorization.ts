import { pool } from "@/config/mariadb";
import { NextFunction, Request, Response } from "express";

const getSql = (type: string): string => {
  const sql = `select userId from ${type} where id = ?`;
  return sql;
};

const authorization = async (req: Request, res: Response, next: NextFunction) => {
  const conn = await pool.getConnection();
  try {
    if (typeof req.user !== "undefined") {
      const itemId: number = parseInt(req.params.id);
      const userId: number = req.user.id;
      let sql: string;

      if (req.path.includes("trips")) {
        sql = getSql("jeurneys");
      } else if (req.path.includes("comments")) {
        sql = getSql("comments");
      } else if (req.path.includes("posts")) {
        sql = getSql("posts");
      }

      // const [match] = await conn.query(sql, values);
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "") {
      }
    }
  }
};

export { authorization };
