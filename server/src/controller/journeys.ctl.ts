import JourneysService from "@/service/journeys.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

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

const JourneysController = {
  getJourneysList,
  getJourneyDetail,
};
export default JourneysController;
