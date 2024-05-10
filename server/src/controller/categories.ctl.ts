import { NOT_FOUND_CATEGORY } from "@/constants/message";
import CategoriesService from "@/service/categories.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const categoryAllListRequest = async (req: Request, res: Response) => {
  try {
    const listResult = await CategoriesService.reqCategoryList();
    if (!listResult) throw new Error("not found");
    res.status(StatusCodes.OK).json(listResult);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "not found") return res.status(StatusCodes.NOT_FOUND).json({ message: NOT_FOUND_CATEGORY });
    }
  }
};

const CategoriesController = { categoryAllListRequest };
export default CategoriesController;
