import { AppDataSource } from "@/config/ormSetting";
import { Continents } from "@/models/continents.model";
import { Countries } from "@/models/countries.model";
import { getcontinentList } from "@/repository/categories.repo";
import { Request, Response } from "express";
export const getCategoryListRequest = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Continents);
    const ctrRepo = AppDataSource.getRepository(Countries);
    const continentList = await repo.find();
    const countryList = await ctrRepo.find({ relations: { continent: true } });
    const responseData = continentList.map((value) => {
      const countrydata = [];
      for (let i = 0; i < countryList.length; i++) {
        if (value.id == countryList[i].continent.id) {
          countrydata.push({
            id: countryList[i].id,
            name: countryList[i].name,
          });
        }
      }
      return {
        id: value.id,
        name: value.name,
        country: countrydata,
      };
    });

    res.status(200).json(responseData);
  } catch (err) {}
};
