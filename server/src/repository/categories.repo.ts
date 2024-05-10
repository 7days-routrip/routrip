import { AppDataSource } from "@/config/ormSetting";
import { Continents } from "@/models/continents.model";
import { Countries } from "@/models/countries.model";
import { Not } from "typeorm";

export const getcontinentList = async () => {
  const repo = AppDataSource.getRepository(Continents);
  try {
    return await repo.find();
  } catch (err) {}
};
