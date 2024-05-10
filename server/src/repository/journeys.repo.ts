import { AppDataSource } from "@/config/ormSetting";
import { Journeys } from "@/models/journeys.model";
import { Request, Response } from "express";

const journeysRepository = AppDataSource.getRepository(Journeys);

const getJourneysList = async (userId: number) => {
  return journeysRepository.find({
    where: {
      user: { id: userId },
    },
  });
};

const JourneysRepository = {
  getJourneysList,
  journeysRepository,
};

export default JourneysRepository;
