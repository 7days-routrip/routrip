import "express";

declare module "express" {
  export interface Request {
    user?:
      | {
          id: number;
          nickName: string;
        }
      | undefined;
  }
}
