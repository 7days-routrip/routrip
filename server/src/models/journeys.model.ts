import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Users } from "./users.model";
import { Routes } from "./routes.model";

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