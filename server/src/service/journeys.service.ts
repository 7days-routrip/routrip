import { AppDataSource } from "@/config/ormSetting";
import {
  INTERNAL_SERVER_ERROR_DELETE_JOURNEY,
  INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY,
  NOT_FOUND_JOURNEY,
  NOT_FOUND_JOURNEY_LIST,
  NOT_FOUND_PLACE,
} from "@/constants/message";
import { DaySeq } from "@/models/daySeq.model";
import { Journeys } from "@/models/journeys.model";
import { Places } from "@/models/places.model";
import { RouteDays } from "@/models/routeDays.model";
import { Routes } from "@/models/routes.model";
import { Users } from "@/models/users.model";
import { Day } from "@/types/journeys.types";
import { Request, Response } from "express";

const journeysRepo = AppDataSource.getRepository(Journeys);
const routeDaysRepo = AppDataSource.getRepository(RouteDays);
const daySeqRepo = AppDataSource.getRepository(DaySeq);

const getJourneysList = async (userId: number) => {
  const results = await journeysRepo.find({ where: { user: { id: userId } } });
  if (!results.length) throw new Error(NOT_FOUND_JOURNEY_LIST);

  return results.sort((a, b) => b.id - a.id);
};

const getJourneyDetail = async (journeyId: number) => {
  const journey = await journeysRepo.findOneBy({ id: journeyId });
  if (journey === null) throw new Error(NOT_FOUND_JOURNEY);
  if (!journey?.route) {
    return {
      id: journey?.id,
      title: journey?.title,
      startDate: new Date(journey?.startDate),
      endDate: new Date(journey?.endDate),
      days: [],
    };
  }

  const days = await routeDaysRepo.find({ where: { route: { id: journey?.route.id } } });
  const responseData = await Promise.all(
    days.map(async (day) => {
      const spots = await daySeqRepo.find({ where: { routeDay: { id: day.id } } });
      return {
        day: day.day,
        spots: !spots
          ? []
          : spots.map((spot) => {
              const [lat, lng] = spot.place.location;
              return {
                id: spot.place.id,
                placeName: spot.place.name,
                address: spot.place.address,
                location: {
                  lat: lat,
                  lng: lng,
                },
                placeImg: spot.place.img ? spot.place.img : "",
              };
            }),
      };
    }),
  );
  return {
    id: journey?.id,
    title: journey?.title,
    startDate: new Date(journey?.startDate),
    endDate: new Date(journey?.endDate),
    days: responseData,
  };
};

const register = async (title: string, startDate: Date, endDate: Date, days: Day[], user: any) => {
  await AppDataSource.transaction(async (transactionalEntityManager) => {
    let thumbnail = "";
    const routes = new Routes();
    const savedRoute = await transactionalEntityManager.getRepository(Routes).save(routes);
    if (!savedRoute) throw new Error(INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY);

    let dayCnt = 0;
    for (const value1 of days) {
      const day = value1.day;
      //save routeDays
      let routeDays = new RouteDays();
      routeDays.day = day;
      routeDays.route = savedRoute;

      const savedRouteDay = await transactionalEntityManager.getRepository(RouteDays).save(routeDays);
      if (!savedRouteDay) throw new Error(INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY);

      let seqCnt = 0;
      for (const value2 of value1.spots) {
        const placeId = value2;

        const foundPlace = await transactionalEntityManager.getRepository(Places).findOneBy({ id: placeId });
        if (!foundPlace) {
          throw new Error(NOT_FOUND_PLACE);
        }

        if (dayCnt === 0 && seqCnt === 0) thumbnail = foundPlace.img;
        //save daySeq
        let daySeq = new DaySeq();
        daySeq.routeDay = savedRouteDay;
        daySeq.place = foundPlace;
        daySeq.seq = seqCnt;

        let savedDaySeq = await transactionalEntityManager.getRepository(DaySeq).save(daySeq);
        if (!savedDaySeq) throw new Error(INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY);

        seqCnt++;
      }
      dayCnt++;
    }

    const journey = new Journeys();
    journey.title = title;
    journey.thumbnail = thumbnail;
    journey.startDate = startDate;
    journey.endDate = endDate;
    journey.route = savedRoute;

    journey.user = new Users().id = user.id;

    transactionalEntityManager.getRepository(Journeys).save(journey);
  });
};

