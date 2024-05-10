import JourneysService from "@/service/journeys.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const getJourneysList = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) throw new Error("사용자 정보가 없습니다.");

  //   try {
  //     const journeys = await JourneysService.getJourneysList(user.id);

  //     res.status(200).json({
  //       journeys,
  //     });
  //   } catch (error) {}
  res.status(StatusCodes.OK).json({
    user: user.id,
  });
};

const JourneysController = {
  getJourneysList,
};

export default JourneysController;
