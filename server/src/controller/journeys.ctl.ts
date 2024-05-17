import {
  INTERNAL_SERVER_ERROR,
  INTERNAL_SERVER_ERROR_DELETE_JOURNEY,
  INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY,
  NOT_FOUND_JOURNEY,
  NOT_FOUND_JOURNEY_LIST,
  NOT_FOUND_PLACE,
  NOT_FOUND_USER_LOGIN_REQUIRED,
  OK_DELETE_JOURNEY,
  OK_UPDATE_JOURNEY,
  OK_UPLOAD_JOURNEY,
} from "@/constants/message";
import JourneysService from "@/service/journeys.service";
import { Day } from "@/types/journeys.types";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const getJourneysList = async (req: Request, res: Response) => {
  const user = req.user;

  try {
    if (!user?.isLoggedIn) throw new Error(NOT_FOUND_USER_LOGIN_REQUIRED);
    const journeys = await JourneysService.getJourneysList(user.id as number);

    res.status(200).json(journeys);
  } catch (error: any) {
    if (error.message === NOT_FOUND_JOURNEY_LIST) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const getJourneyDetail = async (req: Request, res: Response) => {
  const user = req.user;
  const journeyId = Number(req.params.id);

  try {
    if (!user?.isLoggedIn) throw new Error(NOT_FOUND_USER_LOGIN_REQUIRED);
    const journey = await JourneysService.getJourneyDetail(journeyId);
    res.status(200).json(journey);
  } catch (error: any) {
    if (error.message === NOT_FOUND_JOURNEY) {
      res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const addJourney = async (req: Request, res: Response, next: NextFunction) => {
  const title: string = req.body.title;
  const startDate: Date = new Date(req.body.startDate);
  const endDate: Date = new Date(req.body.endDate);
  const days: Day[] = req.body.days;

  const user = req.user;

  try {
    await JourneysService.register(title, startDate, endDate, days, user);
    return res.status(StatusCodes.OK).json({
      message: OK_UPLOAD_JOURNEY,
    });
  } catch (error: any) {
    if (error.message === INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    } else if (error.message === NOT_FOUND_PLACE) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
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
    await JourneysService.modify(id, title, startDate, endDate, days, user);
    return res.status(StatusCodes.OK).json({
      message: OK_UPDATE_JOURNEY,
    });
  } catch (error: any) {
    if (error.message === INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    } else if (error.message === NOT_FOUND_PLACE) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else if (error.message === NOT_FOUND_JOURNEY) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else if (error.message === INTERNAL_SERVER_ERROR_DELETE_JOURNEY) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
  }
};

const deleteJourney = async (req: Request, res: Response, next: NextFunction) => {
  const id: number = parseInt(req.params.id);
  const user = req.user;

  try {
    await JourneysService.remove(id);
    return res.status(StatusCodes.OK).json({
      message: OK_DELETE_JOURNEY,
    });
  } catch (error: any) {
    if (error.message === NOT_FOUND_JOURNEY) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: error.message,
      });
    } else if (error.message === INTERNAL_SERVER_ERROR_DELETE_JOURNEY) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: error.message,
      });
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: INTERNAL_SERVER_ERROR,
      });
    }
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
