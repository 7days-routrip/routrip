import { Users } from "@/models/users.model";
import JourneysService from "@/service/journeys.service";
import { Day } from "@/types/journeys.types";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { arrayBuffer } from "stream/consumers";

const getJourneysList = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    if (!user?.isLoggedIn) throw new Error("사용자 정보가 없습니다.\n로그인이 필요한 서비스입니다.");
    const journeys = await JourneysService.getJourneysList(user.id as number);

    res.status(200).json(journeys);
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }
};

const getJourneyDetail = async (req: Request, res: Response) => {
  const user = req.user;
  const journeyId = Number(req.params.id);

  try {
    if (!user?.isLoggedIn) throw new Error("사용자 정보가 없습니다.\n로그인이 필요한 서비스입니다.");
    const journey = await JourneysService.getJourneyDetail(journeyId);

    res.status(200).json(journey);
  } catch (error: any) {
    res.status(StatusCodes.NOT_FOUND).json({
      message: error.message,
    });
  }
};

const addJourney = async (req: Request, res: Response, next: NextFunction) => {
  const title: string = req.body.title;
  const startDate: Date = new Date(req.body.startDate);
  const endDate: Date = new Date(req.body.endDate);
  const days: Day[] = req.body.days;

  const user = req.user;

  try {
    JourneysService.register(title, startDate, endDate, days, user);
    return res.status(StatusCodes.OK).json({
      message: "일정 등록이 완료되었습니다.",
    });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

const modifyJourney = async (req: Request, res: Response, next: NextFunction) => {
  const id: number = parseInt(req.params.id);
  const title: string = req.body.title;
  const startDate: Date = new Date(req.body.startDate);
  const endDate: Date = new Date(req.body.endDate);
  const days: Day[] = req.body.days;

  const user = req.user;

  try {
    JourneysService.modify(id, title, startDate, endDate, days, user);
    return res.status(StatusCodes.OK).json({
      message: "일정 수정이 완료되었습니다.",
    });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

const deleteJourney = async (req: Request, res: Response, next: NextFunction) => {
  const id: number = parseInt(req.params.id);
  const user = req.user;

  try {
    await JourneysService.remove(id);
    return res.status(StatusCodes.OK).json({
      message: "일정이 삭제 되었습니다.",
    });
  } catch (error: any) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: error.message,
    });
  }
};

const JourneysController = {
  getJourneysList,
  getJourneyDetail,
  addJourney,
  modifyJourney,
  deleteJourney,
};

export default JourneysController;
