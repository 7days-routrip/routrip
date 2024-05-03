import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Places } from "./places.model";
import { Users } from "./users.model";

@Entity()
export class Picks {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne((type) => Users)
  @JoinColumn({
    name: "userId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkUsersPicksId",
  })
  userId!: Users;

  @ManyToOne((type) => Places)
  @JoinColumn({
    name: "placeId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkPlacesPicksId",
  })
  placeId!: Places;
}
