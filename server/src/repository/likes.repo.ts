import { ObjectLiteral, Repository } from "typeorm";

export const PlaceLikesListResult = async (repo: Repository<ObjectLiteral>, userId: number) => {
  const repository = repo;
  try {
    const result = await repository
      .createQueryBuilder("p")
      .leftJoinAndSelect("p.placeId", "places")
      .where("p.userId = :id", { id: userId })
      .getRawMany();
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const placeUnlikeRequestResult = async (repo: Repository<ObjectLiteral>, userId: number, placeId: number) => {
  const repository = repo;
  try {
    const result = await repository.delete({
      userId: userId,
      placeId: placeId,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const placeLikeRequestResult = async (repo: Repository<ObjectLiteral>, userId: number, placeId: number) => {
  const repository = repo;
  try {
    const result = await repository.insert({
      userId: userId,
      placeId: placeId,
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const alreadyLikePlaceCheck = async (repo: Repository<ObjectLiteral>, userId: number, placeId: number) => {
  const repository = repo;
  try {
    const result = await repository
      .createQueryBuilder("check")
      .where("check.userId = :userId", { userId: userId })
      .andWhere("check.placeId = :placeId", { placeId: placeId })
      .getRawOne();

    return result;
  } catch (err) {
    console.log(err);
  }
};
