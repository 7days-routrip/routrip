import JourneysRepository from "@/repository/journeys.repo";
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

const JourneysService = {
  getJourneysList,
  getJourneyDetail,
};

export default JourneysService;