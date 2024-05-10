import { AppDataSource } from "@/config/ormSetting";
import { Continents } from "@/models/continents.model";
import { Countries } from "@/models/countries.model";

const reqCategoryList = async () => {
  const ctnRepo = AppDataSource.getRepository(Continents);
  const ctrRepo = AppDataSource.getRepository(Countries);
  const continentList = await ctnRepo.find();
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
  return responseData;
};

const CategoriesService = { reqCategoryList };

export default CategoriesService;
