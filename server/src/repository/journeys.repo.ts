import { AppDataSource } from "@/config/ormSetting";
import { DaySeq } from "@/models/daySeq.model";
import { Journeys } from "@/models/journeys.model";
import { Places } from "@/models/places.model";
import { RouteDays } from "@/models/routeDays.model";
import { Routes } from "@/models/routes.model";

const getJourneyData = async (journeyId: number) => {
  const repo = AppDataSource.getRepository(Journeys);
  try {
    const result = await repo
      .createQueryBuilder("j")
      .select([
        "j.id, rd.day, ds.seq, place.name, place.address, place.tel, place.id as placeId, place.openingHours, place.img, place.location",
      ])
      .leftJoin(Routes, "rt", "rt.id = j.routeId")
      .leftJoin(RouteDays, "rd", "rd.routeId = rt.id")
      .leftJoin(DaySeq, "ds", "ds.routeDayId = rd.id")
      .leftJoin(Places, "place", "place.id = ds.placeId")
      .where("j.id =:id", { id: journeyId })
      .getRawMany();
    return result;
  } catch (err) {
    return null;
  }
};

const journeysRepository = { getJourneyData };
export default journeysRepository;
