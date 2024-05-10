import JourneysRepository from "@/repository/journeys.repo";
import { Request, Response } from "express";

const getJourneysList = async (userId: number) => {
  const results = await JourneysRepository.getJourneysList(userId);
  if (!results.length) throw new Error("등록하신 일정이 없습니다.");

  return results;
};

const getJourneyDetail = async (journeyId: number) => {
  const result = await JourneysRepository.getJourneyDetail(journeyId);
  if (!result) throw new Error("일정 정보가 없습니다.");

  return result;
}

const JourneysService = {
  getJourneysList,
  getJourneyDetail,
};

export default JourneysService;
