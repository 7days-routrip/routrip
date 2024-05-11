import { AppDataSource } from "@/config/ormSetting";
import { DaySeq } from "@/models/daySeq.model";
import { Journeys } from "@/models/journeys.model";
import { Places } from "@/models/places.model";
import { RouteDays } from "@/models/routeDays.model";
import { Routes } from "@/models/routes.model";
import { Users } from "@/models/users.model";
import JourneysRepository from "@/repository/journeys.repo";
import { Day } from "@/types/journeys.types";
import { Request, Response } from "express";

const getJourneysList = async (userId: number) => {
  await JourneysRepository.getJourneysList(userId);
};

const register = async (title: string, startDate: Date, endDate: Date, days: Day[], user: any) => {
  const routesRepository = AppDataSource.getRepository(Routes);
  const routeDaysRepository = AppDataSource.getRepository(RouteDays);
  const daySeqRepository = AppDataSource.getRepository(DaySeq);
  const placeRepository = AppDataSource.getRepository(Places);

  let thumbnail = "";
  let routes = new Routes();
  const savedRoute = await routesRepository.save(routes);

  for (const value1 of days) {
    const day = value1.day;
    const spots = value1.spots;
    //save routeDays
    let routeDays = new RouteDays();
    routeDays.day = day;
    routeDays.route = savedRoute;

    const savedRouteDay = await routeDaysRepository.save(routeDays);

    let cnt = 0;
    for (const value2 of value1.spots) {
      const placeId = value2;

      const foundPlace = await placeRepository.findOneBy({ id: placeId });
      if (!foundPlace) {
        return; // 없는 장소를 추가할 경우 로직구현해야함
      }
      thumbnail = foundPlace.img;
      //save daySeq
      let daySeq = new DaySeq();
      daySeq.routeDay = savedRouteDay;
      daySeq.place = foundPlace;
      daySeq.seq = cnt;

      let result = await daySeqRepository.save(daySeq);
      cnt++;
    }
  }

  const journey = new Journeys();
  journey.title = title;
  journey.thumbnail = thumbnail;
  journey.startDate = startDate;
  journey.endDate = endDate;
  journey.route = savedRoute;

  journey.user = new Users().id = user.id;

  JourneysRepository.journeysRepository.save(journey);
};

const JourneysService = {
  getJourneysList,
  register,
};

export default JourneysService;
