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
  const results = await JourneysRepository.getJourneysList(userId);
  if (!results.length) throw new Error("등록하신 일정이 없습니다.");

  return results;
};

const getJourneyDetail = async (journeyId: number) => {
  const result = await JourneysRepository.getJourneyData(journeyId);
  if (!result.length) throw new Error("일정 정보를 찾을 수 없습니다.");

  let days = [];
  for (let i = 0; i <= result[result.length - 1].day; i++) {
    // day n일차
    let spots = [];
    for (let j = 0; j < result.length; j++) {
      // 해당 day의 seq 데이터
      if (result[j].day === i) {
        const [lat, lng] = result[j].location.split(", ");
        spots.push({
          id: result[j].placeId,
          placeName: result[j].name,
          address: result[j].address,
          location: {
            lat: lat,
            lng: lng,
          },
          placeImg: result[j].img,
        });
      }
    }
    days.push({
      day: i,
      spots: spots,
    });
  }

  const journey = {
    id: result[0].id,
    title: result[0].title,
    startDate: result[0].startDate,
    endDate: result[0].endDate,
    days: days,
  };

  return journey;
};

const register = async (title: string, startDate: Date, endDate: Date, days: Day[], user: any) => {
  await AppDataSource.transaction(async (transactionalEntityManager) => {
    let thumbnail = "";
    const routes = new Routes();
    const savedRoute = await transactionalEntityManager.getRepository(Routes).save(routes);
    if (!savedRoute) throw new Error("경로 저장에 실패했습니다.");

    let dayCnt = 0;
    for (const value1 of days) {
      const day = value1.day;
      //save routeDays
      let routeDays = new RouteDays();
      routeDays.day = day;
      routeDays.route = savedRoute;

      const savedRouteDay = await transactionalEntityManager.getRepository(RouteDays).save(routeDays);
      if (!savedRouteDay) throw new Error("경로 저장에 실패했습니다.");

      let seqCnt = 0;
      for (const value2 of value1.spots) {
        const placeId = value2;

        const foundPlace = await transactionalEntityManager.getRepository(Places).findOneBy({ id: placeId });
        if (!foundPlace) {
          throw new Error("장소를 찾을 수 없습니다."); // 없는 장소를 추가할 경우 로직구현해야함
        }

        if (dayCnt == 0 || seqCnt == 0) thumbnail = foundPlace.img;
        //save daySeq
        let daySeq = new DaySeq();
        daySeq.routeDay = savedRouteDay;
        daySeq.place = foundPlace;
        daySeq.seq = seqCnt;

        let savedDaySeq = await transactionalEntityManager.getRepository(DaySeq).save(daySeq);
        if (!savedDaySeq) throw new Error("경로 저장에 실패했습니다.");

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
    if (!foundJourney) throw new Error("일정 정보를 찾을 수 없습니다.");

    const foundJourneyId = foundJourney.id;
    const foundRouteId = foundJourney.route.id;
    const deletedJourneyResult = await transactionalEntityManager.getRepository(Journeys).delete(id);
    const deletedRouteResult = await transactionalEntityManager.getRepository(Routes).delete(foundRouteId);

    if (deletedJourneyResult.affected == 0 || deletedRouteResult.affected == 0)
      throw new Error("일정이 정상적으로 삭제되지 않았습니다.");

    //일정 다시 추가 부분
    let thumbnail = "";
    const routes = new Routes();
    routes.id = foundRouteId;
    const savedRoute = await transactionalEntityManager.getRepository(Routes).save(routes);
    if (!savedRoute) throw new Error("경로 저장에 실패했습니다.");

    let dayCnt = 0;
    for (const value1 of days) {
      const day = value1.day;
      //save routeDays
      let routeDays = new RouteDays();
      routeDays.day = day;
      routeDays.route = savedRoute;

      const savedRouteDay = await transactionalEntityManager.getRepository(RouteDays).save(routeDays);
      if (!savedRouteDay) throw new Error("경로 저장에 실패했습니다.");

      let seqCnt = 0;
      for (const value2 of value1.spots) {
        const placeId = value2;

        const foundPlace = await transactionalEntityManager.getRepository(Places).findOneBy({ id: placeId });
        if (!foundPlace) {
          throw new Error("장소를 찾을 수 없습니다."); // 없는 장소를 추가할 경우 로직구현해야함
        }

        if (dayCnt == 0 || seqCnt == 0) thumbnail = foundPlace.img;
        //save daySeq
        let daySeq = new DaySeq();
        daySeq.routeDay = savedRouteDay;
        daySeq.place = foundPlace;
        daySeq.seq = seqCnt;

        let savedDaySeq = await transactionalEntityManager.getRepository(DaySeq).save(daySeq);
        if (!savedDaySeq) throw new Error("경로 저장에 실패했습니다.");

        seqCnt++;
      }
      dayCnt++;
    }

    const journey = new Journeys();
    journey.id = foundJourneyId;
    journey.title = title;
    journey.thumbnail = thumbnail;
    journey.startDate = startDate;
    journey.endDate = endDate;
    journey.route = savedRoute;

    journey.user = new Users().id = user.id;

    transactionalEntityManager.getRepository(Journeys).save(journey);
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
      throw new Error("일정 정보를 찾을 수 없습니다.");
    }
    const foundRouteId = foundJourney.route.id;
    const deletedJourneyResult = await transactionalEntityManager.getRepository(Journeys).delete(id);
    const deletedRouteResult = await transactionalEntityManager.getRepository(Routes).delete(foundRouteId);

    if (deletedJourneyResult.affected == 0 || deletedRouteResult.affected == 0)
      throw new Error("일정이 정상적으로 삭제되지 않았습니다.");
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
