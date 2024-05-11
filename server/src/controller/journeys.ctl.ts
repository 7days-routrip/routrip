import { Users } from "@/models/users.model";
import JourneysService from "@/service/journeys.service";
import { Day } from "@/types/journeys.types";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const addJourney = async (req: Request, res: Response, next: NextFunction) => {
  const title: string = req.body.title;
  const startDate: Date = req.body.startDate;
  const endDate: Date = req.body.endDate;
  const days: Day[] = req.body.days;

  const user = req.user;

  try {
    JourneysService.register(title, startDate, endDate, days, user);
    return res.status(StatusCodes.OK).json({
      message: "일정 등록이 완료되었습니다.",
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "잘못된 요청입니다.",
    });
  }
};

const getJourneysList = async (req: Request, res: Response) => {
  const user = req.user;
  //   if (!user) throw new Error("사용자 정보가 없습니다.");

  //   try {
  //     const journeys = await JourneysService.getJourneysList(user.id);

  //     res.status(200).json({
  //       journeys,
  //     });
  //   } catch (error) {}
  res.status(StatusCodes.OK).json({
    user: user,
  });
};

const JourneysController = {
  getJourneysList,
  addJourney,
};

export default JourneysController;
