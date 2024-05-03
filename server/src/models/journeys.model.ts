
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Routes } from "./routes.model";
import { Users } from "./users.model";

@Entity()
export class Journeys {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @ManyToOne((type) => Users)
  @JoinColumn({
    name: "userId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkUsersJourneysId",
  })
  userId!: Users;

  @ManyToOne((type) => Routes)
  @JoinColumn({
    name: "routeId",
    referencedColumnName: "id",
    foreignKeyConstraintName: "fkRoutesJourneysId",
  })
  routeId!: Routes;

  @Column("datetime")
  startDate!: string;

  @Column("datetime")
  endDate!: string;

}