const modify = async (id: number, title: string, startDate: Date, endDate: Date, days: Day[], user: any) => {
  //새로 등록 부분
  await AppDataSource.transaction(async (transactionalEntityManager) => {
    const foundJourney = await transactionalEntityManager.getRepository(Journeys).findOne({
      relations: ["route"],
      where: {
        id: id,
      },
    });
    if (!foundJourney) throw new Error(NOT_FOUND_JOURNEY);

    const foundJourneyId = foundJourney.id;
    const foundRouteId = foundJourney.route.id;
    let updatedJourney = await transactionalEntityManager.getRepository(Journeys).update(id, {
      title: title,
      startDate: startDate,
      endDate: endDate,
      user: (new Users().id = user.id),
    });
    const updateRouteNullResult = await transactionalEntityManager
      .getRepository(Journeys)
      .query(`UPDATE journeys SET routeId = NULL WHERE id = ${id}`);

    const deletedRouteResult = await transactionalEntityManager.getRepository(Routes).delete(foundRouteId);

    if (updateRouteNullResult.affected === 0 || deletedRouteResult.affected === 0)
      throw new Error(INTERNAL_SERVER_ERROR_DELETE_JOURNEY);

    //일정 다시 추가 부분
    let thumbnail = "";
    const routes = new Routes();
    routes.id = foundRouteId;
    const savedRoute = await transactionalEntityManager.getRepository(Routes).save(routes);
    if (!savedRoute) throw new Error(INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY);

    let dayCnt = 0;
    for (const value1 of days) {
      const day = value1.day;
      //save routeDays
      let routeDays = new RouteDays();
      routeDays.day = day;
      routeDays.route = savedRoute;

      const savedRouteDay = await transactionalEntityManager.getRepository(RouteDays).save(routeDays);
      if (!savedRouteDay) throw new Error(INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY);

      let seqCnt = 0;
      for (const value2 of value1.spots) {
        const placeId = value2;

        const foundPlace = await transactionalEntityManager.getRepository(Places).findOneBy({ id: placeId });
        if (!foundPlace) {
          throw new Error(NOT_FOUND_PLACE); // 없는 장소를 추가할 경우 로직구현해야함
        }

        if (dayCnt === 0 && seqCnt === 0) thumbnail = foundPlace.img;
        //save daySeq
        let daySeq = new DaySeq();
        daySeq.routeDay = savedRouteDay;
        daySeq.place = foundPlace;
        daySeq.seq = seqCnt;

        let savedDaySeq = await transactionalEntityManager.getRepository(DaySeq).save(daySeq);
        if (!savedDaySeq) throw new Error(INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY);

        seqCnt++;
      }
      dayCnt++;
    }

    updatedJourney = await transactionalEntityManager.getRepository(Journeys).update(id, {
      route: savedRoute,
      thumbnail: thumbnail,
    });

    if (!updatedJourney) throw new Error(INTERNAL_SERVER_ERROR_UPLOAD_JOURNEY);
  });
};

const remove = async (id: number) => {
  await AppDataSource.transaction(async (transactionalEntityManager) => {
    const foundJourney = await transactionalEntityManager.getRepository(Journeys).findOne({
      relations: ["route"],
      where: {
        id: id,
      },
    });
    if (!foundJourney) {
      throw new Error(NOT_FOUND_JOURNEY);
    }
    const foundRouteId = foundJourney.route.id;
    const deletedJourneyResult = await transactionalEntityManager.getRepository(Journeys).delete(id);
    const deletedRouteResult = await transactionalEntityManager.getRepository(Routes).delete(foundRouteId);

    if (deletedJourneyResult.affected === 0 || deletedRouteResult.affected === 0)
      throw new Error(INTERNAL_SERVER_ERROR_DELETE_JOURNEY);
  });
};
const JourneysService = {
  getJourneysList,
  getJourneyDetail,
  register,
  modify,
  remove,
};

export default JourneysService;
