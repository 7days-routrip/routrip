import JourneysRepository from "@/repository/journeys.repo";
import { Request, Response } from "express";

const getJourneysList = async (userId: number) => {
  const results = await JourneysRepository.getJourneysList(userId);
  if (!results.length) throw new Error("등록하신 일정이 없습니다.");

  return results;
};

const JourneysService = {
  getJourneysList,
};

export default JourneysService;