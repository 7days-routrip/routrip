import { AppDataSource } from "@/config/ormSetting";
import { DaySeq } from "@/models/daySeq.model";
import { Journeys } from "@/models/journeys.model";
import { Places } from "@/models/places.model";
import { RouteDays } from "@/models/routeDays.model";
import { Routes } from "@/models/routes.model";
import { Request, Response } from "express";

const journeysRepository = AppDataSource.getRepository(Journeys);

const getJourneysList = async (userId: number) => {
  return journeysRepository.find({
    where: {
      user: { id: userId },
    },
  });
};

const getJourneyDetail = async (journeyId: number) => {
  return journeysRepository
    .createQueryBuilder("jn")
    .select([
      "jn.id, jn.title, jn.startDate, jn.endDate, rd.day, ds.seq, place.id as placeId, place.name, place.address, place.location, place.img",
    ])
    .leftJoin(Routes, "rt", "rt.id = jn.routeId")
    .leftJoin(RouteDays, "rd", "rd.routeId = rt.id")
    .leftJoin(DaySeq, "ds", "ds.routeDayId = rd.id")
    .leftJoin(Places, "place", "place.id = ds.placeId")
    .where("jn.id =:journeyId", { journeyId })
    .getRawMany();
};

const JourneysRepository = {
  getJourneysList,
  getJourneyDetail,
  journeysRepository,
};

export default JourneysRepository;
