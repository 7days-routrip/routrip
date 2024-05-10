import JourneysRepository from "@/repository/journeys.repo";
import { Request, Response } from "express";

const getJourneysList = async (userId: number) => {
  await JourneysRepository.getJourneysList(userId);
};

const JourneysService = {
  getJourneysList,
};

export default JourneysService;
