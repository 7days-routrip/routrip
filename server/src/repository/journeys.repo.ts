import { AppDataSource } from "@/config/ormSetting";
import { DaySeq } from "@/models/daySeq.model";
import { Journeys } from "@/models/journeys.model";
import { Places } from "@/models/places.model";
import { RouteDays } from "@/models/routeDays.model";
import { Routes } from "@/models/routes.model";
import { Request, Response } from "express";

const journeysRepository = AppDataSource.getRepository(Journeys);

const getJourneysList = async (userId: number) => {
  const result = await journeysRepository.find({
    where: {
      user: { id: userId },
    },
  });

  return result;
};

const getJourneyData = async (journeyId: number) => {
  const result = await journeysRepository
    .createQueryBuilder("jn")
    .select([
      "jn.id, jn.title, jn.startDate, jn.endDate, rd.day, ds.seq, place.id as placeId, place.name, place.address, place.openingHours, place.tel, TRIM(SUBSTRING_INDEX(place.location,',', 1)) as lat, TRIM(SUBSTRING_INDEX(place.location,',', -1)) as lng, place.img",
    ])
    .leftJoin(Routes, "rt", "rt.id = jn.routeId")
    .leftJoin(RouteDays, "rd", "rd.routeId = rt.id")
    .leftJoin(DaySeq, "ds", "ds.routeDayId = rd.id")
    .leftJoin(Places, "place", "place.id = ds.placeId")
    .where("jn.id =:journeyId", { journeyId })
    .getRawMany();

  return result;
};

const JourneysRepository = {
  getJourneyData,
  getJourneysList,
  journeysRepository,
};

export default JourneysRepository;
